import {MigrationInterface, QueryRunner} from "typeorm";

export class AddSocketRecordsEntity1540782938660 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP INDEX `IDX_44e860ff060b678c12418f741e` ON `timeline_photo`");
        await queryRunner.query("CREATE TABLE `socket_record` (`id` varchar(255) NOT NULL, `createdDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `modifiedDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `socketId` varchar(255) NOT NULL, `userId` varchar(255) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `timeline_photo` DROP FOREIGN KEY `FK_44e860ff060b678c12418f741ee`");
        await queryRunner.query("ALTER TABLE `timeline_photo` ADD UNIQUE INDEX `IDX_44e860ff060b678c12418f741e` (`mediaId`)");
        await queryRunner.query("ALTER TABLE `timeline_photo` ADD CONSTRAINT `FK_44e860ff060b678c12418f741ee` FOREIGN KEY (`mediaId`) REFERENCES `media`(`id`)");
        await queryRunner.query("ALTER TABLE `socket_record` ADD CONSTRAINT `FK_88ddda880183535287c6ac3ed53` FOREIGN KEY (`userId`) REFERENCES `user`(`id`)");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `socket_record` DROP FOREIGN KEY `FK_88ddda880183535287c6ac3ed53`");
        await queryRunner.query("ALTER TABLE `timeline_photo` DROP FOREIGN KEY `FK_44e860ff060b678c12418f741ee`");
        await queryRunner.query("ALTER TABLE `timeline_photo` DROP INDEX `IDX_44e860ff060b678c12418f741e`");
        await queryRunner.query("ALTER TABLE `timeline_photo` ADD CONSTRAINT `FK_44e860ff060b678c12418f741ee` FOREIGN KEY (`mediaId`) REFERENCES `media`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("DROP TABLE `socket_record`");
        await queryRunner.query("CREATE UNIQUE INDEX `IDX_44e860ff060b678c12418f741e` ON `timeline_photo`(`mediaId`)");
    }

}
