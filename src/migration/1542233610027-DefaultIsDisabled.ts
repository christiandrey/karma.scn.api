import {MigrationInterface, QueryRunner} from "typeorm";

export class DefaultIsDisabled1542233610027 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `timeline_photo` CHANGE `isDisabled` `isDisabled` tinyint NOT NULL DEFAULT 0");
        await queryRunner.query("ALTER TABLE `timeline_update` CHANGE `isDisabled` `isDisabled` tinyint NOT NULL DEFAULT 0");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `timeline_update` CHANGE `isDisabled` `isDisabled` tinyint NOT NULL");
        await queryRunner.query("ALTER TABLE `timeline_photo` CHANGE `isDisabled` `isDisabled` tinyint NOT NULL");
    }

}
