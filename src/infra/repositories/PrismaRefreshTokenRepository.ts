import { RefreshTokenRepository } from "@/src/domain/repositories/RefreshTokenRepository";
import { prisma } from "../database/prisma/prisma";
import { RefreshToken } from "@/src/domain/entities/RefreshToken";

export class PrismaRefreshTokenRepository implements RefreshTokenRepository {
    async createRefreshToken(
        id: string,
        expiresIn: Date,
        userId: string,
    ): Promise<string> {
        const result = await prisma.refreshToken.create({
            data: {
                id,
                expiresIn,
                userId,
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
        return new RefreshToken(result.id, result.expiresIn, {
            id: result.user.id,
            email: result.user.email,
        });
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
        return new RefreshToken(result.id, result.expiresIn, {
            id: result.user.id,
            email: result.user.email,
        });
    }

    async updateRefreshTokenByUserId(
        id: string,
        userId: string,
        expiresIn?: Date,
    ): Promise<RefreshToken | null> {
        const result = await prisma.refreshToken.update({
            data: {
                id,
                expiresIn,
            },
            where: {
                userId,
            },
            include: {
                user: true,
            },
        });
        return new RefreshToken(result.id, result.expiresIn, {
            id: result.user.id,
            email: result.user.email,
        });
    }

    async deleteRefreshToken(id: string): Promise<void> {
        await prisma.refreshToken.delete({
            where: {
                id,
            },
        });
    }
}
