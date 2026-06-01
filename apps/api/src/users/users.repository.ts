import { Injectable } from '@nestjs/common';
import type {
  AdminUser,
  AdminUserDetail,
  CurrentUserResponse,
  TravelStyle,
  UpdateAdminUserRequest,
  UpdateUserProfileRequest,
  UserProfile,
} from '@workspace/shared';
import { PrismaService } from '../prisma/prisma.service';

type UpsertClerkUserInput = {
  clerkId: string;
  email: string;
  name: string;
  imageUrl: string | null;
};

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findProfileByClerkId(clerkId: string): Promise<UserProfile | null> {
    const user = await this.prisma.db.user.findUnique({
      where: {
        clerkId,
      },
    });

    return user ? this.toUserProfile(user) : null;
  }

  async updateProfileByClerkId(
    clerkId: string,
    input: UpdateUserProfileRequest,
  ): Promise<UserProfile | null> {
    const data = this.toUpdateData(input);

    const existingUser = await this.prisma.db.user.findUnique({
      where: {
        clerkId,
      },
      select: {
        id: true,
      },
    });

    if (!existingUser) {
      return null;
    }

    const user = await this.prisma.db.user.update({
      where: {
        clerkId,
      },
      data,
    });

    return this.toUserProfile(user);
  }

  async upsertClerkUser(
    input: UpsertClerkUserInput,
  ): Promise<CurrentUserResponse> {
    const userData = {
      clerkId: input.clerkId,
      email: input.email,
      name: input.name,
      photoUrl: input.imageUrl,
    };

    const user = await this.prisma.db.user.upsert({
      where: {
        clerkId: input.clerkId,
      },
      update: userData,
      create: userData,
    });

    return {
      id: user.id,
      clerkId: input.clerkId,
      email: user.email,
      name: user.name ?? '',
      imageUrl: user.photoUrl,
    };
  }

  async deleteByClerkId(clerkId: string): Promise<void> {
    await this.prisma.db.user.deleteMany({
      where: {
        clerkId,
      },
    });
  }

  async findAdminUserById(id: string): Promise<AdminUserDetail | null> {
    const user = await this.prisma.db.user.findUnique({
      where: {
        id,
      },
    });

    return user ? this.toAdminUserDetail(user) : null;
  }

  async getAdminUsers(): Promise<AdminUser[]> {
    const users = await this.prisma.db.user.findMany({
      select: {
        id: true,
        clerkId: true,
        email: true,
        name: true,
        photoUrl: true,
        travelStyle: true,
        hasCompletedOnboarding: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return users.map((user) => ({
      id: user.id,
      clerkId: user.clerkId,
      email: user.email,
      name: user.name,
      imageUrl: user.photoUrl,
      travelStyle: user.travelStyle,
      hasCompletedOnboarding: user.hasCompletedOnboarding,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    }));
  }

  async updateAdminUserById(
    id: string,
    input: UpdateAdminUserRequest,
  ): Promise<AdminUserDetail | null> {
    const existingUser = await this.prisma.db.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    if (!existingUser) {
      return null;
    }

    const user = await this.prisma.db.user.update({
      where: {
        id,
      },
      data: {
        hasCompletedOnboarding: input.hasCompletedOnboarding,
      },
    });

    return this.toAdminUserDetail(user);
  }

  private toAdminUserDetail(user: {
    bio: string | null;
    clerkId: string;
    createdAt: Date;
    email: string;
    hasCompletedOnboarding: boolean;
    id: string;
    interests: string[];
    name: string | null;
    photoUrl: string | null;
    travelStyle: TravelStyle;
    updatedAt: Date;
  }): AdminUserDetail {
    return {
      ...this.toUserProfile(user),
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  private toUpdateData(input: UpdateUserProfileRequest) {
    const data: {
      bio?: string | null;
      hasCompletedOnboarding?: boolean;
      interests?: string[];
      name?: string | null;
      photoUrl?: string | null;
      travelStyle?: UpdateUserProfileRequest['travelStyle'];
    } = {};

    if ('bio' in input) {
      data.bio = input.bio ?? null;
    }

    if (
      'hasCompletedOnboarding' in input &&
      input.hasCompletedOnboarding !== undefined
    ) {
      data.hasCompletedOnboarding = input.hasCompletedOnboarding;
    }

    if ('interests' in input && input.interests !== undefined) {
      data.interests = input.interests;
    }

    if ('name' in input) {
      data.name = input.name ?? null;
    }

    if ('photoUrl' in input) {
      data.photoUrl = input.photoUrl ?? null;
    }

    if ('travelStyle' in input && input.travelStyle !== undefined) {
      data.travelStyle = input.travelStyle;
    }

    return data;
  }

  private toUserProfile(user: {
    bio: string | null;
    clerkId: string;
    email: string;
    hasCompletedOnboarding: boolean;
    id: string;
    interests: string[];
    name: string | null;
    photoUrl: string | null;
    travelStyle: TravelStyle;
  }): UserProfile {
    return {
      id: user.id,
      clerkId: user.clerkId,
      email: user.email,
      name: user.name,
      photoUrl: user.photoUrl,
      bio: user.bio,
      travelStyle: user.travelStyle,
      interests: user.interests,
      hasCompletedOnboarding: user.hasCompletedOnboarding,
    };
  }
}
