import { AppError } from "../../../../shared/errors/AppError";
import { User } from "../../entities/User";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Show User Profile", () => {

  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepositoryInMemory);
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("should not be able to shows a profile from an invalid user", () => {
    expect(async () => {
      await showUserProfileUseCase.execute(
        "invalid",
      )
      }).rejects.toBeInstanceOf(AppError);
  });

  it("should be able to shows a profile from a valid user", async () => {
    const user = await createUserUseCase.execute({
      name: "User Name",
      email: "user@email.com",
      password: "1234"
    });

    const result = await showUserProfileUseCase.execute(
      user.id as string
    )

    expect(result).toEqual(user);
  })

})
