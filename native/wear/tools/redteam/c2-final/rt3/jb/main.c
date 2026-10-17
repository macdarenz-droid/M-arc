#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>
#include "jerryscript.h"
static jerry_value_t print_h(const jerry_value_t f, const jerry_value_t t, const jerry_value_t a[], const jerry_length_t n) {
  for (jerry_length_t i = 0; i < n; i++) {
    jerry_value_t s = jerry_value_to_string(a[i]);
    jerry_size_t z = jerry_get_utf8_string_size(s); char *b = malloc(z + 1);
    jerry_string_to_utf8_char_buffer(s, (jerry_char_t *)b, z); b[z] = 0;
    printf(i ? " %s" : "%s", b); free(b); jerry_release_value(s);
  }
  printf("\n"); fflush(stdout); return jerry_create_undefined();
}
static jerry_value_t mem_h(const jerry_value_t f, const jerry_value_t t, const jerry_value_t a[], const jerry_length_t n) {
  jerry_heap_stats_t st; memset(&st, 0, sizeof st);
  if (n && jerry_value_is_boolean(a[0]) && jerry_get_boolean_value(a[0])) jerry_gc(JERRY_GC_PRESSURE_HIGH);
  if (!jerry_get_memory_stats(&st)) return jerry_create_number(-1);
  jerry_value_t o = jerry_create_object();
  jerry_value_t k1 = jerry_create_string((const jerry_char_t *)"alloc"), v1 = jerry_create_number((double)st.allocated_bytes);
  jerry_value_t k2 = jerry_create_string((const jerry_char_t *)"peak"), v2 = jerry_create_number((double)st.peak_allocated_bytes);
  jerry_release_value(jerry_set_property(o, k1, v1)); jerry_release_value(jerry_set_property(o, k2, v2));
  jerry_release_value(k1); jerry_release_value(v1); jerry_release_value(k2); jerry_release_value(v2);
  return o;
}
extern uintptr_t rt3_stack_max;
uintptr_t ecma_get_current_stack_usage (void);
static jerry_value_t stk_h(const jerry_value_t f, const jerry_value_t t, const jerry_value_t a[], const jerry_length_t n) {
  double o = (double) rt3_stack_max;
  if (n && jerry_value_is_number(a[0])) { double x = jerry_get_number_value(a[0]); if (x < 0) return jerry_create_number((double) ecma_get_current_stack_usage()); rt3_stack_max = (uintptr_t) x; }
  return jerry_create_number(o);
}
static void reg(const char *name, jerry_external_handler_t h) {
  jerry_value_t g = jerry_get_global_object(), k = jerry_create_string((const jerry_char_t *)name), f = jerry_create_external_function(h);
  jerry_release_value(jerry_set_property(g, k, f)); jerry_release_value(k); jerry_release_value(f); jerry_release_value(g);
}
int main(int argc, char **argv) {
  FILE *fp = fopen(argv[1], "rb"); fseek(fp, 0, SEEK_END); long z = ftell(fp); fseek(fp, 0, SEEK_SET);
  char *src = malloc(z); fread(src, 1, z, fp); fclose(fp);
  jerry_init(JERRY_INIT_MEM_STATS);
  reg("print", print_h); reg("mem", mem_h); reg("stk", stk_h);
  jerry_value_t p = jerry_parse((const jerry_char_t *)argv[1], strlen(argv[1]), (const jerry_char_t *)src, z, JERRY_PARSE_NO_OPTS);
  int rc = 0;
  if (jerry_value_is_error(p)) { jerry_value_t e = jerry_get_value_from_error(p, false), s = jerry_value_to_string(e); char b[512]; jerry_size_t n = jerry_string_to_utf8_char_buffer(s, (jerry_char_t *)b, 511); b[n] = 0; printf("PARSE ERROR %s\n", b); rc = 2; }
  else {
    jerry_value_t r = jerry_run(p);
    if (jerry_value_is_error(r)) {
      jerry_value_t e = jerry_get_value_from_error(r, false), s = jerry_value_to_string(e);
      char b[512]; jerry_size_t n = jerry_string_to_utf8_char_buffer(s, (jerry_char_t *)b, 511); b[n] = 0;
      printf("UNCAUGHT: %s\n", b); rc = 1;
    }
    jerry_release_value(r);
  }
  jerry_release_value(p);
  jerry_cleanup();
  return rc;
}
