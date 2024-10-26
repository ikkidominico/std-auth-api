import { ProfileRepository } from "@/src/domain/repositories/ProfileRepository";

export class UpdateProfileUseCase {
    private readonly profileRepository: ProfileRepository;

    constructor({
        profileRepository,
    }: {
        profileRepository: ProfileRepository;
    }) {
        this.profileRepository = profileRepository;
    }

    async execute({
        name,
        birth,
        userId,
    }: {
        name?: string;
        birth?: Date;
        userId: string;
    }) {
        const profile = await this.profileRepository.updateProfileByUserId({
            name,
            birth,
            userId,
        });
        if (!profile) throw new Error("Profile not updated.");
        return profile;
    }
}
