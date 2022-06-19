import { verify } from "jsonwebtoken";

import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";

import authConfig from "../../../../config/auth";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

interface IPayload{
    sub: string;
}

let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;
let userRepositoryInMemory: InMemoryUsersRepository;

describe("User info", () => {

    beforeEach(() => {
        userRepositoryInMemory = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
        authenticateUserUseCase = new AuthenticateUserUseCase(userRepositoryInMemory);
        showUserProfileUseCase = new ShowUserProfileUseCase(userRepositoryInMemory);
    });

    it("should be able to get user info by jwt", async () => {
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

        const userProfile = await showUserProfileUseCase.execute(user_id);

        expect(userProfile).toHaveProperty('id');
        expect(userProfile).toHaveProperty('email');
        expect(userProfile).toHaveProperty('name');
    });
});