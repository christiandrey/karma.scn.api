import {MigrationInterface, QueryRunner} from "typeorm";

export class RevertMediaUrlTokenAndPath1540529052394 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `media` DROP COLUMN `path`");
        await queryRunner.query("ALTER TABLE `media` DROP COLUMN `urlToken`");
        await queryRunner.query("ALTER TABLE `media` ADD `url` varchar(255) NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `media` DROP COLUMN `url`");
        await queryRunner.query("ALTER TABLE `media` ADD `urlToken` varchar(255) NULL");
        await queryRunner.query("ALTER TABLE `media` ADD `path` varchar(255) NULL");
    }

}
