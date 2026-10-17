#!/bin/bash
S=/tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad
A=$S/c2-final/rt3/head/intermediates/loader_out_lite/js/default/pages/index/index.js
B=$S/c2-final/rv/intermediates/loader_out_lite/js/default/pages/index/index.js
cmp -l "$A" "$B" | wc -l
sed -n 9p "$A" | cut -c270-340
sed -n 9p "$B" | cut -c270-340
