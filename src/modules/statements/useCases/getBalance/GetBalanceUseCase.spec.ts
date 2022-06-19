import { verify } from "jsonwebtoken";

import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../../../users/useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceUseCase } from "./GetBalanceUseCase";
import authConfig from "../../../../config/auth";

let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let userRepositoryInMemory: InMemoryUsersRepository;
let statementsRepositoryInMemory: InMemoryStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase;

interface IPayload{
    sub: string;
}

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
}

describe("Create Statement", () => {

    beforeEach(() => {
        userRepositoryInMemory = new InMemoryUsersRepository();
        statementsRepositoryInMemory = new InMemoryStatementsRepository();
        createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
        authenticateUserUseCase = new AuthenticateUserUseCase(userRepositoryInMemory);
        createStatementUseCase = new CreateStatementUseCase(userRepositoryInMemory, statementsRepositoryInMemory);
        getBalanceUseCase = new GetBalanceUseCase(statementsRepositoryInMemory, userRepositoryInMemory);
    });

    it("should be able to perform a deposit", async () => {
        const user = { 
            name: "random name", 
            email: "randomemail@test.com", 
            password: "randompassword" 
        };
        await createUserUseCase.execute(user);

        const auth = {
            email: user.email,
            password: user.password
        }
        const authReponse = await authenticateUserUseCase.execute(auth);
        
        const authToken = authReponse.token; 
        const jwtVerify = verify(authToken, authConfig.jwt.secret) as IPayload;
        const user_id = jwtVerify.sub;

        const deposit = {
            user_id,
            type: "deposit" as OperationType,
            amount: 500,
            description: "deposit description"
        };

        const withdraw = {
            user_id,
            type: "withdraw" as OperationType,
            amount: 500,
            description: "deposit description"
        };

        await createStatementUseCase.execute(deposit);
        await createStatementUseCase.execute(deposit);
        await createStatementUseCase.execute(withdraw);
        await createStatementUseCase.execute(deposit);
        await createStatementUseCase.execute(withdraw);
        await createStatementUseCase.execute(deposit);

        const response = await getBalanceUseCase.execute({user_id});
        const quantidadeTransacoes = response.statement.length;
        
        expect(quantidadeTransacoes).toBeGreaterThan(1);
        expect(response).toHaveProperty('statement');
        expect(response).toHaveProperty('balance');
    });
    
    
});