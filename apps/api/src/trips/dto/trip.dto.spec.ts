import { createTripSchema, updateTripSchema } from './trip.dto';

describe('trip DTO schemas', () => {
  it('rejects numeric create budgets with more than two decimal places', () => {
    const result = createTripSchema.safeParse({
      name: 'Surf & Slow Mornings',
      budget: 100.555,
    });

    expect(result.success).toBe(false);
  });

  it('rejects numeric update budgets with more than two decimal places', () => {
    const result = updateTripSchema.safeParse({
      budget: 100.555,
    });

    expect(result.success).toBe(false);
  });

  it('rejects create budgets with more than 10 digits before the decimal point', () => {
    const result = createTripSchema.safeParse({
      name: 'Surf & Slow Mornings',
      budget: '10000000000.00',
    });

    expect(result.success).toBe(false);
  });

  it('rejects numeric update budgets with more than 10 digits before the decimal point', () => {
    const result = updateTripSchema.safeParse({
      budget: 10000000000,
    });

    expect(result.success).toBe(false);
  });
});
