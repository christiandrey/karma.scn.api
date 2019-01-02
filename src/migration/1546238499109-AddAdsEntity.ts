import {MigrationInterface, QueryRunner} from "typeorm";

export class AddAdsEntity1546238499109 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `ad` (`id` varchar(255) NOT NULL, `createdDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `modifiedDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `clickCount` int NOT NULL DEFAULT 0, `mediaId` varchar(255) NULL, UNIQUE INDEX `REL_df4dc05cfdafa378e678086741` (`mediaId`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `ad` ADD CONSTRAINT `FK_df4dc05cfdafa378e6780867412` FOREIGN KEY (`mediaId`) REFERENCES `media`(`id`)");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `ad` DROP FOREIGN KEY `FK_df4dc05cfdafa378e6780867412`");
        await queryRunner.query("DROP INDEX `REL_df4dc05cfdafa378e678086741` ON `ad`");
        await queryRunner.query("DROP TABLE `ad`");
    }

}
