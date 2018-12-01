import {MigrationInterface, QueryRunner} from "typeorm";

export class ConnectionConnectedToAdd1543632986490 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `connection` ADD `connectedToId` varchar(255) NULL");
        await queryRunner.query("ALTER TABLE `connection` ADD CONSTRAINT `FK_9c8dcb891f6b5e2599bf48c0b6d` FOREIGN KEY (`connectedToId`) REFERENCES `user`(`id`)");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `connection` DROP FOREIGN KEY `FK_9c8dcb891f6b5e2599bf48c0b6d`");
        await queryRunner.query("ALTER TABLE `connection` DROP COLUMN `connectedToId`");
    }

}
