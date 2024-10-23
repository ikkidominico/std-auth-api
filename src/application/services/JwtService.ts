import { JwtOptions } from "./JwtOptions";
import { JwtPayload } from "./JwtPayload";

export default interface JwtService {
    sign(
        payload: JwtPayload,
        key: string,
        options: JwtOptions,
    ): Promise<string>;
    verify(token: string, key: string): Promise<object>;
}
