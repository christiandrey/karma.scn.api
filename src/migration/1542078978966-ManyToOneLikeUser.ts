import {MigrationInterface, QueryRunner} from "typeorm";

export class ManyToOneLikeUser1542078978966 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `like` ADD `userId` varchar(255) NULL");
        await queryRunner.query("ALTER TABLE `like` ADD CONSTRAINT `FK_e8fb739f08d47955a39850fac23` FOREIGN KEY (`userId`) REFERENCES `user`(`id`)");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `like` DROP FOREIGN KEY `FK_e8fb739f08d47955a39850fac23`");
        await queryRunner.query("ALTER TABLE `like` DROP COLUMN `userId`");
    }

}
