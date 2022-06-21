import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;
let email: string;
let password: string;
let jwt: string

describe("Create category controller",  () => {

    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();
        
        email = "admin5@admin.com.br";
        password = "admin5";

        await request(app)
        .post("/api/v1/users")
        .send({
            email,
            password,
            name: "gustavin"
        });

        const authInfo = request(app)
        .post("/api/v1/sessions")
        .send({
            email,
            password
        });

        const authResponse = (await authInfo).body;
        jwt = authResponse.token;
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it("should be able to perform a deposit", async () => {
        const response = request(app)
        .post("/api/v1/statements/deposit")
        .send({
            amount: 500,
            description: "fake description"
        })
        .set({
            Authorization: `Bearer ${jwt}`
        });

        const bodyResponse = (await response).body;
        const responseStatus = (await response).status;

        expect(responseStatus).toBe(201);
        expect(bodyResponse).toHaveProperty("id");
    });

    it("should be able to perform a withdraw", async () => {
        const response = request(app)
        .post("/api/v1/statements/withdraw")
        .send({
            amount: 500,
            description: "fake description"
        })
        .set({
            Authorization: `Bearer ${jwt}`
        });

        const bodyResponse = (await response).body;
        const responseStatus = (await response).status;

        expect(responseStatus).toBe(201);
        expect(bodyResponse).toHaveProperty("id");
    });
});