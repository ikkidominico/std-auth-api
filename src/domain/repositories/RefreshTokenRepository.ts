import { RefreshToken } from "../entities/RefreshToken";

export interface RefreshTokenRepository {
    createRefreshToken(
        id: string,
        expiresIn: Date,
        userId: string,
    ): Promise<string>;

    getRefreshTokenById(id: string): Promise<RefreshToken | null>;

    getRefreshTokenByUserId(userId: string): Promise<RefreshToken | null>;

    updateRefreshTokenByUserId(
        id: string,
        userId: string,
        expiresIn?: Date,
    ): Promise<RefreshToken | null>;

    deleteRefreshToken(id: string): Promise<void>;
}
