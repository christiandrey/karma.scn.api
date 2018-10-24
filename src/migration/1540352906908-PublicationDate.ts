import {MigrationInterface, QueryRunner} from "typeorm";

export class PublicationDate1540352906908 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `article` ADD `publicationDate` datetime NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `article` DROP COLUMN `publicationDate`");
    }

}
