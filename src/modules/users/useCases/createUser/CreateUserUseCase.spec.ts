
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let userRepositoryInMemory: InMemoryUsersRepository;

describe("User Creation", () => {

    beforeEach(() => {
        userRepositoryInMemory = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
    })

    it("should be able to create a new user", async () => {
        const user = { 
            name: "random name", 
            email: "randomemail@test.com", 
            password: "randompassword" 
        };

        const createdUser = await createUserUseCase.execute(user);
        expect(createdUser).toHaveProperty("id");
    });
});