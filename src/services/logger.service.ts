import { AppDataSource } from "../typeorm.config";
import { Logs } from "../entity"; 
import { logger } from "../utils";



export const logToDatabase = async (message: object, level: string) => {
  try {
    const logRepository = AppDataSource.getRepository(Logs);
    const log = new Logs();
    log.message = message;
    log.level = level;
    
    await logRepository.save(log);
  } catch (error) {
    logger.error(`Error saving log to DB: ${error.message}`);
  }
};

export { logger };
