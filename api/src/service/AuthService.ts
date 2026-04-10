import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

export class AuthService {
    private userRepository = AppDataSource.getRepository(User);

    async register(email: string, password: string, role: string): Promise<User> {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = this.userRepository.create({ email, password_hash: hashedPassword, role });
        return this.userRepository.save(user);
    }

    async login(email: string, password: string): Promise<{ user: User, token: string } | null> {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            return null;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return null;
        }

        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET || "supersecret", { expiresIn: "1h" });
        return { user, token };
    }

    async findUserById(id: number): Promise<User | null> {
        return this.userRepository.findOne({ where: { id } });
    }
}
