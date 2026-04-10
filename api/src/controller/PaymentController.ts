import { Request, Response } from "express";
import { PaymentService } from "../service/PaymentService";

export class PaymentController {
    private paymentService = new PaymentService();

    async processPayment(req: Request, res: Response) {
        const { amount, paymentMethod } = req.body;
        const userId = req.user.userId; // Assuming req.user is populated by authMiddleware
        try {
            const result = await this.paymentService.processPayment(userId, amount, paymentMethod);
            res.status(200).json({ message: "Payment processed successfully", result });
        } catch (error) {
            res.status(400).json({ message: "Error processing payment", error: error.message });
        }
    }

    async handleWebhook(req: Request, res: Response) {
        const signature = req.headers["x-signature"] as string; // Example header, adjust based on payment provider
        const payload = req.body;
        const webhookSecret = process.env.PAYMENT_WEBHOOK_SECRET || "webhooksecret";

        try {
            const isValid = await this.paymentService.validateWebhookSignature(payload, signature, webhookSecret);
            if (isValid) {
                console.log("Webhook signature valid. Processing event:", payload);
                // Process the webhook event (e.g., update order status, confirm service booking)
                res.status(200).send("Webhook received and processed");
            } else {
                res.status(401).send("Invalid webhook signature");
            }
        } catch (error) {
            console.error("Error handling webhook:", error);
            res.status(500).send("Internal server error");
        }
    }
}
