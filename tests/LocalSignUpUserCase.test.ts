import { CryptService } from "@/src/application/services/CryptService";
import { IdService } from "@/src/application/services/IdService";
import { LocalSignUpUseCase } from "@/src/application/usecases/LocalSignUpUseCase";
import { LoginRepository } from "@/src/domain/repositories/LoginRepository";
import { ProfileRepository } from "@/src/domain/repositories/ProfileRepository";
import { UserRepository } from "@/src/domain/repositories/UserRepository";
import { InMemoryLoginRepository } from "@/src/infra/repositories/InMemoryLoginRepository";
import { InMemoryProfileRepository } from "@/src/infra/repositories/InMemoryProfileRepository";
import { InMemoryUserRepository } from "@/src/infra/repositories/InMemoryUserRepository";
import { BcryptService } from "@/src/infra/services/BcryptService";
import { UuidService } from "@/src/infra/services/UuidService";
import { describe } from "node:test";
import { test, expect } from "vitest";

describe("User Signup", () => {
    test("Should signup an user", async () => {
        const userRepository: UserRepository = new InMemoryUserRepository();
        const profileRepository: ProfileRepository =
            new InMemoryProfileRepository();
        const loginRepository: LoginRepository = new InMemoryLoginRepository();
        const idService: IdService = new UuidService();
        const cryptService: CryptService = new BcryptService();
        const localSignUpUseCase: LocalSignUpUseCase = new LocalSignUpUseCase(
            userRepository,
            profileRepository,
            loginRepository,
            idService,
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
        const profileRepository: ProfileRepository =
            new InMemoryProfileRepository();
        const loginRepository: LoginRepository = new InMemoryLoginRepository();
        const idService: IdService = new UuidService();
        const cryptService: CryptService = new BcryptService();
        const localSignUpUseCase: LocalSignUpUseCase = new LocalSignUpUseCase(
            userRepository,
            profileRepository,
            loginRepository,
            idService,
            cryptService,
        );
        const email = "johndoe@email.com";
        const password = "password";
        await localSignUpUseCase.execute(email, password);
        expect(localSignUpUseCase.execute(email, password)).rejects.toThrow();
    });
});
