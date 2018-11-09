import {MigrationInterface, QueryRunner} from "typeorm";

export class ManyToManySkillsRelation1541738119468 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `user` DROP FOREIGN KEY `FK_0e51e612eb9ed2fa5ac4f44c7e1`");
        await queryRunner.query("CREATE TABLE `user_skills_skill` (`userId` varchar(255) NOT NULL, `skillId` varchar(255) NOT NULL, PRIMARY KEY (`userId`, `skillId`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `skillsId`");
        await queryRunner.query("ALTER TABLE `user_skills_skill` ADD CONSTRAINT `FK_b5cce6242aae7bce521a76a3be1` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE");
        await queryRunner.query("ALTER TABLE `user_skills_skill` ADD CONSTRAINT `FK_c7e4f0b8d58a56f71dd097d7546` FOREIGN KEY (`skillId`) REFERENCES `skill`(`id`) ON DELETE CASCADE");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `user_skills_skill` DROP FOREIGN KEY `FK_c7e4f0b8d58a56f71dd097d7546`");
        await queryRunner.query("ALTER TABLE `user_skills_skill` DROP FOREIGN KEY `FK_b5cce6242aae7bce521a76a3be1`");
        await queryRunner.query("ALTER TABLE `user` ADD `skillsId` varchar(255) NULL");
        await queryRunner.query("DROP TABLE `user_skills_skill`");
        await queryRunner.query("ALTER TABLE `user` ADD CONSTRAINT `FK_0e51e612eb9ed2fa5ac4f44c7e1` FOREIGN KEY (`skillsId`) REFERENCES `skill`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

}
