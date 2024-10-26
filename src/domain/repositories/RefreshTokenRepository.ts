import { RefreshToken } from "../entities/RefreshToken";

export interface RefreshTokenRepository {
    createRefreshToken({
        id,
        expiresIn,
        userId,
    }: {
        id: string;
        expiresIn: Date;
        userId: string;
    }): Promise<string>;

    getRefreshTokenById({
        id,
    }: {
        id: string;
    }): Promise<RefreshToken | undefined>;

    getRefreshTokenByUserId(userId: {
        userId: string;
    }): Promise<RefreshToken | undefined>;

    deleteRefreshToken({ id }: { id: string }): Promise<void>;
}
