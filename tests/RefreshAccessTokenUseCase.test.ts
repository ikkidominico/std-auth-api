import { IdService } from "@/src/application/services/IdService";
import { JwtService } from "@/src/application/services/JwtService";
import { RefreshAccessTokenUseCase } from "@/src/application/usecases/RefreshAccessTokenUseCase";
import { RefreshToken } from "@/src/domain/entities/RefreshToken";
import { User } from "@/src/domain/entities/User";
import { RefreshTokenRepository } from "@/src/domain/repositories/RefreshTokenRepository";
import { UserRepository } from "@/src/domain/repositories/UserRepository";
import { InMemoryRefreshTokenRepository } from "@/src/infra/repositories/InMemoryRefreshTokenRepository";
import { InMemoryUserRepository } from "@/src/infra/repositories/InMemoryUserRepository";
import { JsonWebTokenService } from "@/src/infra/services/JsonWebTokenService";
import { UuidService } from "@/src/infra/services/UuidService";
import { test, expect } from "vitest";

test("Should create new access token and refresh token", async () => {
    const refreshTokenRepository: RefreshTokenRepository =
        new InMemoryRefreshTokenRepository();
    const userRepository: UserRepository = new InMemoryUserRepository();
    const idService: IdService = new UuidService();
    const jwtService: JwtService = new JsonWebTokenService();
    const refreshAccessTokenUseCase: RefreshAccessTokenUseCase =
        new RefreshAccessTokenUseCase(
            refreshTokenRepository,
            userRepository,
            idService,
            jwtService,
        );

    const refreshTokenId = Math.floor(Math.random() * 100000).toString();
    const userId = Math.floor(Math.random() * 100000).toString();
    const user = new User(userId, "johndoe@email.com");
    await userRepository.createUser(user);
    const expiresIn = new Date(new Date().setHours(new Date().getHours() + 2));
    const refreshToken = new RefreshToken(refreshTokenId, expiresIn, user);
    await refreshTokenRepository.createRefreshToken(
        refreshTokenId,
        expiresIn,
        userId,
    );
    const result = await refreshAccessTokenUseCase.execute(refreshTokenId);
    expect(result.refresh_token).not.toBe(refreshToken);
});
