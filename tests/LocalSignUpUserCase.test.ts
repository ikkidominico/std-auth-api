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
import { expect, it } from "vitest";

describe("User Signup", () => {
    const userRepository: UserRepository = new InMemoryUserRepository();
    const profileRepository: ProfileRepository =
        new InMemoryProfileRepository();
    const loginRepository: LoginRepository = new InMemoryLoginRepository();
    const idService: IdService = new UuidService();
    const cryptService: CryptService = new BcryptService();
    const localSignUpUseCase: LocalSignUpUseCase = new LocalSignUpUseCase({
        userRepository,
        profileRepository,
        loginRepository,
        idService,
        cryptService,
    });
    const email = "johndoe@email.com";
    const password = "password";
    it("Should signup an user", async () => {
        await localSignUpUseCase.execute({ email, password });
        const result = await loginRepository.getLocalLoginByEmail({ email });
        expect(result?.user.email).toBe(email);
    });
});
