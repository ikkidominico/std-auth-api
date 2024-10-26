import { RefreshTokenRepository } from "@/src/domain/repositories/RefreshTokenRepository";
import { prisma } from "../database/prisma/prisma";
import { RefreshToken } from "@/src/domain/entities/RefreshToken";
import { User } from "@/src/domain/entities/User";

export class PrismaRefreshTokenRepository implements RefreshTokenRepository {
    async createRefreshToken({
        id,
        expiresIn,
        userId,
    }: {
        id: string;
        expiresIn: Date;
        userId: string;
    }): Promise<string> {
        const result = await prisma.refreshToken.create({
            data: {
                id,
                expiresIn,
                userId,
            },
        });
        return result.id;
    }

    async getRefreshTokenById({
        id,
    }: {
        id: string;
    }): Promise<RefreshToken | undefined> {
        const result = await prisma.refreshToken.findUnique({
            where: {
                id,
            },
            include: {
                user: true,
            },
        });
        if (!result) return undefined;
        const user = new User({ id: result.user.id, email: result.user.email });
        return new RefreshToken({
            id: result.id,
            expiresIn: result.expiresIn,
            user,
        });
    }

    async getRefreshTokenByUserId({
        userId,
    }: {
        userId: string;
    }): Promise<RefreshToken | undefined> {
        const result = await prisma.refreshToken.findUnique({
            where: {
                userId,
            },
            include: {
                user: true,
            },
        });
        if (!result) return undefined;
        const user = new User({ id: result.user.id, email: result.user.email });
        return new RefreshToken({
            id: result.id,
            expiresIn: result.expiresIn,
            user,
        });
    }

    async deleteRefreshToken({ id }: { id: string }): Promise<void> {
        await prisma.refreshToken.delete({
            where: {
                id,
            },
        });
    }
}
