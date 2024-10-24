import { User } from "@/src/domain/entities/User";
import { UserRepository } from "@/src/domain/repositories/UserRepository";
import { prisma } from "../database/prisma/prisma";

export class PrismaUserRepository implements UserRepository {
    async createUser(user: User): Promise<void> {
        await prisma.user.create({
            data: {
                id: user.id,
                email: user.email,
            },
        });
    }

    async getUserById(id: string): Promise<User | null> {
        const result = await prisma.user.findUnique({
            where: {
                id: id,
            },
        });
        if (!result) return null;
        const user: User = new User(result.id, result.email);
        return user;
    }

    async getUserByEmail(email: string): Promise<User | null> {
        const result = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        if (!result) return null;
        const user: User = new User(result.id, result.email);
        return user;
    }

    async getUsers(): Promise<User[]> {
        const result = await prisma.user.findMany();
        const users = result.map((user) => new User(user.id, user.email));
        return users;
    }
}
