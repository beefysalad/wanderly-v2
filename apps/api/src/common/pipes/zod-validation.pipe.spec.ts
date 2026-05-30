import { BadRequestException } from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from './zod-validation.pipe';

describe('ZodValidationPipe', () => {
  const schema = z.object({
    name: z.string().min(1),
  });

  it('returns parsed data when validation succeeds', () => {
    const pipe = new ZodValidationPipe(schema);

    expect(pipe.transform({ name: 'Patrick' })).toEqual({ name: 'Patrick' });
  });

  it('throws a BadRequestException with issue details when validation fails', () => {
    const pipe = new ZodValidationPipe(schema);

    expect(() => pipe.transform({ name: '' })).toThrow(BadRequestException);
  });
});
