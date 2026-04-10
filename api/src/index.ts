import "reflect-metadata";
import express from "express";
import "dotenv/config";
import { AppDataSource } from "./data-source";
import { AuthController } from "./controller/AuthController";
import { ServiceController } from "./controller/ServiceController";
import { MessageController } from "./controller/MessageController";
import { OTPController } from "./controller/OTPController";
import { PaymentController } from "./controller/PaymentController";
import { authMiddleware } from "./middleware/auth";

const app = express();
const authController = new AuthController();
const serviceController = new ServiceController();
const messageController = new MessageController();
const otpController = new OTPController();
const paymentController = new PaymentController();
const port = process.env.PORT || 3001;

app.use(express.json());

AppDataSource.initialize().then(() => {
    console.log("Database connected!");
    app.listen(port, () => {
        console.log(`API running on port ${port}`);
    });
}).catch(error => console.log(error));

// Auth Routes
app.post("/auth/register", authController.register.bind(authController));
app.post("/auth/login", authController.login.bind(authController));

// Service Routes (Protected)
app.post("/services", authMiddleware, serviceController.createService.bind(serviceController));
app.get("/services/nearby", authMiddleware, serviceController.getServicesByLocation.bind(serviceController));
app.get("/services/:id", authMiddleware, serviceController.getServiceById.bind(serviceController));

// Message Routes (Protected)
app.post("/messages", authMiddleware, messageController.sendMessage.bind(messageController));
app.get("/messages/conversation/:otherUserId", authMiddleware, messageController.getConversation.bind(messageController));
app.put("/messages/:messageId/read", authMiddleware, messageController.markAsRead.bind(messageController));

// OTP Routes (Protected)
app.post("/otp/generate", authMiddleware, otpController.generateOTP.bind(otpController));
app.post("/otp/verify", authMiddleware, otpController.verifyOTP.bind(otpController));

// Payment Routes (Protected)
app.post("/payments/process", authMiddleware, paymentController.processPayment.bind(paymentController));

// Webhook Route (Public)
app.post("/webhooks/payment", paymentController.handleWebhook.bind(paymentController));

// Placeholder for other routes
app.get("/", (req, res) => {
    res.send("Marketplace API is running!");
});

// Placeholder for webhook routes
app.post("/webhooks/payment", (req, res) => {
    console.log("Payment webhook received:", req.body);
    // Implement webhook signature validation here
    res.status(200).send("Webhook received");
});
