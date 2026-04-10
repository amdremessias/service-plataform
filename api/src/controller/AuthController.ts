import { Request, Response } from "express";
import { AuthService } from "../service/AuthService";

export class AuthController {
    private authService = new AuthService();

    async register(req: Request, res: Response) {
        const { email, password, role } = req.body;
        try {
            const user = await this.authService.register(email, password, role);
            res.status(201).json({ message: "User registered successfully", user: { id: user.id, email: user.email, role: user.role } });
        } catch (error) {
            res.status(400).json({ message: "Error registering user", error: error.message });
        }
    }

    async login(req: Request, res: Response) {
        const { email, password } = req.body;
        try {
            const result = await this.authService.login(email, password);
            if (result) {
                res.status(200).json({ message: "Login successful", token: result.token, user: { id: result.user.id, email: result.user.email, role: result.user.role } });
            } else {
                res.status(401).json({ message: "Invalid credentials" });
            }
        } catch (error) {
            res.status(500).json({ message: "Error logging in", error: error.message });
        }
    }
}
