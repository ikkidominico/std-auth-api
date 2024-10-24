import { CreateProfileUseCase } from "@/src/application/usecases/profile/CreateProfileUseCase";
import { UserRepository } from "@/src/domain/repositories/UserRepository";
import { PrismaUserRepository } from "../../repositories/PrismaUserRepository";
import { PrismaProfileRepository } from "../../repositories/PrismaProfileRepository";
import { ProfileRepository } from "@/src/domain/repositories/ProfileRepository";

export class CreateProfileController {
    userRepository: UserRepository = new PrismaUserRepository();
    profileRepository: ProfileRepository = new PrismaProfileRepository();
    createProfileUseCase: CreateProfileUseCase = new CreateProfileUseCase(
        this.userRepository,
        this.profileRepository,
    );

    async handle(userId: string, name: string, birth: Date) {
        return this.createProfileUseCase.execute(userId, name, birth);
    }
}
