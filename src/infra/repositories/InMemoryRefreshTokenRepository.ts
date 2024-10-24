import { RefreshToken } from "@/src/domain/entities/RefreshToken";
import { RefreshTokenRepository } from "@/src/domain/repositories/RefreshTokenRepository";

export class InMemoryRefreshTokenRepository implements RefreshTokenRepository {
    refreshTokens: RefreshToken[];

    constructor() {
        this.refreshTokens = [];
    }

    async createRefreshToken(
        id: string,
        expiresIn: Date,
        userId: string,
    ): Promise<string> {
        const refreshToken = new RefreshToken(id, expiresIn, {
            id: userId,
            email: "",
        });
        this.refreshTokens.push(refreshToken);
        return id;
    }

    async getRefreshTokenById(id: string): Promise<RefreshToken | null> {
        const refreshToken = this.refreshTokens.find(
            (refreshToken) => refreshToken.id === id,
        );
        if (!refreshToken) return null;
        return refreshToken;
    }

    async getRefreshTokenByUserId(
        userId: string,
    ): Promise<RefreshToken | null> {
        const refreshToken = this.refreshTokens.find(
            (refreshToken) => refreshToken.user.id === userId,
        );
        if (!refreshToken) return null;
        return refreshToken;
    }

    async updateRefreshTokenByUserId(
        id: string,
        userId: string,
        expiresIn?: Date,
    ): Promise<RefreshToken | null> {
        const index = this.refreshTokens.findIndex(
            (refreshToken) => (refreshToken.id = id),
        );
        this.refreshTokens[index].user.id = userId;
        this.refreshTokens[index].expiresIn =
            expiresIn ||
            new Date(new Date().setHours(new Date().getHours() + 2));
        return this.refreshTokens[index];
    }

    async deleteRefreshToken(id: string): Promise<void> {
        const refreshTokens = this.refreshTokens.filter(
            (refreshToken) => refreshToken.id !== id,
        );
        this.refreshTokens = refreshTokens;
    }
}
