import { RefreshToken } from "@/src/domain/entities/RefreshToken";
import { User } from "@/src/domain/entities/User";
import { RefreshTokenRepository } from "@/src/domain/repositories/RefreshTokenRepository";

export class InMemoryRefreshTokenRepository implements RefreshTokenRepository {
    refreshTokens: RefreshToken[];

    constructor() {
        this.refreshTokens = [];
    }

    async createRefreshToken({
        id,
        expiresIn,
        userId,
    }: {
        id: string;
        expiresIn: Date;
        userId: string;
    }): Promise<string> {
        const user = new User({ id: userId, email: "johndoe@email.com" });
        const refreshToken = new RefreshToken({ id, expiresIn, user });
        this.refreshTokens.push(refreshToken);
        return id;
    }

    async getRefreshTokenById({
        id,
    }: {
        id: string;
    }): Promise<RefreshToken | undefined> {
        const refreshToken = this.refreshTokens.find(
            (refreshToken) => refreshToken.id === id,
        );
        return refreshToken;
    }

    async getRefreshTokenByUserId({
        userId,
    }: {
        userId: string;
    }): Promise<RefreshToken | undefined> {
        const refreshToken = this.refreshTokens.find(
            (refreshToken) => refreshToken.user.id === userId,
        );
        return refreshToken;
    }

    async deleteRefreshToken({ id }: { id: string }): Promise<void> {
        const refreshTokens = this.refreshTokens.filter(
            (refreshToken) => refreshToken.id !== id,
        );
        this.refreshTokens = refreshTokens;
    }
}
