import CryptService from "@/src/application/services/CryptService";
import CreateUserUseCase from "@/src/application/usecases/CreateUserUseCase";
import LocalSignUpUseCase from "@/src/application/usecases/LocalSignupUseCase";
import LoginRepository from "@/src/domain/repositories/LoginRepository";
import UserRepository from "@/src/domain/repositories/UserRepository";
import InMemoryLoginRepository from "@/src/infra/repositories/InMemoryLoginRepository";
import InMemoryUserRepository from "@/src/infra/repositories/InMemoryUserRepository";
import BcryptService from "@/src/infra/services/BcryptService";
import { describe } from "node:test";
import { test, expect } from "vitest";

describe("User Signup", () => {
    test("Should signup an user", async () => {
        const userRepository: UserRepository = new InMemoryUserRepository();
        const loginRepository: LoginRepository = new InMemoryLoginRepository();
        const createUserUseCase: CreateUserUseCase = new CreateUserUseCase(
            userRepository,
        );
        const cryptService: CryptService = new BcryptService();
        const localSignUpUseCase: LocalSignUpUseCase = new LocalSignUpUseCase(
            userRepository,
            loginRepository,
            createUserUseCase,
            cryptService,
        );
        const email = "johndoe@email.com";
        const password = "password";
        await localSignUpUseCase.execute(email, password);
        const result = await loginRepository.getLocalLoginByEmail(email);
        expect(result?.user.email).toBe(email);
    });
    test("Should throw an error when user email already exists", async () => {
        const userRepository: UserRepository = new InMemoryUserRepository();
        const loginRepository: LoginRepository = new InMemoryLoginRepository();
        const createUserUseCase: CreateUserUseCase = new CreateUserUseCase(
            userRepository,
        );
        const cryptService: CryptService = new BcryptService();
        const localSignUpUseCase: LocalSignUpUseCase = new LocalSignUpUseCase(
            userRepository,
            loginRepository,
            createUserUseCase,
            cryptService,
        );
        const email = "johndoe@email.com";
        const password = "password";
        await localSignUpUseCase.execute(email, password);
        expect(localSignUpUseCase.execute(email, password)).rejects.toThrow();
    });
});
