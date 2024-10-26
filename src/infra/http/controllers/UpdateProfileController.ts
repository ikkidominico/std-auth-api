import { ProfileRepository } from "@/src/domain/repositories/ProfileRepository";
import { PrismaProfileRepository } from "../../repositories/PrismaProfileRepository";
import { UpdateProfileUseCase } from "@/src/application/usecases/UpdateProfileUseCase";

export class UpdateProfileController {
    profileRepository: ProfileRepository = new PrismaProfileRepository();
    updateProfileUseCase: UpdateProfileUseCase = new UpdateProfileUseCase({
        profileRepository: this.profileRepository,
    });

    async handle({
        name,
        birth,
        userId,
    }: {
        name?: string;
        birth?: Date;
        userId: string;
    }) {
        return this.updateProfileUseCase.execute({ name, birth, userId });
    }
}
