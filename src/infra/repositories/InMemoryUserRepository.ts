import User from "@/src/domain/entities/User";
import UserRepository from "@/src/domain/repositories/UserRepository";

export default class InMemoryUserRepository implements UserRepository {
    users: User[];

    constructor() {
        this.users = [];
    }

    async createUser(user: User): Promise<void> {
        this.users.push(user);
    }

    async getUserById(id: string): Promise<User | null> {
        const user = this.users.find((user) => user.id === id);
        if (!user) return null;
        return user;
    }

    async getUserByEmail(email: string): Promise<User | null> {
        const user = this.users.find((user) => user.email === email);
        if (!user) return null;
        return user;
    }

    async getUsers(): Promise<User[]> {
        return this.users;
    }
}
