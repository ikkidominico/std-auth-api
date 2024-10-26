import { User } from "../entities/User";

export interface UserRepository {
    createUser(user: User): Promise<void>;

    getUsers(): Promise<User[]>;

    getUserById({ id }: { id: string }): Promise<User | undefined>;

    getUserByEmail({ email }: { email: string }): Promise<User | undefined>;
}
