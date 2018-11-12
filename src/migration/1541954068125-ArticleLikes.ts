import {MigrationInterface, QueryRunner} from "typeorm";

export class ArticleLikes1541954068125 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `like` ADD `articleId` varchar(255) NULL");
        await queryRunner.query("ALTER TABLE `like` ADD CONSTRAINT `FK_a95ce350aee91167d8a1cefeb97` FOREIGN KEY (`articleId`) REFERENCES `article`(`id`)");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `like` DROP FOREIGN KEY `FK_a95ce350aee91167d8a1cefeb97`");
        await queryRunner.query("ALTER TABLE `like` DROP COLUMN `articleId`");
    }

}
