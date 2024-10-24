import { User } from "../entities/User";

export interface UserRepository {
    createUser(user: User): Promise<void>;

    getUsers(): Promise<User[]>;

    getUserById(id: string): Promise<User | null>;

    getUserByEmail(email: string): Promise<User | null>;
}
