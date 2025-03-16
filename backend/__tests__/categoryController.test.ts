import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import express from "express";
import jwt from "jsonwebtoken";
import categoryRoutes from "../routes/categoryRoutes";
import Category from "../models/categoryModel";
import { authMiddleware } from "../middleware/authMiddleware";

jest.mock("../middleware/authMiddleware", () => ({
    authMiddleware: (req: any, res: any, next: any) => next(),
}));

const app = express();
app.use(express.json());
app.use("/api/category", categoryRoutes);

let mongoServer: MongoMemoryServer;
let token: string;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    await mongoose.connect(mongoUri);

    const fakeUser = { id: "1234567890" };
    token = jwt.sign(fakeUser, process.env.JWT_SECRET || "test_secret", { expiresIn: "1h" });
});

afterEach(async () => {
    await Category.deleteMany();
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
});

describe("Category Controller with Mock Database", () => {
    describe("POST /api/category", () => {
        it("should create a new category", async () => {
            const res = await request(app)
                .post("/api/category")
                .set("Authorization", `Bearer ${token}`)
                .send({ name: "Electronics" });

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Category created successfully");

            const category = await Category.findOne({ name: "Electronics" });
            expect(category).not.toBeNull();
        });

        it("should return 400 if category name is missing", async () => {
            const res = await request(app)
                .post("/api/category")
                .set("Authorization", `Bearer ${token}`)
                .send({});

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Category name is required");
        });
    });

    describe("GET /api/category", () => {
        it("should fetch all categories", async () => {
            await Category.create({ name: "Electronics" });

            const res = await request(app)
                .get("/api/category")
                .set("Authorization", `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.length).toBe(1);
            expect(res.body.data[0].name).toBe("Electronics");
        });
    });

    it("should fetch a category by ID", async () => {
        const category = await Category.create({ name: "Electronics" });
        console.log("Created category:", category);

        const res = await request(app)
            .get(`/api/category/${category._id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.name).toBe("Electronics");
    });


    describe("PUT /api/category/:id", () => {
        it("should update a category", async () => {
            const category = await Category.create({ name: "Electronics" });

            const res = await request(app)
                .put(`/api/category/${category._id}`)
                .set("Authorization", `Bearer ${token}`)
                .send({ name: "Updated Electronics" });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Category updated successfully");
        });
    });

    describe("DELETE /api/category/:id", () => {
        it("should delete a category", async () => {
            const category = await Category.create({ name: "Electronics" });

            const res = await request(app)
                .delete(`/api/category/${category._id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Category deleted successfully");
        });
    });
});