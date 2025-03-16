import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
    userId?: string;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
        const token = req.headers["authorization"]?.split(" ")[1];

        if (!token) {
            res.status(401).json({ success: false, message: "No token provided" });
            return;
        }

        jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
            if (err) {
                res.status(401).json({ success: false, message: "Invalid token" });
                return;
            }
            req.userId = (decoded as { userId: string }).userId;
            next();
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error", error });
    }
};