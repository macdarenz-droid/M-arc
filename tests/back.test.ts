import { describe, it, expect, beforeEach } from 'vitest';
import { handleBack } from '@/native/back';
import { escobarUi } from '@/escobar/state';
import { openPanel, showPanel, tab } from '@/app/router';
import { registerSheet, sheetStack, unregisterSheet } from '@/ui/sheetStack';

describe('Android back order (R5.3)', () => {
  beforeEach(() => { sheetStack.value = []; openPanel.value = null; tab.value = 'today'; escobarUi.value = { ...escobarUi.value, open: false }; });

  it('Escobar, then the top sheet, then the panel, then Today, then minimise', () => {
    const closed: string[] = [];
    tab.value = 'history';
    showPanel('settings');
    registerSheet('a', () => { closed.push('a'); unregisterSheet('a'); });
    registerSheet('b', () => { closed.push('b'); unregisterSheet('b'); });
    escobarUi.value = { ...escobarUi.value, open: true };

    expect(handleBack()).toBe('escobar');
    expect(escobarUi.value.open).toBe(false);
    expect(handleBack()).toBe('sheet');
    expect(handleBack()).toBe('sheet');
    expect(closed).toEqual(['b', 'a']);
    expect(handleBack()).toBe('panel');
    expect(openPanel.value).toBeNull();
    expect(handleBack()).toBe('today');
    expect(tab.value).toBe('today');
    expect(handleBack()).toBe('minimize');
  });
});
