import { Profile } from "@/src/domain/entities/Profile";
import { User } from "@/src/domain/entities/User";
import { ProfileRepository } from "@/src/domain/repositories/ProfileRepository";

export class InMemoryProfileRepository implements ProfileRepository {
    profiles: Profile[];

    constructor() {
        this.profiles = [];
    }

    async createProfile({
        name,
        birth,
        userId,
    }: {
        name?: string;
        birth?: Date;
        userId: string;
    }): Promise<void> {
        const user = new User({ id: userId, email: "johndoe@email.com" });
        const profile = new Profile({ user: user });
        if (name) profile.name = name;
        if (birth) profile.birth = birth;
        this.profiles.push(profile);
    }

    async getProfileByUserId({
        userId,
    }: {
        userId: string;
    }): Promise<Profile | undefined> {
        const profile = this.profiles.find(
            (profile) => profile.user.id === userId,
        );
        if (!profile) throw new Error("Profile not found.");
        return profile;
    }

    async updateProfileByUserId({
        name,
        birth,
        userId,
    }: {
        name?: string;
        birth?: Date;
        userId: string;
    }): Promise<Profile | undefined> {
        const index = this.profiles.findIndex(
            (profile) => profile.user.id === userId,
        );
        if (name) this.profiles[index].name = name;
        if (birth) this.profiles[index].birth = birth;
        return this.profiles[index];
    }

    async deleteProfileByUserId({ userId }: { userId: string }): Promise<void> {
        const profiles = this.profiles.filter(
            (profile) => profile.user.id !== userId,
        );
        this.profiles = profiles;
    }
}
