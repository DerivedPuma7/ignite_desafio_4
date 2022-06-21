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
        
        email = "admin4@admin.com.br";
        password = "admin4";

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

    it("should be able to get a user's statements", async () => {
        const response = request(app)
        .get("/api/v1/statements/balance")
        .set({
            Authorization: `Bearer ${jwt}`
        });

        const bodyResponse = (await response).body;

        expect(bodyResponse).toHaveProperty("statement");
        expect(bodyResponse).toHaveProperty("balance");
    });
});