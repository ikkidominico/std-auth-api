export type JwtPayload = {
    sub: string;
    email?: string;
};

export type JwtOptions = {
    expiresIn: number | string;
};

export interface JwtService {
    sign(
        payload: JwtPayload,
        key: string,
        options: JwtOptions,
    ): Promise<string>;

    verify(token: string, key: string): Promise<object>;
}
