import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLogEntity1550294998541 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.query(
			"CREATE TABLE `log` (`id` varchar(36) NOT NULL, `createdDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `modifiedDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `title` varchar(255) NOT NULL, `message` longtext NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB"
		);
	}

	public async down(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.query("DROP TABLE `log`");
	}
}
