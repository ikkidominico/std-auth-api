import { Profile } from "../entities/Profile";

export interface ProfileRepository {
    createProfile({
        name,
        birth,
        userId,
    }: {
        name?: string;
        birth?: Date;
        userId: string;
    }): Promise<void>;

    getProfileByUserId({
        userId,
    }: {
        userId: string;
    }): Promise<Profile | undefined>;

    updateProfileByUserId({
        name,
        birth,
        userId,
    }: {
        name?: string;
        birth?: Date;
        userId: string;
    }): Promise<Profile | undefined>;

    deleteProfileByUserId({ userId }: { userId: string }): Promise<void>;
}
