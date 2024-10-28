import { Login } from "../entities/Login";

export interface LoginRepository {
    createLogin({
        id,
        method,
        password,
        userId,
    }: {
        id: string;
        method: string;
        password?: string;
        userId: string;
    }): Promise<void>;

    getLoginsByUserId({ userId }: { userId: string }): Promise<Login[]>;

    getLocalLoginByEmail({
        email,
    }: {
        email: string;
    }): Promise<Login | undefined>;

    getGoogleLoginByEmail({
        email,
    }: {
        email: string;
    }): Promise<Login | undefined>;

    getLocalLoginByRecoveryToken({
        recoveryToken,
    }: {
        recoveryToken: string;
    }): Promise<Login | undefined>;

    updateLoginByUserId({
        password,
        recoveryToken,
        userId,
    }: {
        password?: string;
        recoveryToken?: string;
        userId: string;
    }): Promise<Login | undefined>;

    deleteLoginById({ id }: { id: string }): Promise<void>;
}
