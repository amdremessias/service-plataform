export const config = {
    baseUrl: process.env.BASE_URL || "http://localhost:3001",
    jwtSecret: process.env.JWT_SECRET || "supersecret",
    paymentWebhookSecret: process.env.PAYMENT_WEBHOOK_SECRET || "webhooksecret",
    // Adicione outras configurações aqui
};
