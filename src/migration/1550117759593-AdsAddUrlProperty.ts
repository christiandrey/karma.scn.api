import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AdsAddUrlProperty1550117759593 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.addColumn(
			"ad",
			new TableColumn({
				name: "url",
				type: "varchar",
				isNullable: true
			})
		);
	}

	public async down(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.dropColumn("ad", "url");
	}
}
