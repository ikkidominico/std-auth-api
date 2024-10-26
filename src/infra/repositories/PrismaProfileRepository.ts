import { Profile } from "@/src/domain/entities/Profile";
import { ProfileRepository } from "@/src/domain/repositories/ProfileRepository";
import { prisma } from "../database/prisma/prisma";
import { User } from "@/src/domain/entities/User";

export class PrismaProfileRepository implements ProfileRepository {
    async createProfile({
        name,
        birth,
        userId,
    }: {
        name?: string;
        birth?: Date;
        userId: string;
    }): Promise<void> {
        await prisma.profile.create({
            data: {
                name,
                birth,
                userId,
            },
        });
    }

    async getProfileByUserId({
        userId,
    }: {
        userId: string;
    }): Promise<Profile | undefined> {
        const result = await prisma.profile.findUnique({
            where: {
                userId,
            },
            include: {
                user: true,
            },
        });
        if (!result) return undefined;
        const user = new User({ id: result.user.id, email: result.user.email });
        const profile = new Profile({ user });
        if (result.name) profile.name = result.name;
        if (result.birth) profile.birth = result.birth;
        return profile;
    }

    async updateProfileByUserId({
        name,
        birth,
        userId,
    }: {
        name?: string;
        birth?: Date;
        userId: string;
    }): Promise<Profile | undefined> {
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
        const user = new User({ id: result.user.id, email: result.user.email });
        const profile = new Profile({ user });
        if (result.name) profile.name = result.name;
        if (result.birth) profile.birth = result.birth;
        return profile;
    }

    async deleteProfileByUserId({ userId }: { userId: string }): Promise<void> {
        await prisma.profile.delete({
            where: {
                userId,
            },
        });
    }
}
