import RefreshToken from "../entities/RefreshToken";

export default interface RefreshTokenRepository {
    createRefreshToken(userId: string, expiresIn: Date): Promise<string>;
    getRefreshTokenById(id: string): Promise<RefreshToken | null>;
    getRefreshTokenByUserId(userId: string): Promise<RefreshToken | null>;
    deleteRefreshToken(id: string): Promise<void>;
}
