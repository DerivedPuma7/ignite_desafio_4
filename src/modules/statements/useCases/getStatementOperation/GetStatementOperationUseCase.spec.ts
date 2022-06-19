import { verify } from "jsonwebtoken";

import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../../../users/useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import authConfig from "../../../../config/auth";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let userRepositoryInMemory: InMemoryUsersRepository;
let statementsRepositoryInMemory: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

interface IPayload{
    sub: string;
}

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
}


describe("get statement", () => {

    beforeEach(() => {
        userRepositoryInMemory = new InMemoryUsersRepository();
        statementsRepositoryInMemory = new InMemoryStatementsRepository();
        createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
        authenticateUserUseCase = new AuthenticateUserUseCase(userRepositoryInMemory);
        createStatementUseCase = new CreateStatementUseCase(userRepositoryInMemory, statementsRepositoryInMemory);
        getStatementOperationUseCase = new GetStatementOperationUseCase(userRepositoryInMemory, statementsRepositoryInMemory);
    });

    it("should be able to recover an statement info", async () => {
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

        const createdDeposit = await createStatementUseCase.execute(deposit);

        const statementInfo = await getStatementOperationUseCase.execute({ 
            user_id, 
            statement_id: String(createdDeposit.id)
        });

        expect(statementInfo).toHaveProperty("id");
    });
});