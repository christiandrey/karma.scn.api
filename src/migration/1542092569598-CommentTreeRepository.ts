import {MigrationInterface, QueryRunner} from "typeorm";

export class CommentTreeRepository1542092569598 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `comment_closure` (`id_ancestor` varchar(255) NOT NULL, `id_descendant` varchar(255) NOT NULL, PRIMARY KEY (`id_ancestor`, `id_descendant`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `comment_closure` ADD CONSTRAINT `FK_cbfcbcc9274de7f5608b8ae23d9` FOREIGN KEY (`id_ancestor`) REFERENCES `comment`(`id`)");
        await queryRunner.query("ALTER TABLE `comment_closure` ADD CONSTRAINT `FK_aa8fb74dcdb101a8d80cb2256de` FOREIGN KEY (`id_descendant`) REFERENCES `comment`(`id`)");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `comment_closure` DROP FOREIGN KEY `FK_aa8fb74dcdb101a8d80cb2256de`");
        await queryRunner.query("ALTER TABLE `comment_closure` DROP FOREIGN KEY `FK_cbfcbcc9274de7f5608b8ae23d9`");
        await queryRunner.query("DROP TABLE `comment_closure`");
    }

}
