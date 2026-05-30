import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { createClerkClient } from '@clerk/backend';
import type {
  CurrentUserResponse,
  GetAllUsersResponse,
  TravelStyle,
  UpdateUserProfileRequest,
  UserProfile,
} from '@workspace/shared';
import { UsersRepository } from './users.repository';

const travelStyles = new Set<TravelStyle>(['BUDGET', 'MID_RANGE', 'LUXURY']);

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async syncCurrentUser(clerkUserId: string): Promise<CurrentUserResponse> {
    const secretKey = process.env.CLERK_SECRET_KEY;

    if (!secretKey) {
      throw new BadRequestException('Missing CLERK_SECRET_KEY');
    }

    const clerk = createClerkClient({ secretKey });
    const clerkUser = await clerk.users.getUser(clerkUserId);
    const primaryEmail =
      clerkUser.emailAddresses.find(
        (email) => email.id === clerkUser.primaryEmailAddressId,
      ) ?? clerkUser.emailAddresses[0];

    if (!primaryEmail) {
      throw new BadRequestException('Clerk user has no email address');
    }

    const name =
      [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') ||
      clerkUser.username ||
      primaryEmail.emailAddress;

    return this.usersRepository.upsertClerkUser({
      clerkId: clerkUser.id,
      email: primaryEmail.emailAddress,
      name,
      imageUrl: clerkUser.imageUrl || null,
    });
  }

  async getAllUsers(): Promise<GetAllUsersResponse> {
    return await this.usersRepository.getAllUsers();
  }

  async getCurrentUser(clerkId: string): Promise<UserProfile> {
    const user = await this.usersRepository.findProfileByClerkId(clerkId);

    if (!user) {
      throw new NotFoundException('User profile not found');
    }

    return user;
  }

  async updateCurrentUser(
    clerkId: string,
    input: UpdateUserProfileRequest,
  ): Promise<UserProfile> {
    this.validateUpdateProfileInput(input);

    const user = await this.usersRepository.updateProfileByClerkId(
      clerkId,
      input,
    );

    if (!user) {
      throw new NotFoundException('User profile not found');
    }

    return user;
  }

  async deleteCurrentUser(clerkId: string): Promise<void> {
    await this.usersRepository.deleteByClerkId(clerkId);
  }

  private validateUpdateProfileInput(input: UpdateUserProfileRequest): void {
    if (
      input.travelStyle !== undefined &&
      !travelStyles.has(input.travelStyle)
    ) {
      throw new BadRequestException('Invalid travelStyle');
    }

    if (
      input.interests !== undefined &&
      (!Array.isArray(input.interests) ||
        input.interests.some((interest) => typeof interest !== 'string'))
    ) {
      throw new BadRequestException('interests must be an array of strings');
    }
  }
}
