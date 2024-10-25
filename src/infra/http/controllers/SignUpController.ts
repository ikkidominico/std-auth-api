import { LoginRepository } from "@/src/domain/repositories/LoginRepository";
import { CryptService } from "@/src/application/services/CryptService";
import { BcryptService } from "../../services/BcryptService";
import { LocalSignUpUseCase } from "@/src/application/usecases/LocalSignUpUseCase";
import { UserRepository } from "@/src/domain/repositories/UserRepository";
import { PrismaUserRepository } from "../../repositories/PrismaUserRepository";
import { PrismaLoginRepository } from "../../repositories/PrismaLoginRepository";
import { IdService } from "@/src/application/services/IdService";
import { UuidService } from "../../services/UuidService";
import { ProfileRepository } from "@/src/domain/repositories/ProfileRepository";
import { PrismaProfileRepository } from "../../repositories/PrismaProfileRepository";

export class SignUpController {
    userRepository: UserRepository = new PrismaUserRepository();
    profileRepository: ProfileRepository = new PrismaProfileRepository();
    loginRepository: LoginRepository = new PrismaLoginRepository();
    idService: IdService = new UuidService();
    cryptService: CryptService = new BcryptService();

    localSignUpUseCase: LocalSignUpUseCase = new LocalSignUpUseCase(
        this.userRepository,
        this.profileRepository,
        this.loginRepository,
        this.idService,
        this.cryptService,
    );

    async handle(email: string, password: string) {
        return this.localSignUpUseCase.execute(email, password);
    }
}
