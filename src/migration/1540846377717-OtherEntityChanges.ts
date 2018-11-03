import {MigrationInterface, QueryRunner} from "typeorm";

export class OtherEntityChanges1540846377717 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP INDEX `IDX_44e860ff060b678c12418f741e` ON `timeline_photo`");
        await queryRunner.query("ALTER TABLE `timeline_photo` DROP FOREIGN KEY `FK_44e860ff060b678c12418f741ee`");
        await queryRunner.query("ALTER TABLE `timeline_photo` ADD UNIQUE INDEX `IDX_44e860ff060b678c12418f741e` (`mediaId`)");
        await queryRunner.query("ALTER TABLE `timeline_photo` ADD CONSTRAINT `FK_44e860ff060b678c12418f741ee` FOREIGN KEY (`mediaId`) REFERENCES `media`(`id`)");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `timeline_photo` DROP FOREIGN KEY `FK_44e860ff060b678c12418f741ee`");
        await queryRunner.query("ALTER TABLE `timeline_photo` DROP INDEX `IDX_44e860ff060b678c12418f741e`");
        await queryRunner.query("ALTER TABLE `timeline_photo` ADD CONSTRAINT `FK_44e860ff060b678c12418f741ee` FOREIGN KEY (`mediaId`) REFERENCES `media`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("CREATE UNIQUE INDEX `IDX_44e860ff060b678c12418f741e` ON `timeline_photo`(`mediaId`)");
    }

}
