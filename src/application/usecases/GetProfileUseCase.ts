import { ProfileRepository } from "@/src/domain/repositories/ProfileRepository";

export class GetProfileUseCase {
    private readonly profileRepository: ProfileRepository;

    constructor({
        profileRepository,
    }: {
        profileRepository: ProfileRepository;
    }) {
        this.profileRepository = profileRepository;
    }

    public async execute({ userId }: { userId: string }) {
        const profile = await this.profileRepository.getProfileByUserId({
            userId,
        });
        if (!profile) throw new Error("Profile not found.");
        return profile;
    }
}
