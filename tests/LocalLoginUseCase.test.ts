import CryptService from "@/src/application/services/CryptService";
import { JwtService } from "@/src/application/services/JwtService";
import CreateRefreshTokenUseCase from "@/src/application/usecases/CreateRefreshTokenUseCase";
import CreateUserUseCase from "@/src/application/usecases/CreateUserUseCase";
import LocalLoginUseCase from "@/src/application/usecases/LocalLoginUseCase";
import LocalSignUpUseCase from "@/src/application/usecases/LocalSignupUseCase";
import LoginRepository from "@/src/domain/repositories/LoginRepository";
import RefreshTokenRepository from "@/src/domain/repositories/RefreshTokenRepository";
import UserRepository from "@/src/domain/repositories/UserRepository";
import InMemoryLoginRepository from "@/src/infra/repositories/InMemoryLoginRepository";
import InMemoryRefreshTokenRepository from "@/src/infra/repositories/InMemoryRefreshTokenRepository";
import InMemoryUserRepository from "@/src/infra/repositories/InMemoryUserRepository";
import BcryptService from "@/src/infra/services/BcryptService";
import JsonWebTokenService from "@/src/infra/services/JsonWebTokenService";
import { expect, test } from "vitest";

test("Should login an user", async () => {
    const userRepository: UserRepository = new InMemoryUserRepository();
    const loginRepository: LoginRepository = new InMemoryLoginRepository();
    const refreshTokenRepository: RefreshTokenRepository =
        new InMemoryRefreshTokenRepository();
    const cryptService: CryptService = new BcryptService();
    const jwtService: JwtService = new JsonWebTokenService();
    const createRefreshTokenUseCase: CreateRefreshTokenUseCase =
        new CreateRefreshTokenUseCase(refreshTokenRepository);
    const localLoginUseCase: LocalLoginUseCase = new LocalLoginUseCase(
        loginRepository,
        cryptService,
        jwtService,
        createRefreshTokenUseCase,
    );
    const createUserUseCase: CreateUserUseCase = new CreateUserUseCase(
        userRepository,
    );
    const localSignUpUseCase: LocalSignUpUseCase = new LocalSignUpUseCase(
        userRepository,
        loginRepository,
        createUserUseCase,
        cryptService,
    );
    const email = "johndoe@email.com";
    const password = "password";
    await localSignUpUseCase.execute(email, password);
    const login = await localLoginUseCase.execute({ email, password });
    expect(login).toBeTypeOf("object");
    expect(login.access_token).not.toBe(null);
    expect(login.refresh_token).not.toBe(null);
});
