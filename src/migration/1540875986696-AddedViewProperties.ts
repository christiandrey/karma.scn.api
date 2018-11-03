import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedViewProperties1540875986696 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `view` ADD `userId` varchar(255) NULL");
        await queryRunner.query("ALTER TABLE `view` ADD `viewedById` varchar(255) NULL");
        await queryRunner.query("ALTER TABLE `view` ADD CONSTRAINT `FK_c6af9853ff6a60d2e80dd8b3af9` FOREIGN KEY (`userId`) REFERENCES `user`(`id`)");
        await queryRunner.query("ALTER TABLE `view` ADD CONSTRAINT `FK_81b9a8421ae190ecf67ba044869` FOREIGN KEY (`viewedById`) REFERENCES `user`(`id`)");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `view` DROP FOREIGN KEY `FK_81b9a8421ae190ecf67ba044869`");
        await queryRunner.query("ALTER TABLE `view` DROP FOREIGN KEY `FK_c6af9853ff6a60d2e80dd8b3af9`");
        await queryRunner.query("ALTER TABLE `view` DROP COLUMN `viewedById`");
        await queryRunner.query("ALTER TABLE `view` DROP COLUMN `userId`");
    }

}
