import { IdService } from "@/src/application/services/IdService";
import { JwtService } from "@/src/application/services/JwtService";
import { RefreshAccessTokenUseCase } from "@/src/application/usecases/RefreshAccessTokenUseCase";
import { User } from "@/src/domain/entities/User";
import { RefreshTokenRepository } from "@/src/domain/repositories/RefreshTokenRepository";
import { UserRepository } from "@/src/domain/repositories/UserRepository";
import { InMemoryRefreshTokenRepository } from "@/src/infra/repositories/InMemoryRefreshTokenRepository";
import { InMemoryUserRepository } from "@/src/infra/repositories/InMemoryUserRepository";
import { JsonWebTokenService } from "@/src/infra/services/JsonWebTokenService";
import { UuidService } from "@/src/infra/services/UuidService";
import { test, expect } from "vitest";

test("Should create new access token", async () => {
    const refreshTokenRepository: RefreshTokenRepository =
        new InMemoryRefreshTokenRepository();
    const userRepository: UserRepository = new InMemoryUserRepository();
    const idService: IdService = new UuidService();
    const jwtService: JwtService = new JsonWebTokenService();
    const refreshAccessTokenUseCase: RefreshAccessTokenUseCase =
        new RefreshAccessTokenUseCase({
            refreshTokenRepository,
            userRepository,
            jwtService,
        });

    const user = new User({
        id: idService.getUuid(),
        email: "johndoe@email.com",
    });
    await userRepository.createUser(user);
    const expiresIn = new Date(new Date().setHours(new Date().getHours() + 2));
    const refreshTokenId = idService.getUuid();

    await refreshTokenRepository.createRefreshToken({
        id: refreshTokenId,
        expiresIn,
        userId: user.id,
    });
    const result = await refreshAccessTokenUseCase.execute({ refreshTokenId });
    expect(result.access_token).not.toBe("");
});
