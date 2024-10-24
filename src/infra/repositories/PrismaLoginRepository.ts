import { LoginMethods } from "@/src/application/enums/LoginMethods";
import { Login } from "@/src/domain/entities/Login";
import { LoginRepository } from "@/src/domain/repositories/LoginRepository";
import { prisma } from "../database/prisma/prisma";
import { User } from "@/src/domain/entities/User";

export class PrismaLoginRepository implements LoginRepository {
    async createLogin(login: Login): Promise<void> {
        await prisma.login.create({
            data: {
                method: login.method,
                password: login.password,
                userId: login.user.id,
            },
        });
    }

    async getLocalLoginByEmail(email: string): Promise<Login | null> {
        const result = await prisma.user.findUnique({
            select: {
                id: true,
                email: true,
                login: {
                    select: {
                        password: true,
                        method: true,
                    },
                    where: {
                        method: LoginMethods.LOCAL,
                    },
                },
            },
            where: {
                email: email,
            },
        });
        if (!result) return null;
        const user: User = new User(result.id, result.email);
        const first = result.login[0];
        const login: Login = new Login(
            first.method,
            user,
            first.password as string | undefined,
        );
        return login;
    }
}
