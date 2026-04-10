import { Request, Response } from "express";
import { OTPService } from "../service/OTPService";

export class OTPController {
    private otpService = new OTPService();

    async generateOTP(req: Request, res: Response) {
        const userId = req.user.userId; // Assuming req.user is populated by authMiddleware
        try {
            const otp = await this.otpService.generateOTP(userId);
            res.status(201).json({ message: "OTP generated successfully", token: otp.token });
        } catch (error) {
            res.status(400).json({ message: "Error generating OTP", error: error.message });
        }
    }

    async verifyOTP(req: Request, res: Response) {
        const { token } = req.body;
        const userId = req.user.userId; // Assuming req.user is populated by authMiddleware
        try {
            const isValid = await this.otpService.verifyOTP(userId, token);
            if (isValid) {
                res.status(200).json({ message: "OTP verified successfully" });
            } else {
                res.status(400).json({ message: "Invalid or expired OTP" });
            }
        } catch (error) {
            res.status(500).json({ message: "Error verifying OTP", error: error.message });
        }
    }
}
