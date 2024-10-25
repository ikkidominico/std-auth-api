import { ProfileRepository } from "@/src/domain/repositories/ProfileRepository";

export class GetProfileUseCase {
    profileRepository: ProfileRepository;

    constructor(profileRepository: ProfileRepository) {
        this.profileRepository = profileRepository;
    }

    async execute(userId: string) {
        const profile = await this.profileRepository.getProfileByUserId(userId);
        if (!profile) throw new Error("Profile not found.");
        return profile;
    }
}
