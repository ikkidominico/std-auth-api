import { ProfileRepository } from "@/src/domain/repositories/ProfileRepository";
import { PrismaProfileRepository } from "../../repositories/PrismaProfileRepository";
import { UpdateProfileUseCase } from "@/src/application/usecases/UpdateProfileUseCase";

export class UpdateProfileController {
    profileRepository: ProfileRepository = new PrismaProfileRepository();
    updateProfileUseCase: UpdateProfileUseCase = new UpdateProfileUseCase(
        this.profileRepository,
    );

    async handle(userId: string, name?: string, birth?: Date) {
        return this.updateProfileUseCase.execute(userId, name, birth);
    }
}
