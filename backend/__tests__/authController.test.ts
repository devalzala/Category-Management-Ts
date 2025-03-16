import request from "supertest";
import mongoose from "mongoose";
import app from "../index";
import User from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

jest.mock("../models/userModel");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("Auth Controller", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Register a user
    describe("POST /api/auth/register", () => {
        it("should return 400 if user already exists", async () => {
            (User.findOne as jest.Mock).mockResolvedValue({ email: "john@example.com" });

            const res = await request(app)
                .post("/api/auth/register")
                .send({ name: "John Doe", email: "john@example.com", password: "password123" });

            expect(res.status).toBe(400);
            expect(res.body.message).toBe("User already exists");
        });
    });

    // Login a user
    describe("POST /api/auth/login", () => {
        it("should return 400 for invalid credentials", async () => {
            (User.findOne as jest.Mock).mockResolvedValue(null);

            const res = await request(app)
                .post("/api/auth/login")
                .send({ email: "john@example.com", password: "wrongpassword" });

            expect(res.status).toBe(400);
            expect(res.body.message).toBe("Invalid credentials");
        });

        it("should return 400 if password is incorrect", async () => {
            const mockUser = { _id: "1", email: "john@example.com", password: "hashedpassword" };
            (User.findOne as jest.Mock).mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            const res = await request(app)
                .post("/api/auth/login")
                .send({ email: "john@example.com", password: "wrongpassword" });

            expect(res.status).toBe(400);
            expect(res.body.message).toBe("Invalid credentials");
        });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });
});