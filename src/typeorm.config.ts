import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

// TypeORM Configuration
export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT ? Number(process.env.DB_PORT) : 3306,
  username: process.env.MYSQL_USER,
  database: process.env.MYSQL_DATABASE,
  password: process.env.MYSQL_PASSWORD,
  synchronize: true,
  logging: false,
  entities: [__dirname + "/entity/*.entity{.ts,.js}"],
  migrations: [__dirname + "/*.entity{.ts,.js}"],
  subscribers: [],
});
