import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

export abstract class BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @CreateDateColumn()
    createdDate: Date;

    @UpdateDateColumn()
    modifiedDate: Date;

    constructor(dto?: BaseEntity) {
        dto = dto || {} as BaseEntity;

        this.id = dto.id;
        this.createdDate = dto.createdDate;
        this.modifiedDate = dto.modifiedDate;
    }
}