import {MigrationInterface, QueryRunner} from "typeorm";

export class ArticleReadingTime1541257300206 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `article` ADD `readingTime` varchar(255) NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `article` DROP COLUMN `readingTime`");
    }

}
