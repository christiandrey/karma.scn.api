import {MigrationInterface, QueryRunner} from "typeorm";

export class CommentAndPostsContentLengthToMax1542256531480 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `timeline_photo` DROP COLUMN `caption`");
        await queryRunner.query("ALTER TABLE `timeline_photo` ADD `caption` longtext NOT NULL");
        await queryRunner.query("ALTER TABLE `timeline_update` DROP COLUMN `content`");
        await queryRunner.query("ALTER TABLE `timeline_update` ADD `content` longtext NOT NULL");
        await queryRunner.query("ALTER TABLE `comment` DROP COLUMN `content`");
        await queryRunner.query("ALTER TABLE `comment` ADD `content` longtext NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `comment` DROP COLUMN `content`");
        await queryRunner.query("ALTER TABLE `comment` ADD `content` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `timeline_update` DROP COLUMN `content`");
        await queryRunner.query("ALTER TABLE `timeline_update` ADD `content` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `timeline_photo` DROP COLUMN `caption`");
        await queryRunner.query("ALTER TABLE `timeline_photo` ADD `caption` varchar(255) NOT NULL");
    }

}
