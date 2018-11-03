import {MigrationInterface, QueryRunner} from "typeorm";

export class AddBody1540933674293 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `article` ADD `body` longtext NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `article` DROP COLUMN `body`");
    }

}
