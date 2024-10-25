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
        const result = await prisma.login.findFirst({
            where: {
                user: {
                    email,
                },
                method: LoginMethods.LOCAL,
            },
            include: {
                user: true,
            },
        });

        if (!result) return null;

        const user: User = new User(result.user.id, result.user.email);

        const login: Login = new Login(
            result.method,
            user,
            result.password as string | undefined,
        );
        return login;
    }

    async getLocalLoginByRecoveryToken(
        recoveryToken: string,
    ): Promise<Login | null> {
        const result = await prisma.login.findFirst({
            where: {
                recoveryToken,
                method: LoginMethods.LOCAL,
            },
            include: {
                user: true,
            },
        });

        if (!result) return null;

        const user: User = new User(result.user.id, result.user.email);

        const login: Login = new Login(
            result.method,
            user,
            result.password as string | undefined,
        );
        return login;
    }

    async getLoginsByUserId(userId: string): Promise<Login[]> {
        const result = await prisma.login.findMany({
            where: {
                userId,
            },
            include: {
                user: true,
            },
        });

        const logins = result.map(
            (login) =>
                new Login(
                    login.method,
                    login.user,
                    login.password as string | undefined,
                ),
        );

        return logins;
    }

    async updateRecoveryTokenByUserId(
        userId: string,
        recoveryToken: string,
    ): Promise<Login | null> {
        const result = await prisma.login.update({
            data: {
                recoveryToken,
            },
            where: {
                userId,
            },
            include: {
                user: true,
            },
        });
        return new Login(
            result.method,
            result.user,
            result.password as string | undefined,
            result.recoveryToken as string | undefined,
        );
    }

    async updatePasswordByUserId(
        userId: string,
        password: string,
    ): Promise<Login | null> {
        const result = await prisma.login.update({
            data: {
                password,
                recoveryToken: undefined,
            },
            where: {
                userId,
            },
            include: {
                user: true,
            },
        });
        return new Login(
            result.method,
            result.user,
            result.password as string | undefined,
            result.recoveryToken as string | undefined,
        );
    }
}
