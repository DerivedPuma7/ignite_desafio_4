import { stat } from "fs";
import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { Statement } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let statementRepositoryInMemory: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let getStatementUseCase: GetStatementOperationUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Get Statement Operation", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementRepositoryInMemory = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    getStatementUseCase = new GetStatementOperationUseCase(
      usersRepositoryInMemory,
      statementRepositoryInMemory
    );
  });

  it("should be able to get a DEPOSIT statement operation", async() => {
    const user =  await createUserUseCase.execute({
      email: "user@finapp.com",
      password: "1234",
      name: "User Test",
    });

    const deposit: Statement = await statementRepositoryInMemory.create({
      user_id:  user.id as string,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "piNx"
    });

    const depositOperation = await getStatementUseCase.execute({
      user_id: user.id as string,
      statement_id: deposit.id as string,
    });

    expect(depositOperation).toBe(deposit);
  });

  it("should be able to get a WITHDRAW statement operation", async() => {
    const user =  await createUserUseCase.execute({
      email: "user@finapp.com",
      password: "1234",
      name: "User Test",
    });

    const deposit: Statement = await statementRepositoryInMemory.create({
      user_id:  user.id as string,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "piNx"
    });

    const withdraw: Statement = await statementRepositoryInMemory.create({
      user_id:  user.id as string,
      type: OperationType.WITHDRAW,
      amount: 90,
      description: "despesas"
    });

    const withdrawOperation = await getStatementUseCase.execute({
      user_id: user.id as string,
      statement_id: withdraw.id as string,
    });

    expect(withdrawOperation).toBe(withdraw);
  });

  it("should be able to get a WITHDRAW statement operation", () => {
    expect(async() => {
      const user =  await createUserUseCase.execute({
        email: "user@finapp.com",
        password: "1234",
        name: "User Test",
      });

      const deposit: Statement = await statementRepositoryInMemory.create({
        user_id:  user.id as string,
        type: OperationType.DEPOSIT,
        amount: 100,
        description: "piNx"
      });

      const depositOperation = await getStatementUseCase.execute({
        user_id: user.id as string,
        statement_id: "1",
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to get a statement operation for an invalid user", () => {
    expect(async () => {
      const statementOperation = await getStatementUseCase.execute({
        user_id: "invalid",
        statement_id: "1",
      });
    }).rejects.toBeInstanceOf(AppError);
  });

})
