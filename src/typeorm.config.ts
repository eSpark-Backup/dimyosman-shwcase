import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

// TypeORM Configuration
export const AppDataSource = new DataSource({
  type: "mariadb",
  host: "localhost",
  port: 3306,
  username: "root",
  database: "shwcase",
  synchronize: true,
  logging: false,
  entities: [__dirname + "/entity/*.entity{.ts,.js}"],
  migrations: [__dirname + "/*.entity{.ts,.js}"],
  subscribers: [],
});
