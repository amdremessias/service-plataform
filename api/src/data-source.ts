import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "db",
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER || "user",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_NAME || "marketplace",
    synchronize: true, // Apenas para desenvolvimento, usar migrações em produção
    logging: false,
    entities: [__dirname + "/entity/*.js"], // User, Service, Message, OTP
    ],
    migrations: [],
    subscribers: [],
});
