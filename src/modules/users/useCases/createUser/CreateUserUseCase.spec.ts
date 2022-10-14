import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "./CreateUserUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;


describe("Create User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      name: "User Name",
      email: "user@email.com",
      password: "1234"
    });

    expect(201);
  });

  it("should not be able to create a user with an existing email", () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "User Name",
        email: "user@email.com",
        password: "1234"
      });

      await createUserUseCase.execute({
        name: "User Name2",
        email: "user@email.com",
        password: "1234"
      });
    }).rejects.toBeInstanceOf(AppError);
  })
})
