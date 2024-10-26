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

    async getUsers(): Promise<User[]> {
        const result = await prisma.user.findMany();
        const users = result.map(
            (user) => new User({ id: user.id, email: user.email }),
        );
        return users;
    }

    async getUserById({ id }: { id: string }): Promise<User | undefined> {
        const result = await prisma.user.findUnique({
            where: {
                id,
            },
        });
        if (!result) return undefined;
        return new User({ id: result.id, email: result.email });
    }

    async getUserByEmail({
        email,
    }: {
        email: string;
    }): Promise<User | undefined> {
        const result = await prisma.user.findUnique({
            where: {
                email,
            },
        });
        if (!result) return undefined;
        return new User({ id: result.id, email: result.email });
    }
}
