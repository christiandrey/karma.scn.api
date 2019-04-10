import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddContentSectionTitle1553406851137 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.addColumn(
			"content_section",
			new TableColumn({
				name: "title",
				type: "varchar",
				isNullable: false
			})
		);
	}

	public async down(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.dropColumn("content_section", "title");
	}
}
