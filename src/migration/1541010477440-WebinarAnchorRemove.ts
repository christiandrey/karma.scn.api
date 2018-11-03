import {MigrationInterface, QueryRunner} from "typeorm";

export class WebinarAnchorRemove1541010477440 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `webinar` DROP FOREIGN KEY `FK_e966510fbd3c92818133770d1af`");
        await queryRunner.query("DROP INDEX `REL_e966510fbd3c92818133770d1a` ON `webinar`");
        await queryRunner.query("ALTER TABLE `webinar` DROP COLUMN `anchorId`");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `webinar` ADD `anchorId` varchar(255) NULL");
        await queryRunner.query("CREATE UNIQUE INDEX `REL_e966510fbd3c92818133770d1a` ON `webinar`(`anchorId`)");
        await queryRunner.query("ALTER TABLE `webinar` ADD CONSTRAINT `FK_e966510fbd3c92818133770d1af` FOREIGN KEY (`anchorId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

}
