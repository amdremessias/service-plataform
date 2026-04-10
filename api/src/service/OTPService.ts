import { AppDataSource } from "../data-source";
import { OTP } from "../entity/OTP";
import { User } from "../entity/User";
import crypto from "crypto";

export class OTPService {
    private otpRepository = AppDataSource.getRepository(OTP);
    private userRepository = AppDataSource.getRepository(User);

    async generateOTP(userId: number): Promise<OTP> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new Error("User not found.");
        }

        const token = crypto.randomBytes(3).toString("hex").toUpperCase(); // 6-character alphanumeric OTP
        const expires_at = new Date();
        expires_at.setMinutes(expires_at.getMinutes() + 10); // OTP valid for 10 minutes

        const otp = this.otpRepository.create({ token, user, expires_at });
        return this.otpRepository.save(otp);
    }

    async verifyOTP(userId: number, token: string): Promise<boolean> {
        const otp = await this.otpRepository.findOne({
            where: { user: { id: userId }, token, is_used: false },
            order: { created_at: "DESC" },
        });

        if (!otp) {
            return false;
        }

        if (otp.expires_at < new Date()) {
            otp.is_used = true; // Mark as used even if expired
            await this.otpRepository.save(otp);
            return false;
        }

        otp.is_used = true;
        await this.otpRepository.save(otp);
        return true;
    }
}
