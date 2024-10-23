import CreateUserUseCase from "@/src/application/usecases/CreateUserUseCase";
import GetUserUseCase from "@/src/application/usecases/GetUserUseCase";
import User from "@/src/domain/entities/User";
import UserRepository from "@/src/domain/repositories/UserRepository";
import InMemoryUserRepository from "@/src/infra/repositories/InMemoryUserRepository";
import { test, expect } from "vitest";

test("Should create an user", async () => {
    const userRepository: UserRepository = new InMemoryUserRepository();
    const createUserUseCase: CreateUserUseCase = new CreateUserUseCase(
        userRepository,
    );
    const id = Math.floor(Math.random() * 100000).toString();
    const user: User = new User("johndoe@email.com", id);
    await createUserUseCase.execute(user);
    const getUserUseCase: GetUserUseCase = new GetUserUseCase(userRepository);
    const result: User | null = await getUserUseCase.execute(id);
    expect(result?.id).toBe(id);
});
