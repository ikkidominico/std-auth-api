import { Profile } from "../entities/Profile";

export interface ProfileRepository {
    createProfile(profile: Profile): Promise<void>;

    getProfileByUserId(userId: string): Promise<Profile | null>;

    updateProfileByUserId(
        userId: string,
        data: { name?: string; birth?: Date },
    ): Promise<Profile | null>;

    deleteProfileByUserId(userId: string): Promise<void>;
}
