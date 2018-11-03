import { IsEmail, MinLength, IsAlpha, IsNotEmpty, IsDate, IsDateString } from "class-validator";
import { UserTypeEnum } from "../../enums/UserTypeEnum";
import { Address } from "../../entities/Address";

export class RegisterDetails {
    @IsAlpha()
    firstName: string;

    @IsAlpha()
    lastName: string;

    @IsDateString()
    dateOfBirth: string;

    @IsNotEmpty()
    address: Address;

    type: UserTypeEnum;

    @IsNotEmpty()
    phone: string;

    @IsEmail()
    email: string;

    @MinLength(3, {
        message: "Password has to be a minimum of 3 characters"
    })
    password: string;

    constructor(dto?: RegisterDetails | any) {

        dto = dto || {} as RegisterDetails;

        this.firstName = dto.firstName;
        this.lastName = dto.lastName;
        this.dateOfBirth = dto.dateOfBirth;
        this.address = !!dto.address ? new Address(dto.address) : null;
        this.type = dto.type;
        this.phone = dto.phone;
        this.email = dto.email;
        this.password = dto.password;
    }
}