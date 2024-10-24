import { Profile } from "@/src/domain/entities/Profile";
import { ProfileRepository } from "@/src/domain/repositories/ProfileRepository";
import { UserRepository } from "@/src/domain/repositories/UserRepository";

export class CreateProfileUseCase {
    userRepository: UserRepository;
    profileRepository: ProfileRepository;

    constructor(
        userRepository: UserRepository,
        profileRepository: ProfileRepository,
    ) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
    }

    async execute(userId: string, name: string, birth: Date) {
        const user = await this.userRepository.getUserById(userId);
        if (!user) throw new Error("User not found.");
        const profileAlreadyExists =
            await this.profileRepository.getProfileByUserId(userId);
        if (profileAlreadyExists) throw new Error("Profile already exists.");
        const profile = new Profile(name, birth, user);
        await this.profileRepository.createProfile(profile);
    }
}
