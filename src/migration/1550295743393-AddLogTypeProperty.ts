import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddLogTypeProperty1550295743393 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.addColumn(
			"log",
			new TableColumn({
				name: "type",
				type: "int",
				isNullable: false
			})
		);
	}

	public async down(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.dropColumn("log", "type");
	}
}
