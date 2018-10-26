import {MigrationInterface, QueryRunner} from "typeorm";

export class EntitiesModifications1540564732380 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `discussion` ADD `topic` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `discussion` ADD `description` varchar(1000) NOT NULL");
        await queryRunner.query("ALTER TABLE `resource` ADD `publicationDate` datetime NULL");
        await queryRunner.query("ALTER TABLE `user` ADD `dateOfBirth` datetime NOT NULL");
        await queryRunner.query("ALTER TABLE `announcement` ADD `publicationDate` datetime NULL");
        await queryRunner.query("ALTER TABLE `job` ADD `publicationDate` datetime NULL");
        await queryRunner.query("ALTER TABLE `job` ADD `organizationLogoUrl` varchar(255) NULL");
        await queryRunner.query("ALTER TABLE `article` CHANGE `publicationDate` `publicationDate` datetime NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `article` CHANGE `publicationDate` `publicationDate` datetime NOT NULL");
        await queryRunner.query("ALTER TABLE `job` DROP COLUMN `organizationLogoUrl`");
        await queryRunner.query("ALTER TABLE `job` DROP COLUMN `publicationDate`");
        await queryRunner.query("ALTER TABLE `announcement` DROP COLUMN `publicationDate`");
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `dateOfBirth`");
        await queryRunner.query("ALTER TABLE `resource` DROP COLUMN `publicationDate`");
        await queryRunner.query("ALTER TABLE `discussion` DROP COLUMN `description`");
        await queryRunner.query("ALTER TABLE `discussion` DROP COLUMN `topic`");
    }

}
