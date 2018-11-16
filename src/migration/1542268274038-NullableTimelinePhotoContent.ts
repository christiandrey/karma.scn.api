import {MigrationInterface, QueryRunner} from "typeorm";

export class NullableTimelinePhotoContent1542268274038 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `timeline_photo` CHANGE `caption` `caption` longtext NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `timeline_photo` CHANGE `caption` `caption` longtext NOT NULL");
    }

}
