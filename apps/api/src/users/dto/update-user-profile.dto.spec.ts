import { updateUserProfileSchema } from './update-user-profile.dto';

describe('updateUserProfileSchema', () => {
  it('accepts a valid partial profile update', () => {
    const result = updateUserProfileSchema.safeParse({
      name: 'Patrick',
      travelStyle: 'BUDGET',
      interests: ['food', 'beaches'],
      hasCompletedOnboarding: true,
    });

    expect(result.success).toBe(true);
  });

  it('rejects invalid profile update fields', () => {
    const result = updateUserProfileSchema.safeParse({
      travelStyle: 'FAST',
      hasCompletedOnboarding: 'yes',
    });

    expect(result.success).toBe(false);
  });
});
