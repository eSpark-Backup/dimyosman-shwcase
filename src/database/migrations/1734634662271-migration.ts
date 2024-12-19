import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1734634662271 implements MigrationInterface {
    name = 'Migration1734634662271'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`spaces\` (\`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` varchar(36) NOT NULL, \`spaceName\` varchar(100) NOT NULL, \`spaceCategory\` json NULL, \`spaceImage\` varchar(500) NULL, \`imageKey\` varchar(500) NULL, \`coverImages\` json NULL, \`details\` json NULL, \`pricing\` json NULL, \`location\` json NULL, \`amenity\` json NULL, \`status\` enum ('ARCHIVE', 'DRAFT', 'PUBLISH') NOT NULL DEFAULT 'DRAFT', \`userId\` varchar(36) NULL, \`brand\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`brand\` (\`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` varchar(36) NOT NULL, \`brandName\` varchar(100) NOT NULL, \`brandCategory\` json NULL, \`brandImage\` varchar(500) NULL, \`imageKey\` varchar(500) NULL, \`coverImages\` json NULL, \`details\` json NULL, \`location\` json NULL, \`status\` enum ('ARCHIVE', 'DRAFT', 'PUBLISH') NOT NULL DEFAULT 'DRAFT', \`userId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` varchar(36) NOT NULL, \`name\` varchar(100) NOT NULL, \`email\` varchar(100) NOT NULL, \`socialId\` varchar(100) NULL, \`profileImage\` varchar(100) NULL, \`imageKey\` varchar(100) NULL, \`password\` varchar(255) NULL, \`role\` varchar(50) NULL DEFAULT 'user', \`loginType\` enum ('local', 'facebook', 'google', 'apple') NOT NULL DEFAULT 'local', \`isSocialLogin\` tinyint NOT NULL DEFAULT 0, INDEX \`IDX_cace4a159ff9f2512dd4237376\` (\`id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`category\` (\`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` varchar(36) NOT NULL, \`name\` varchar(100) NOT NULL, \`categoryType\` enum ('EVENTS', 'SPACES', 'BRANDS') NOT NULL DEFAULT 'BRANDS', INDEX \`IDX_9c4e4a89e3674fc9f382d733f0\` (\`id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`amenities\` (\`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` varchar(36) NOT NULL, \`amenitiesName\` varchar(100) NOT NULL, \`amenitiesImage\` varchar(500) NULL, \`imageKey\` varchar(500) NULL, INDEX \`IDX_c0777308847b3556086f2fb233\` (\`id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`events\` (\`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` varchar(36) NOT NULL, \`eventName\` varchar(100) NOT NULL, \`eventCategory\` json NULL, \`eventImage\` varchar(500) NULL, \`imageKey\` varchar(500) NULL, \`coverImages\` json NULL, \`details\` json NULL, \`minLeaseDays\` varchar(256) NULL, \`location\` json NULL, \`eventDate\` json NULL, \`status\` enum ('ARCHIVE', 'DRAFT', 'PUBLISH') NOT NULL DEFAULT 'DRAFT', \`userId\` varchar(36) NULL, \`brand\` varchar(36) NULL, \`space\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`spaces\` ADD CONSTRAINT \`FK_533cbce0a78fc63c5f012d1922b\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`spaces\` ADD CONSTRAINT \`FK_979f73538849b6e23e0096ff6cb\` FOREIGN KEY (\`brand\`) REFERENCES \`brand\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`brand\` ADD CONSTRAINT \`FK_73dff8bc5f4de65c927e4f414ff\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`events\` ADD CONSTRAINT \`FK_9929fa8516afa13f87b41abb263\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`events\` ADD CONSTRAINT \`FK_309ca69c58f91da62b4d81f4a0d\` FOREIGN KEY (\`brand\`) REFERENCES \`brand\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`events\` ADD CONSTRAINT \`FK_8019ff777b98f8232e4e3cea150\` FOREIGN KEY (\`space\`) REFERENCES \`spaces\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`events\` DROP FOREIGN KEY \`FK_8019ff777b98f8232e4e3cea150\``);
        await queryRunner.query(`ALTER TABLE \`events\` DROP FOREIGN KEY \`FK_309ca69c58f91da62b4d81f4a0d\``);
        await queryRunner.query(`ALTER TABLE \`events\` DROP FOREIGN KEY \`FK_9929fa8516afa13f87b41abb263\``);
        await queryRunner.query(`ALTER TABLE \`brand\` DROP FOREIGN KEY \`FK_73dff8bc5f4de65c927e4f414ff\``);
        await queryRunner.query(`ALTER TABLE \`spaces\` DROP FOREIGN KEY \`FK_979f73538849b6e23e0096ff6cb\``);
        await queryRunner.query(`ALTER TABLE \`spaces\` DROP FOREIGN KEY \`FK_533cbce0a78fc63c5f012d1922b\``);
        await queryRunner.query(`DROP TABLE \`events\``);
        await queryRunner.query(`DROP INDEX \`IDX_c0777308847b3556086f2fb233\` ON \`amenities\``);
        await queryRunner.query(`DROP TABLE \`amenities\``);
        await queryRunner.query(`DROP INDEX \`IDX_9c4e4a89e3674fc9f382d733f0\` ON \`category\``);
        await queryRunner.query(`DROP TABLE \`category\``);
        await queryRunner.query(`DROP INDEX \`IDX_cace4a159ff9f2512dd4237376\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`brand\``);
        await queryRunner.query(`DROP TABLE \`spaces\``);
    }

}
