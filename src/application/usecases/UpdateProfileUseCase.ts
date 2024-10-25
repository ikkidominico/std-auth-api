import { ProfileRepository } from "@/src/domain/repositories/ProfileRepository";

export class UpdateProfileUseCase {
    profileRepository: ProfileRepository;

    constructor(profileRepository: ProfileRepository) {
        this.profileRepository = profileRepository;
    }

    async execute(userId: string, name?: string, birth?: Date) {
        const profile = await this.profileRepository.updateProfileByUserId(
            userId,
            { name, birth },
        );
        if (!profile) throw new Error("Profile not updated.");
        return profile;
    }
}
