import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

// TypeORM Configuration
export const AppDataSource = new DataSource({
  type: "mariadb",
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  username: process.env.DB_USER,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [__dirname + "/entity/*.entity{.ts,.js}"],
  migrations: [__dirname + "/*.entity{.ts,.js}"],
  subscribers: [],
});
