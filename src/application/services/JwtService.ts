export default interface JwtService {
    sign(payload: object, key: string): Promise<string>;
    verify(token: string, key: string): Promise<object>;
}
