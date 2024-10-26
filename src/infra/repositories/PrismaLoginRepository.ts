import { LoginMethods } from "@/src/application/enums/LoginMethods";
import { Login } from "@/src/domain/entities/Login";
import { LoginRepository } from "@/src/domain/repositories/LoginRepository";
import { prisma } from "../database/prisma/prisma";
import { User } from "@/src/domain/entities/User";

export class PrismaLoginRepository implements LoginRepository {
    async createLogin({
        id,
        method,
        password,
        userId,
    }: {
        id: string;
        method: string;
        password?: string;
        userId: string;
    }): Promise<void> {
        await prisma.login.create({
            data: {
                id,
                method,
                password,
                userId,
            },
        });
    }

    async getLoginsByUserId({ userId }: { userId: string }): Promise<Login[]> {
        const result = await prisma.login.findMany({
            where: {
                userId,
            },
            include: {
                user: true,
            },
        });

        return result.map((item) => {
            const login = new Login({
                id: item.id,
                method: item.method,
                user: new User({
                    id: item.user.id,
                    email: item.user.email,
                }),
            });
            if (item.password) login.password = item.password;
            if (item.recoveryToken) login.recoveryToken = item.recoveryToken;
            return login;
        });
    }

    async getLocalLoginByEmail({
        email,
    }: {
        email: string;
    }): Promise<Login | undefined> {
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

        if (!result) return undefined;

        const user = new User({
            id: result.user.id,
            email: result.user.email,
        });

        const login = new Login({
            id: result.id,
            method: result.method,
            user,
        });

        if (result.password) login.password = result.password;

        if (result.recoveryToken) login.recoveryToken = result.recoveryToken;

        return login;
    }

    async getGoogleLoginByEmail({
        email,
    }: {
        email: string;
    }): Promise<Login | undefined> {
        const result = await prisma.login.findFirst({
            where: {
                user: {
                    email,
                },
                method: LoginMethods.GOOGLE,
            },
            include: {
                user: true,
            },
        });

        if (!result) return undefined;

        const user = new User({
            id: result.user.id,
            email: result.user.email,
        });

        return new Login({
            id: result.id,
            method: result.method,
            user,
        });
    }

    async getLocalLoginByRecoveryToken({
        recoveryToken,
    }: {
        recoveryToken: string;
    }): Promise<Login | undefined> {
        const result = await prisma.login.findFirst({
            where: {
                recoveryToken,
                method: LoginMethods.LOCAL,
            },
            include: {
                user: true,
            },
        });

        if (!result) return undefined;

        const user: User = new User({
            id: result.user.id,
            email: result.user.email,
        });

        const login = new Login({
            id: result.id,
            method: result.method,
            user,
        });

        if (result.password) login.password = result.password;

        if (result.recoveryToken) login.recoveryToken = result.recoveryToken;

        return login;
    }

    async updateLoginByUserId({
        password,
        recoveryToken,
        userId,
    }: {
        password?: string;
        recoveryToken?: string;
        userId: string;
    }): Promise<Login | undefined> {
        const result = await prisma.login.update({
            data: {
                password,
                recoveryToken,
            },
            where: {
                userId_method: { userId, method: LoginMethods.LOCAL },
            },
            include: {
                user: true,
            },
        });

        const user: User = new User({
            id: result.user.id,
            email: result.user.email,
        });

        const login = new Login({
            id: result.id,
            method: result.method,
            user,
        });

        if (result.password) login.password = result.password;

        if (result.recoveryToken) login.recoveryToken = result.recoveryToken;

        return login;
    }
}
