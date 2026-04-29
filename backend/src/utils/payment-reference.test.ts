import assert from 'node:assert/strict';
import test from 'node:test';

import { normalizePaymentReference, requiresPaymentReference } from './payment-reference';

test('normalizePaymentReference strips separators and uppercases content', () => {
    assert.equal(normalizePaymentReference(' nbm-782 331 '), 'NBM782331');
    assert.equal(normalizePaymentReference('airtel_money/abc-99'), 'AIRTELMONEYABC99');
});

test('normalizePaymentReference returns empty string for missing values', () => {
    assert.equal(normalizePaymentReference(''), '');
    assert.equal(normalizePaymentReference(undefined), '');
    assert.equal(normalizePaymentReference(null), '');
});

test('requiresPaymentReference only enforces non-cash methods', () => {
    assert.equal(requiresPaymentReference('BANK_TRANSFER'), true);
    assert.equal(requiresPaymentReference('MOBILE_CREDIT_CARD'), true);
    assert.equal(requiresPaymentReference('CASH'), false);
});
