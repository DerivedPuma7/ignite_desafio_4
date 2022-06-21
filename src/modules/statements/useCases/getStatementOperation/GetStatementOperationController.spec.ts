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
        
        email = "admin6@admin.com.br";
        password = "admin6";

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

    it("should be able to get a statement by it's id", async () => {
        const transaction = request(app)
        .post("/api/v1/statements/deposit")
        .send({
            amount: 500,
            description: "fake description"
        })
        .set({
            Authorization: `Bearer ${jwt}`
        });

        const transactionResponse = (await transaction).body;
        const transaction_id = transactionResponse.id;

        const response = request(app)
        .get(`/api/v1/statements/${transaction_id}`)
        .set({
            Authorization: `Bearer ${jwt}`
        });

        const responseBody = (await response).body;

        expect(responseBody).toHaveProperty("id");
        expect(responseBody.id).toEqual(transaction_id);
    });
});