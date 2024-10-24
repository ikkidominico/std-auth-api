import { LoginMethods } from "@/src/application/enums/LoginMethods";
import { CryptService } from "@/src/application/services/CryptService";
import { IdService } from "@/src/application/services/IdService";
import { JwtService } from "@/src/application/services/JwtService";
import { LocalLoginUseCase } from "@/src/application/usecases/LocalLoginUseCase";
import { Login } from "@/src/domain/entities/Login";
import { User } from "@/src/domain/entities/User";
import { LoginRepository } from "@/src/domain/repositories/LoginRepository";
import { RefreshTokenRepository } from "@/src/domain/repositories/RefreshTokenRepository";
import { InMemoryLoginRepository } from "@/src/infra/repositories/InMemoryLoginRepository";
import { InMemoryRefreshTokenRepository } from "@/src/infra/repositories/InMemoryRefreshTokenRepository";
import { BcryptService } from "@/src/infra/services/BcryptService";
import { JsonWebTokenService } from "@/src/infra/services/JsonWebTokenService";
import { UuidService } from "@/src/infra/services/UuidService";
import { expect, test } from "vitest";

test("Should login an user", async () => {
    const loginRepository: LoginRepository = new InMemoryLoginRepository();
    const refreshTokenRepository: RefreshTokenRepository =
        new InMemoryRefreshTokenRepository();
    const idService: IdService = new UuidService();
    const cryptService: CryptService = new BcryptService();
    const jwtService: JwtService = new JsonWebTokenService();
    const localLoginUseCase: LocalLoginUseCase = new LocalLoginUseCase(
        loginRepository,
        refreshTokenRepository,
        idService,
        cryptService,
        jwtService,
    );
    const email = "johndoe@email.com";
    const password = "password";
    const user = new User(idService.getUuid(), email);
    const login = new Login(
        LoginMethods.LOCAL,
        user,
        await cryptService.hash(password),
    );
    await loginRepository.createLogin(login);
    const result = await localLoginUseCase.execute({ email, password });
    expect(result).toBeTypeOf("object");
    expect(result.access_token).not.toBe(null);
    expect(result.refresh_token).not.toBe(null);
});
