import {MigrationInterface, QueryRunner} from "typeorm";

export class EntitiesMods1540728717280 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `like` DROP FOREIGN KEY `FK_e8fb739f08d47955a39850fac23`");
        await queryRunner.query("ALTER TABLE `timeline_photo` CHANGE `url` `mediaId` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `like` DROP COLUMN `userId`");
        await queryRunner.query("ALTER TABLE `notification` ADD `type` int NOT NULL");
        await queryRunner.query("ALTER TABLE `notification` ADD `data` varchar(255) NULL");
        await queryRunner.query("ALTER TABLE `notification` ADD `hasBeenRead` tinyint NOT NULL");
        await queryRunner.query("ALTER TABLE `user` ADD `verified` tinyint NOT NULL");
        await queryRunner.query("ALTER TABLE `timeline_photo` CHANGE `mediaId` `mediaId` varchar(255) NULL");
        await queryRunner.query("ALTER TABLE `timeline_photo` ADD UNIQUE INDEX `IDX_44e860ff060b678c12418f741e` (`mediaId`)");
        await queryRunner.query("ALTER TABLE `experience` DROP COLUMN `description`");
        await queryRunner.query("ALTER TABLE `experience` ADD `description` varchar(500) NOT NULL");
        await queryRunner.query("CREATE UNIQUE INDEX `REL_44e860ff060b678c12418f741e` ON `timeline_photo`(`mediaId`)");
        await queryRunner.query("ALTER TABLE `timeline_photo` ADD CONSTRAINT `FK_44e860ff060b678c12418f741ee` FOREIGN KEY (`mediaId`) REFERENCES `media`(`id`)");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `timeline_photo` DROP FOREIGN KEY `FK_44e860ff060b678c12418f741ee`");
        await queryRunner.query("DROP INDEX `REL_44e860ff060b678c12418f741e` ON `timeline_photo`");
        await queryRunner.query("ALTER TABLE `experience` DROP COLUMN `description`");
        await queryRunner.query("ALTER TABLE `experience` ADD `description` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `timeline_photo` DROP INDEX `IDX_44e860ff060b678c12418f741e`");
        await queryRunner.query("ALTER TABLE `timeline_photo` CHANGE `mediaId` `mediaId` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `verified`");
        await queryRunner.query("ALTER TABLE `notification` DROP COLUMN `hasBeenRead`");
        await queryRunner.query("ALTER TABLE `notification` DROP COLUMN `data`");
        await queryRunner.query("ALTER TABLE `notification` DROP COLUMN `type`");
        await queryRunner.query("ALTER TABLE `like` ADD `userId` varchar(255) NULL");
        await queryRunner.query("ALTER TABLE `timeline_photo` CHANGE `mediaId` `url` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `like` ADD CONSTRAINT `FK_e8fb739f08d47955a39850fac23` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

}
