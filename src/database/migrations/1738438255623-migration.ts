import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1738438255623 implements MigrationInterface {
    name = 'Migration1738438255623'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`events\` ADD \`leaseSpaceId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`lease_space\` ADD \`eventId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`events\` ADD CONSTRAINT \`FK_218910d332c32dd7c72d691761c\` FOREIGN KEY (\`user\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`events\` ADD CONSTRAINT \`FK_3f923c1eeabbfe040f7aed97f2e\` FOREIGN KEY (\`leaseSpaceId\`) REFERENCES \`lease_space\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`lease_space\` ADD CONSTRAINT \`FK_fc1395bd070a54684d00e784a3d\` FOREIGN KEY (\`spaceId\`) REFERENCES \`spaces\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`lease_space\` ADD CONSTRAINT \`FK_6ffc101d148fa3a4b7df71f5904\` FOREIGN KEY (\`brandId\`) REFERENCES \`brand\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`lease_space\` ADD CONSTRAINT \`FK_8b07a24aaa892c4b5c225cad8a7\` FOREIGN KEY (\`eventId\`) REFERENCES \`events\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`lease_space\` ADD CONSTRAINT \`FK_79e231e1a6178a7461ae687a555\` FOREIGN KEY (\`ownerId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rsvp\` ADD CONSTRAINT \`FK_9c8ba8987507ce38563d94be085\` FOREIGN KEY (\`user\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rsvp\` ADD CONSTRAINT \`FK_41854c711bf4135fda49c80e9fb\` FOREIGN KEY (\`event\`) REFERENCES \`events\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`saved_entity\` ADD CONSTRAINT \`FK_75609393f91acf1243090b36ed0\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`saved_entity\` ADD CONSTRAINT \`FK_9eea529b01df74dd9780fcd22bf\` FOREIGN KEY (\`brandId\`) REFERENCES \`brand\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`saved_entity\` ADD CONSTRAINT \`FK_3c040c818edcdc40a142eda931f\` FOREIGN KEY (\`eventId\`) REFERENCES \`events\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`saved_entity\` ADD CONSTRAINT \`FK_581f28d12d28412125ae905d9f3\` FOREIGN KEY (\`spaceId\`) REFERENCES \`spaces\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`saved_entity\` DROP FOREIGN KEY \`FK_581f28d12d28412125ae905d9f3\``);
        await queryRunner.query(`ALTER TABLE \`saved_entity\` DROP FOREIGN KEY \`FK_3c040c818edcdc40a142eda931f\``);
        await queryRunner.query(`ALTER TABLE \`saved_entity\` DROP FOREIGN KEY \`FK_9eea529b01df74dd9780fcd22bf\``);
        await queryRunner.query(`ALTER TABLE \`saved_entity\` DROP FOREIGN KEY \`FK_75609393f91acf1243090b36ed0\``);
        await queryRunner.query(`ALTER TABLE \`rsvp\` DROP FOREIGN KEY \`FK_41854c711bf4135fda49c80e9fb\``);
        await queryRunner.query(`ALTER TABLE \`rsvp\` DROP FOREIGN KEY \`FK_9c8ba8987507ce38563d94be085\``);
        await queryRunner.query(`ALTER TABLE \`lease_space\` DROP FOREIGN KEY \`FK_79e231e1a6178a7461ae687a555\``);
        await queryRunner.query(`ALTER TABLE \`lease_space\` DROP FOREIGN KEY \`FK_8b07a24aaa892c4b5c225cad8a7\``);
        await queryRunner.query(`ALTER TABLE \`lease_space\` DROP FOREIGN KEY \`FK_6ffc101d148fa3a4b7df71f5904\``);
        await queryRunner.query(`ALTER TABLE \`lease_space\` DROP FOREIGN KEY \`FK_fc1395bd070a54684d00e784a3d\``);
        await queryRunner.query(`ALTER TABLE \`events\` DROP FOREIGN KEY \`FK_3f923c1eeabbfe040f7aed97f2e\``);
        await queryRunner.query(`ALTER TABLE \`events\` DROP FOREIGN KEY \`FK_218910d332c32dd7c72d691761c\``);
        await queryRunner.query(`ALTER TABLE \`lease_space\` DROP COLUMN \`eventId\``);
        await queryRunner.query(`ALTER TABLE \`events\` DROP COLUMN \`leaseSpaceId\``);
    }

}
