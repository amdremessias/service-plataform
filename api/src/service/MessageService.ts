import { AppDataSource } from "../data-source";
import { Message } from "../entity/Message";
import { User } from "../entity/User";

export class MessageService {
    private messageRepository = AppDataSource.getRepository(Message);
    private userRepository = AppDataSource.getRepository(User);

    async sendMessage(senderId: number, receiverId: number, content: string): Promise<Message> {
        const sender = await this.userRepository.findOne({ where: { id: senderId } });
        const receiver = await this.userRepository.findOne({ where: { id: receiverId } });

        if (!sender || !receiver) {
            throw new Error("Sender or receiver not found.");
        }

        const message = this.messageRepository.create({ sender, receiver, content });
        return this.messageRepository.save(message);
    }

    async getMessagesBetweenUsers(user1Id: number, user2Id: number): Promise<Message[]> {
        return this.messageRepository.find({
            where: [
                { sender: { id: user1Id }, receiver: { id: user2Id } },
                { sender: { id: user2Id }, receiver: { id: user1Id } },
            ],
            relations: ["sender", "receiver"],
            order: { created_at: "ASC" },
        });
    }

    async markMessageAsRead(messageId: number): Promise<Message | null> {
        const message = await this.messageRepository.findOne({ where: { id: messageId } });
        if (message) {
            message.read = true;
            return this.messageRepository.save(message);
        }
        return null;
    }
}
