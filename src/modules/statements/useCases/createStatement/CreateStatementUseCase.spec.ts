import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { ICreateStatementDTO } from "./ICreateStatementDTO";

let usersRepositoryInMemory: InMemoryUsersRepository;
let statementsRepositoryInMemory: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Create Statement", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory)
    createStatementUseCase = new CreateStatementUseCase(
      usersRepositoryInMemory,
      statementsRepositoryInMemory
    )
  });

  it("should be able to create a deposit for a valid user", async () => {
    const user  = await createUserUseCase.execute({
      email: "user@finapp.com",
      password: "1234",
      name: "User Test",
    });

    await createStatementUseCase.execute({
      user_id:  user.id as string,
      type: "deposit" as OperationType,
      amount: 100,
      description: "piNx"
    });

    expect(201);
  });

  it("should not be able to create a deposit for a invalid user", () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id:  "invalid",
        type: "deposit" as OperationType,
        amount: 100,
        description: "piNx"
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should be able to create a withdraw for a valid user", async () => {
    const user  = await createUserUseCase.execute({
      email: "user@finapp.com",
      password: "1234",
      name: "User Test",
    });

    await createStatementUseCase.execute({
      user_id:  user.id as string,
      type: "deposit" as OperationType,
      amount: 100,
      description: "piNx"
    });

    await createStatementUseCase.execute({
      user_id:  user.id as string,
      type: "withdraw" as OperationType,
      amount: 90,
      description: "cuidados com o macaquinho bariloche"
    });

    await createStatementUseCase.execute({
      user_id:  user.id as string,
      type: "withdraw" as OperationType,
      amount: 10,
      description: "uber"
    });

    expect(201);
  });

  it("should not be able to create a withdraw with no funds", () => {
    expect(async () => {
      const user  = await createUserUseCase.execute({
        email: "user@finapp.com",
        password: "1234",
        name: "User Test",
      });

      await createStatementUseCase.execute({
        user_id:  user.id as string,
        type: "withdraw" as OperationType,
        amount: 110,
        description: "cuidados com o macaquinho bariloche"
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to create a withdraw with no funds", () => {
    expect(async () => {
      const user  = await createUserUseCase.execute({
        email: "user@finapp.com",
        password: "1234",
        name: "User Test",
      });

      await createStatementUseCase.execute({
        user_id:  user.id as string,
        type: "deposit" as OperationType,
        amount: 100,
        description: "piNx"
      });

      await createStatementUseCase.execute({
        user_id:  user.id as string,
        type: "withdraw" as OperationType,
        amount: 110,
        description: "cuidados com o macaquinho bariloche"
      });
    }).rejects.toBeInstanceOf(AppError);
  });
})
