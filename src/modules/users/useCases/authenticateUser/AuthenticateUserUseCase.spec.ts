import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let userRepositoryInMemory: InMemoryUsersRepository;

describe("Authenticate user", () => {

    beforeEach(() => {
        userRepositoryInMemory = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
        authenticateUserUseCase = new AuthenticateUserUseCase(userRepositoryInMemory);
    });

    it("should be able to authenticate a user", async () => {
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

        expect(authReponse).toHaveProperty("token");
    });

    it("should not be able to authenticate a nonexistent user", async () => {
        const user = { 
            name: "random name", 
            email: "randomemail@test.com", 
            password: "randompassword" 
        };
        await createUserUseCase.execute(user);

        const auth = {
            email: "nonexistentemail@email.com",
            password: user.password
        }

        await expect(authenticateUserUseCase
            .execute(auth)
        ).rejects.toEqual(new AppError("Incorrect email or password", 401));
    });

    it("should not be able to authenticate a user with wrong password", async () => {
        const user = { 
            name: "random name", 
            email: "randomemail@test.com", 
            password: "randompassword" 
        };
        await createUserUseCase.execute(user);

        const auth = {
            email: "randomemail@test.com",
            password: "incorrectPassword"
        }

        await expect(authenticateUserUseCase
            .execute(auth)
        ).rejects.toEqual(new AppError("Incorrect email or password", 401));
    });
});