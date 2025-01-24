import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1737727626463 implements MigrationInterface {
    name = 'Migration1737727626463'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`rsvp\` (\`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` varchar(36) NOT NULL, \`attendanceDates\` json NOT NULL, \`verifyAttendance\` tinyint NOT NULL DEFAULT 0, \`review\` varchar(255) NULL, \`rating\` varchar(255) NULL, \`user\` varchar(36) NULL, \`event\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`events\` ADD CONSTRAINT \`FK_309ca69c58f91da62b4d81f4a0d\` FOREIGN KEY (\`brand\`) REFERENCES \`brand\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`events\` ADD CONSTRAINT \`FK_8019ff777b98f8232e4e3cea150\` FOREIGN KEY (\`space\`) REFERENCES \`spaces\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rsvp\` ADD CONSTRAINT \`FK_9c8ba8987507ce38563d94be085\` FOREIGN KEY (\`user\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rsvp\` ADD CONSTRAINT \`FK_41854c711bf4135fda49c80e9fb\` FOREIGN KEY (\`event\`) REFERENCES \`events\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`lease_space\` ADD CONSTRAINT \`FK_fc1395bd070a54684d00e784a3d\` FOREIGN KEY (\`spaceId\`) REFERENCES \`spaces\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`lease_space\` ADD CONSTRAINT \`FK_415ec26bb96e6623e10deb5e714\` FOREIGN KEY (\`tenantId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`lease_space\` ADD CONSTRAINT \`FK_79e231e1a6178a7461ae687a555\` FOREIGN KEY (\`ownerId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`spaces\` ADD CONSTRAINT \`FK_979f73538849b6e23e0096ff6cb\` FOREIGN KEY (\`brand\`) REFERENCES \`brand\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`spaces\` DROP FOREIGN KEY \`FK_979f73538849b6e23e0096ff6cb\``);
        await queryRunner.query(`ALTER TABLE \`lease_space\` DROP FOREIGN KEY \`FK_79e231e1a6178a7461ae687a555\``);
        await queryRunner.query(`ALTER TABLE \`lease_space\` DROP FOREIGN KEY \`FK_415ec26bb96e6623e10deb5e714\``);
        await queryRunner.query(`ALTER TABLE \`lease_space\` DROP FOREIGN KEY \`FK_fc1395bd070a54684d00e784a3d\``);
        await queryRunner.query(`ALTER TABLE \`rsvp\` DROP FOREIGN KEY \`FK_41854c711bf4135fda49c80e9fb\``);
        await queryRunner.query(`ALTER TABLE \`rsvp\` DROP FOREIGN KEY \`FK_9c8ba8987507ce38563d94be085\``);
        await queryRunner.query(`ALTER TABLE \`events\` DROP FOREIGN KEY \`FK_8019ff777b98f8232e4e3cea150\``);
        await queryRunner.query(`ALTER TABLE \`events\` DROP FOREIGN KEY \`FK_309ca69c58f91da62b4d81f4a0d\``);
        await queryRunner.query(`DROP TABLE \`rsvp\``);
    }

}
