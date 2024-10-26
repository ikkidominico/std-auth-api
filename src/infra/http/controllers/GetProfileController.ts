import { GetProfileUseCase } from "@/src/application/usecases/GetProfileUseCase";
import { ProfileRepository } from "@/src/domain/repositories/ProfileRepository";
import { PrismaProfileRepository } from "../../repositories/PrismaProfileRepository";

export class GetProfileController {
    profileRepository: ProfileRepository = new PrismaProfileRepository();
    getProfileUseCase: GetProfileUseCase = new GetProfileUseCase({
        profileRepository: this.profileRepository,
    });

    async handle({ userId }: { userId: string }) {
        return this.getProfileUseCase.execute({ userId });
    }
}
