import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1739793620693 implements MigrationInterface {
    name = 'Migration1739793620693'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`logs\` DROP COLUMN \`timestamp\``);
        await queryRunner.query(`ALTER TABLE \`logs\` DROP COLUMN \`message\``);
        await queryRunner.query(`ALTER TABLE \`logs\` ADD \`message\` json NULL`);
        await queryRunner.query(`ALTER TABLE \`events\` ADD CONSTRAINT \`FK_218910d332c32dd7c72d691761c\` FOREIGN KEY (\`user\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`events\` ADD CONSTRAINT \`FK_309ca69c58f91da62b4d81f4a0d\` FOREIGN KEY (\`brand\`) REFERENCES \`brand\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`lease_space\` ADD CONSTRAINT \`FK_fc1395bd070a54684d00e784a3d\` FOREIGN KEY (\`spaceId\`) REFERENCES \`spaces\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`lease_space\` ADD CONSTRAINT \`FK_6ffc101d148fa3a4b7df71f5904\` FOREIGN KEY (\`brandId\`) REFERENCES \`brand\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`lease_space\` ADD CONSTRAINT \`FK_8b07a24aaa892c4b5c225cad8a7\` FOREIGN KEY (\`eventId\`) REFERENCES \`events\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`saved_entity\` ADD CONSTRAINT \`FK_75609393f91acf1243090b36ed0\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`saved_entity\` ADD CONSTRAINT \`FK_9eea529b01df74dd9780fcd22bf\` FOREIGN KEY (\`brandId\`) REFERENCES \`brand\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`saved_entity\` DROP FOREIGN KEY \`FK_9eea529b01df74dd9780fcd22bf\``);
        await queryRunner.query(`ALTER TABLE \`saved_entity\` DROP FOREIGN KEY \`FK_75609393f91acf1243090b36ed0\``);
        await queryRunner.query(`ALTER TABLE \`lease_space\` DROP FOREIGN KEY \`FK_8b07a24aaa892c4b5c225cad8a7\``);
        await queryRunner.query(`ALTER TABLE \`lease_space\` DROP FOREIGN KEY \`FK_6ffc101d148fa3a4b7df71f5904\``);
        await queryRunner.query(`ALTER TABLE \`lease_space\` DROP FOREIGN KEY \`FK_fc1395bd070a54684d00e784a3d\``);
        await queryRunner.query(`ALTER TABLE \`events\` DROP FOREIGN KEY \`FK_309ca69c58f91da62b4d81f4a0d\``);
        await queryRunner.query(`ALTER TABLE \`events\` DROP FOREIGN KEY \`FK_218910d332c32dd7c72d691761c\``);
        await queryRunner.query(`ALTER TABLE \`logs\` DROP COLUMN \`message\``);
        await queryRunner.query(`ALTER TABLE \`logs\` ADD \`message\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`logs\` ADD \`timestamp\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
    }

}
