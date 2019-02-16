import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

export class MakeLogMessageNullable1550305289479 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.changeColumn(
			"log",
			"message",
			new TableColumn({
				name: "message",
				type: "longtext",
				isNullable: true
			})
		);
	}

	public async down(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.changeColumn(
			"log",
			"message",
			new TableColumn({
				name: "message",
				type: "longtext",
				isNullable: false
			})
		);
	}
}
