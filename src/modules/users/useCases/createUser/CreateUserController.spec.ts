import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;

describe("Create category controller",  () => {

    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it("should be able to create a new user", async () => {
        const response = await request(app)
        .post("/api/v1/users")
        .send({
            email: "admin@admin.com.br",
            password: "admin",
            name: "gustavin"
        });

        expect(response.status).toBe(201);
    });
});