import {MigrationInterface, QueryRunner} from "typeorm";

export class DefaultValueForBackgroundCheck1540875946644 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `view` DROP FOREIGN KEY `FK_c6af9853ff6a60d2e80dd8b3af9`");
        await queryRunner.query("ALTER TABLE `view` DROP FOREIGN KEY `FK_81b9a8421ae190ecf67ba044869`");
        await queryRunner.query("DROP INDEX `REL_81b9a8421ae190ecf67ba04486` ON `view`");
        await queryRunner.query("ALTER TABLE `view` DROP COLUMN `userId`");
        await queryRunner.query("ALTER TABLE `view` DROP COLUMN `viewedById`");
        await queryRunner.query("ALTER TABLE `company` CHANGE `backgroundCheck` `backgroundCheck` tinyint NOT NULL DEFAULT 1");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `company` CHANGE `backgroundCheck` `backgroundCheck` tinyint NOT NULL");
        await queryRunner.query("ALTER TABLE `view` ADD `viewedById` varchar(255) NULL");
        await queryRunner.query("ALTER TABLE `view` ADD `userId` varchar(255) NULL");
        await queryRunner.query("CREATE UNIQUE INDEX `REL_81b9a8421ae190ecf67ba04486` ON `view`(`viewedById`)");
        await queryRunner.query("ALTER TABLE `view` ADD CONSTRAINT `FK_81b9a8421ae190ecf67ba044869` FOREIGN KEY (`viewedById`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `view` ADD CONSTRAINT `FK_c6af9853ff6a60d2e80dd8b3af9` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

}
