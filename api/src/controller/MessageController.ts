import { Request, Response } from "express";
import { MessageService } from "../service/MessageService";

export class MessageController {
    private messageService = new MessageService();

    async sendMessage(req: Request, res: Response) {
        const { receiverId, content } = req.body;
        const senderId = req.user.userId; // Assuming req.user is populated by authMiddleware
        try {
            const message = await this.messageService.sendMessage(senderId, receiverId, content);
            res.status(201).json(message);
        } catch (error) {
            res.status(400).json({ message: "Error sending message", error: error.message });
        }
    }

    async getConversation(req: Request, res: Response) {
        const { otherUserId } = req.params;
        const currentUserId = req.user.userId; // Assuming req.user is populated by authMiddleware
        try {
            const messages = await this.messageService.getMessagesBetweenUsers(currentUserId, Number(otherUserId));
            res.status(200).json(messages);
        } catch (error) {
            res.status(500).json({ message: "Error fetching conversation", error: error.message });
        }
    }

    async markAsRead(req: Request, res: Response) {
        const { messageId } = req.params;
        try {
            const message = await this.messageService.markMessageAsRead(Number(messageId));
            if (message) {
                res.status(200).json({ message: "Message marked as read", message });
            } else {
                res.status(404).json({ message: "Message not found" });
            }
        } catch (error) {
            res.status(500).json({ message: "Error marking message as read", error: error.message });
        }
    }
}
