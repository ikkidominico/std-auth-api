export interface CryptService {
    hash({ text }: { text: string }): Promise<string>;

    verify({ text, hash }: { text: string; hash: string }): Promise<boolean>;

    randomToken(): Promise<string>;
}
