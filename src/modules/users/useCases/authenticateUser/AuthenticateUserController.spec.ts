import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;
let email: string;
let password: string;

describe("Create category controller",  () => {

    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();

        email = "admin2@admin.com.br";
        password = "admin2";

        await request(app)
        .post("/api/v1/users")
        .send({
            email,
            password,
            name: "gustavin"
        });
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it("should be able to authenticate a user", async () => {
        const response = request(app)
        .post("/api/v1/sessions")
        .send({
            email,
            password
        });

        const bodyResponse = (await response).body
        expect(bodyResponse).toHaveProperty("user")
        expect(bodyResponse).toHaveProperty("token")
    });
});