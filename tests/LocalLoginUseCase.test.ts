import CryptService from "@/src/application/services/CryptService";
import JwtService from "@/src/application/services/JwtService";
import CreateUserUseCase from "@/src/application/usecases/CreateUserUseCase";
import LocalLoginUseCase from "@/src/application/usecases/LocalLoginUseCase";
import LocalSignUpUseCase from "@/src/application/usecases/LocalSignupUseCase";
import LoginRepository from "@/src/domain/repositories/LoginRepository";
import UserRepository from "@/src/domain/repositories/UserRepository";
import InMemoryLoginRepository from "@/src/infra/repositories/InMemoryLoginRepository";
import InMemoryUserRepository from "@/src/infra/repositories/InMemoryUserRepository";
import BcryptService from "@/src/infra/services/BcryptService";
import JsonWebTokenService from "@/src/infra/services/JsonWebTokenService";
import { expect, test } from "vitest";

test("Should login an user", async () => {
    const userRepository: UserRepository = new InMemoryUserRepository();
    const loginRepository: LoginRepository = new InMemoryLoginRepository();
    const cryptService: CryptService = new BcryptService();
    const jwtService: JwtService = new JsonWebTokenService();
    const localLoginUseCase: LocalLoginUseCase = new LocalLoginUseCase(
        loginRepository,
        cryptService,
        jwtService,
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
    const login = await localLoginUseCase.execute(email, password);
    expect(login).toBeTypeOf("string");
});
