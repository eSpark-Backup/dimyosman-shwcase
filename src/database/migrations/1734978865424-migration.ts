import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1734978865424 implements MigrationInterface {
    name = 'Migration1734978865424'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`spaces\` DROP FOREIGN KEY \`FK_8cdeb559005c464b78c7a43a7d4\``);
        await queryRunner.query(`ALTER TABLE \`events\` DROP COLUMN \`maxLeaseDays\``);
        await queryRunner.query(`ALTER TABLE \`spaces\` DROP COLUMN \`event\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`userChatId\` varchar(100) NULL`);
        await queryRunner.query(`ALTER TABLE \`events\` ADD CONSTRAINT \`FK_309ca69c58f91da62b4d81f4a0d\` FOREIGN KEY (\`brand\`) REFERENCES \`brand\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`events\` ADD CONSTRAINT \`FK_8019ff777b98f8232e4e3cea150\` FOREIGN KEY (\`space\`) REFERENCES \`spaces\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`spaces\` ADD CONSTRAINT \`FK_979f73538849b6e23e0096ff6cb\` FOREIGN KEY (\`brand\`) REFERENCES \`brand\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`spaces\` DROP FOREIGN KEY \`FK_979f73538849b6e23e0096ff6cb\``);
        await queryRunner.query(`ALTER TABLE \`events\` DROP FOREIGN KEY \`FK_8019ff777b98f8232e4e3cea150\``);
        await queryRunner.query(`ALTER TABLE \`events\` DROP FOREIGN KEY \`FK_309ca69c58f91da62b4d81f4a0d\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`userChatId\``);
        await queryRunner.query(`ALTER TABLE \`spaces\` ADD \`event\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`events\` ADD \`maxLeaseDays\` varchar(256) NULL`);
        await queryRunner.query(`ALTER TABLE \`spaces\` ADD CONSTRAINT \`FK_8cdeb559005c464b78c7a43a7d4\` FOREIGN KEY (\`event\`) REFERENCES \`events\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
