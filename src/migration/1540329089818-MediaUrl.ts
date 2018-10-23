import {MigrationInterface, QueryRunner} from "typeorm";

export class MediaUrl1540329089818 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `media` ADD `url` varchar(255) NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `media` DROP COLUMN `url`");
    }

}
