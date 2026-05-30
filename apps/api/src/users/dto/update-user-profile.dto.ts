import type { UpdateUserProfileRequest } from '@workspace/shared';

export class UpdateUserProfileDto implements UpdateUserProfileRequest {
  name?: string | null;
  photoUrl?: string | null;
  bio?: string | null;
  travelStyle?: UpdateUserProfileRequest['travelStyle'];
  interests?: string[];
}
