import {MigrationInterface, QueryRunner} from "typeorm";

export class WebinarAnchorManyToOne1541010498396 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `webinar` ADD `anchorId` varchar(255) NULL");
        await queryRunner.query("ALTER TABLE `webinar` ADD CONSTRAINT `FK_e966510fbd3c92818133770d1af` FOREIGN KEY (`anchorId`) REFERENCES `user`(`id`)");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `webinar` DROP FOREIGN KEY `FK_e966510fbd3c92818133770d1af`");
        await queryRunner.query("ALTER TABLE `webinar` DROP COLUMN `anchorId`");
    }

}
