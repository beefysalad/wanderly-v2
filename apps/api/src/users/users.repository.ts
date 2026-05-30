import { Injectable } from "@nestjs/common"
import type {
  CurrentUserResponse,
  GetAllUsersResponse,
} from "@workspace/shared"
import { PrismaService } from "../prisma/prisma.service"

type UpsertClerkUserInput = {
  clerkId: string
  email: string
  name: string
  imageUrl: string | null
}

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async upsertClerkUser(
    input: UpsertClerkUserInput
  ): Promise<CurrentUserResponse> {
    const userData = {
      clerkId: input.clerkId,
      email: input.email,
      name: input.name,
      photoUrl: input.imageUrl,
    }

    const user = await this.prisma.db.user.upsert({
      where: {
        clerkId: input.clerkId,
      },
      update: userData,
      create: userData,
    })

    return {
      id: user.id,
      clerkId: input.clerkId,
      email: user.email,
      name: user.name ?? "",
      imageUrl: user.photoUrl,
    }
  }

  async deleteByClerkId(clerkId: string): Promise<void> {
    await this.prisma.db.user.deleteMany({
      where: {
        clerkId,
      },
    })
  }
  async getAllUsers(): Promise<GetAllUsersResponse> {
    const users = await this.prisma.db.user.findMany({
      select: {
        id: true,
        clerkId: true,
        email: true,
        name: true,
        photoUrl: true,
      },
    })

    return {
      users: users.map((user) => ({
        id: user.id,
        clerkId: user.clerkId,
        email: user.email,
        name: user.name ?? "",
        imageUrl: user.photoUrl,
      })),
    }
  }
}
