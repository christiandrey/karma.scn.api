import { MigrationInterface, QueryRunner } from "typeorm";

export class AddContentSection1553404634817 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.query(
			"CREATE TABLE `content_section` (`id` varchar(36) NOT NULL, `createdDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `modifiedDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `content` longtext NOT NULL, `note` longtext NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB"
		);
	}

	public async down(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.query("DROP TABLE `content_section`");
	}
}
