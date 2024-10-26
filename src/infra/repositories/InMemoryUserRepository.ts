import { User } from "@/src/domain/entities/User";
import { UserRepository } from "@/src/domain/repositories/UserRepository";

export class InMemoryUserRepository implements UserRepository {
    users: User[];

    constructor() {
        this.users = [];
    }

    async createUser(user: User): Promise<void> {
        this.users.push(user);
    }

    async getUsers(): Promise<User[]> {
        return this.users;
    }

    async getUserById({ id }: { id: string }): Promise<User | undefined> {
        const user = this.users.find((user) => user.id === id);
        return user;
    }

    async getUserByEmail({
        email,
    }: {
        email: string;
    }): Promise<User | undefined> {
        const user = this.users.find((user) => user.email === email);
        return user;
    }
}
