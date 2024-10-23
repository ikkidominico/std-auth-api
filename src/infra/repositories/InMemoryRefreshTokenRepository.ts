import RefreshToken from "@/src/domain/entities/RefreshToken";
import RefreshTokenRepository from "@/src/domain/repositories/RefreshTokenRepository";

export default class InMemoryRefreshTokenRepository
    implements RefreshTokenRepository
{
    refreshTokens: RefreshToken[];

    constructor() {
        this.refreshTokens = [];
    }

    async createRefreshToken(userId: string, expiresIn: Date): Promise<string> {
        const id = Math.floor(Math.random() * 100000).toString();
        const refreshToken = new RefreshToken(
            { id: userId, email: "" },
            id,
            expiresIn,
        );
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

    async deleteRefreshToken(id: string): Promise<void> {
        const refreshTokens = this.refreshTokens.filter(
            (refreshToken) => refreshToken.id !== id,
        );
        this.refreshTokens = refreshTokens;
    }
}
