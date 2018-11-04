import {MigrationInterface, QueryRunner} from "typeorm";

export class DefaultCountry1541297242566 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `country` ADD `isDefault` tinyint NOT NULL DEFAULT 0");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `country` DROP COLUMN `isDefault`");
    }

}
