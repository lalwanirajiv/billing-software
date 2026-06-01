export const DISCOUNT_TYPES = {
  AMOUNT: 'amount',
  PERCENT: 'percent',
};

/** Rupee discount applied before tax (matches existing grand-total formula). */
export function resolveDiscountAmount(subtotal, discountType, discountValue) {
  const sub = Number(subtotal) || 0;
  const raw = Number(discountValue) || 0;
  if (raw <= 0 || sub <= 0) return 0;

  if (discountType === DISCOUNT_TYPES.PERCENT) {
    const pct = Math.min(100, Math.max(0, raw));
    return Math.round((sub * pct) / 100 * 100) / 100;
  }

  return Math.min(sub, Math.max(0, raw));
}

export function validateDiscount(discountType, discountValue, subtotal) {
  const raw = Number(discountValue);
  if (discountValue === '' || discountValue == null || Number.isNaN(raw)) {
    return null;
  }
  if (raw < 0) {
    return 'Discount cannot be negative.';
  }
  if (discountType === DISCOUNT_TYPES.PERCENT) {
    if (raw > 100) {
      return 'Discount cannot exceed 100%.';
    }
    return null;
  }
  const sub = Number(subtotal) || 0;
  if (sub > 0 && raw > sub) {
    return 'Discount cannot exceed subtotal.';
  }
  return null;
}

/** When switching input mode, convert the current value. */
export function convertDiscountValue(subtotal, fromType, toType, currentValue) {
  const sub = Number(subtotal) || 0;
  const current = Number(currentValue) || 0;
  if (current <= 0) return 0;
  if (sub <= 0) return current;

  if (fromType === DISCOUNT_TYPES.AMOUNT && toType === DISCOUNT_TYPES.PERCENT) {
    return Math.round((current / sub) * 10000) / 100;
  }
  if (fromType === DISCOUNT_TYPES.PERCENT && toType === DISCOUNT_TYPES.AMOUNT) {
    return Math.round((sub * current) / 100 * 100) / 100;
  }
  return current;
}
