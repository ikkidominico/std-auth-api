import User from "../entities/User";

export default interface UserRepository {
    createUser(user: User): Promise<void>;
    getUserById(id: string): Promise<User | null>;
    getUserByEmail(email: string): Promise<User | null>;
    getUsers(): Promise<User[]>;
}
