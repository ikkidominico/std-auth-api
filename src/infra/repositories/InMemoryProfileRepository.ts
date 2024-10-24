import { Profile } from "@/src/domain/entities/Profile";
import { ProfileRepository } from "@/src/domain/repositories/ProfileRepository";

export class InMemoryProfileRepository implements ProfileRepository {
    profiles: Profile[];

    constructor() {
        this.profiles = [];
    }

    async createProfile(profile: Profile): Promise<void> {
        this.profiles.push(profile);
    }

    async getProfileByUserId(userId: string): Promise<Profile | null> {
        const profile = this.profiles.find(
            (profile) => profile.user.id === userId,
        );
        if (!profile) throw new Error("Profile not found.");
        return profile;
    }

    async updateProfileByUserId(
        userId: string,
        data: { name?: string; birth?: Date },
    ): Promise<Profile | null> {
        const index = this.profiles.findIndex(
            (profile) => profile.user.id === userId,
        );
        if (data.name) this.profiles[index].name = data.name;
        if (data.birth) this.profiles[index].birth = data.birth;
        return this.profiles[index];
    }

    async deleteProfileByUserId(userId: string): Promise<void> {
        const profiles = this.profiles.filter(
            (profile) => profile.user.id !== userId,
        );
        this.profiles = profiles;
    }
}
