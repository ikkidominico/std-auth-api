export default interface CryptService {
    hash(text: string): Promise<string>;
    verify(text: string, hash: string): Promise<boolean>;
}
