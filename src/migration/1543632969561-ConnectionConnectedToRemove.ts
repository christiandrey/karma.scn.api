import {MigrationInterface, QueryRunner} from "typeorm";

export class ConnectionConnectedToRemove1543632969561 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `connection` DROP FOREIGN KEY `FK_9c8dcb891f6b5e2599bf48c0b6d`");
        await queryRunner.query("DROP INDEX `REL_9c8dcb891f6b5e2599bf48c0b6` ON `connection`");
        await queryRunner.query("ALTER TABLE `connection` DROP COLUMN `connectedToId`");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `connection` ADD `connectedToId` varchar(255) NULL");
        await queryRunner.query("CREATE UNIQUE INDEX `REL_9c8dcb891f6b5e2599bf48c0b6` ON `connection`(`connectedToId`)");
        await queryRunner.query("ALTER TABLE `connection` ADD CONSTRAINT `FK_9c8dcb891f6b5e2599bf48c0b6d` FOREIGN KEY (`connectedToId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

}
