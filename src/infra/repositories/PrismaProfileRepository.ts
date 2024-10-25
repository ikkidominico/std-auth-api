import { Profile } from "@/src/domain/entities/Profile";
import { ProfileRepository } from "@/src/domain/repositories/ProfileRepository";
import { prisma } from "../database/prisma/prisma";
import { User } from "@/src/domain/entities/User";

export class PrismaProfileRepository implements ProfileRepository {
    async createProfile(profile: Profile): Promise<void> {
        const { name, birth, user } = profile;
        await prisma.profile.create({
            data: {
                name,
                birth,
                userId: user.id,
            },
        });
    }

    async getProfileByUserId(userId: string): Promise<Profile | null> {
        const result = await prisma.profile.findUnique({
            where: {
                userId,
            },
            include: {
                user: true,
            },
        });
        if (!result) return null;
        const user = new User(result.user.id, result.user.email);
        return new Profile(
            user,
            result.name as string | undefined,
            result.birth as Date | undefined,
        );
    }

    async updateProfileByUserId(
        userId: string,
        data: { name?: string; birth?: Date },
    ): Promise<Profile | null> {
        const { name, birth } = data;
        const result = await prisma.profile.update({
            data: {
                name,
                birth,
            },
            where: {
                userId,
            },
            include: {
                user: true,
            },
        });
        const user = new User(result.user.id, result.user.email);
        return new Profile(
            user,
            result.name as string | undefined,
            result.birth as Date | undefined,
        );
    }

    async deleteProfileByUserId(userId: string): Promise<void> {
        await prisma.profile.delete({
            where: {
                userId,
            },
        });
    }
}
