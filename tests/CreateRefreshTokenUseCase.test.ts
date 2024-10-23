import CreateRefreshTokenUseCase from "@/src/application/usecases/CreateRefreshTokenUseCase";
import RefreshTokenRepository from "@/src/domain/repositories/RefreshTokenRepository";
import InMemoryRefreshTokenRepository from "@/src/infra/repositories/InMemoryRefreshTokenRepository";
import { test, expect } from "vitest";

test("Should create a refresh token", async () => {
    const refreshTokenRepository: RefreshTokenRepository =
        new InMemoryRefreshTokenRepository();
    const createRefreshTokenUseCase: CreateRefreshTokenUseCase =
        new CreateRefreshTokenUseCase(refreshTokenRepository);
    const id = Math.floor(Math.random() * 100000).toString();
    const expiresIn = new Date(new Date().setHours(new Date().getHours() + 2));
    await createRefreshTokenUseCase.execute(id, expiresIn);
    const result = await refreshTokenRepository.getRefreshTokenByUserId(id);
    expect(result?.user.id).toBe(id);
});
