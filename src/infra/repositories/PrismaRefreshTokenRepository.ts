import RefreshTokenRepository from "@/src/domain/repositories/RefreshTokenRepository";
import prisma from "../database/prisma/prisma";
import RefreshToken from "@/src/domain/entities/RefreshToken";

export default class PrismaRefreshTokenRepository
    implements RefreshTokenRepository
{
    async createRefreshToken(userId: string, expiresIn: Date): Promise<string> {
        const result = await prisma.refreshToken.create({
            data: {
                userId,
                expiresIn,
            },
        });
        return result.id;
    }

    async getRefreshTokenById(id: string): Promise<RefreshToken | null> {
        const result = await prisma.refreshToken.findUnique({
            where: {
                id,
            },
            include: {
                user: true,
            },
        });
        if (!result) return null;
        return new RefreshToken(
            {
                id: result.user.id,
                email: result.user.email,
            },
            result.id,
            result.expiresIn,
        );
    }

    async getRefreshTokenByUserId(
        userId: string,
    ): Promise<RefreshToken | null> {
        const result = await prisma.refreshToken.findUnique({
            where: {
                userId,
            },
            include: {
                user: true,
            },
        });
        if (!result) return null;
        return new RefreshToken(
            {
                id: result.user.id,
                email: result.user.email,
            },
            result.id,
            result.expiresIn,
        );
    }

    async deleteRefreshToken(id: string): Promise<void> {
        await prisma.refreshToken.delete({
            where: {
                id,
            },
        });
    }
}
