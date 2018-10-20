import { Entity, Column } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { IsEmail, Length } from "class-validator";
import { BusinessRegistrationTypeEnum } from "../enums/BusinessRegistrationTypeEnum";

@Entity()
export class Company extends BaseEntity {
    name: string;
    postalBox: number;
    phone: string;
    website: string;
    email: string;
    backgroundCheck: boolean;
    NoBackgroundCheckReason: string;
    registrationType: BusinessRegistrationTypeEnum;
    registrationNumber: string;
    registrationDate: Date;
    taxpayersIdentificationNumber: number;

}