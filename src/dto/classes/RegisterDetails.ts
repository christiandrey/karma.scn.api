import { IsEmail, MinLength, IsAlpha, IsNotEmpty } from "class-validator";
import { UserTypeEnum } from "../../enums/UserTypeEnum";

export class RegisterDetails {
    @IsAlpha()
    firstName: string;

    @IsAlpha()
    lastName: string;

    type: UserTypeEnum;

    @IsNotEmpty()
    phone: string;

    @IsEmail()
    email: string;

    @MinLength(3, {
        message: "Password has to be a minimum of 3 characters"
    })
    password: string;
}