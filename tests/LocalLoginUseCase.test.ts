import { LoginMethods } from "@/src/application/enums/LoginMethods";
import { CryptService } from "@/src/application/services/CryptService";
import { IdService } from "@/src/application/services/IdService";
import { JwtService } from "@/src/application/services/JwtService";
import { CreateRefreshTokenUseCase } from "@/src/application/usecases/CreateRefreshTokenUseCase";
import { CreateTokensUseCase } from "@/src/application/usecases/CreateTokensUseCase";
import { LocalLoginUseCase } from "@/src/application/usecases/LocalLoginUseCase";
import { User } from "@/src/domain/entities/User";
import { LoginRepository } from "@/src/domain/repositories/LoginRepository";
import { RefreshTokenRepository } from "@/src/domain/repositories/RefreshTokenRepository";
import { InMemoryLoginRepository } from "@/src/infra/repositories/InMemoryLoginRepository";
import { InMemoryRefreshTokenRepository } from "@/src/infra/repositories/InMemoryRefreshTokenRepository";
import { BcryptService } from "@/src/infra/services/BcryptService";
import { JsonWebTokenService } from "@/src/infra/services/JsonWebTokenService";
import { UuidService } from "@/src/infra/services/UuidService";
import { expect, it } from "vitest";

it("Should login an user", async () => {
    const loginRepository: LoginRepository = new InMemoryLoginRepository();
    const refreshTokenRepository: RefreshTokenRepository =
        new InMemoryRefreshTokenRepository();
    const idService: IdService = new UuidService();
    const cryptService: CryptService = new BcryptService();
    const jwtService: JwtService = new JsonWebTokenService();
    const createRefreshTokenUseCase: CreateRefreshTokenUseCase =
        new CreateRefreshTokenUseCase({
            refreshTokenRepository,
            idService,
        });
    const createTokensUseCase: CreateTokensUseCase = new CreateTokensUseCase({
        jwtService,
        createRefreshTokenUseCase,
    });
    const localLoginUseCase: LocalLoginUseCase = new LocalLoginUseCase({
        loginRepository,
        cryptService,
        createTokensUseCase,
    });

    const user = new User({
        id: idService.getUuid(),
        email: "johndoe@email.com",
    });

    await loginRepository.createLogin({
        id: idService.getUuid(),
        method: LoginMethods.LOCAL,
        userId: user.id,
        password: await cryptService.hash({ text: "password" }),
    });

    const result = await localLoginUseCase.execute({
        email: "johndoe@email.com",
        password: "password",
    });

    expect(result).toBeTypeOf("object");
    expect(result.access_token).not.toBe(null);
    expect(result.refresh_token).not.toBe(null);
});
