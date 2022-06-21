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
        
        email = "admin3@admin.com.br";
        password = "admin3";

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

    it("should be able to get user profile", async () => {
        const response = request(app)
        .get("/api/v1/profile")
        .set({
            Authorization: `Bearer ${jwt}`
        });

        const bodyResponse = (await response).body;

        expect(bodyResponse).toHaveProperty("id");
    });
});