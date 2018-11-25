import { registerDecorator, ValidationOptions, ValidationArguments, IsNotEmpty, Validator } from "class-validator";
import { UserTypeEnum } from "../enums/UserTypeEnum";

export function IsNotWhitespace(validationOptions?: ValidationOptions) {
	return function(object: Object, propertyName: string) {
		registerDecorator({
			name: "isNotWhitespace",
			target: object.constructor,
			propertyName: propertyName,
			constraints: [],
			options: validationOptions,
			validator: {
				validate(value: any, args: ValidationArguments) {
					return typeof value === "string" && value.replace(/\s|\s+|\n/gm, "").length > 0;
				}
			}
		});
	};
}

export function IsNotEmptyForMember(property: string, validationOptions?: ValidationOptions) {
	return function(object: Object, propertyName: string) {
		registerDecorator({
			name: "isNotEmptyForMember",
			target: object.constructor,
			propertyName: propertyName,
			constraints: [property],
			options: validationOptions,
			validator: {
				validate(value: any, args: ValidationArguments) {
					const [relatedPropertyName] = args.constraints;
					const relatedValue = (args.object as any)[relatedPropertyName];
					if (relatedValue === UserTypeEnum.Admin || relatedValue === UserTypeEnum.Vendor) {
						return true;
					} else {
						const validator = new Validator();
						return validator.isNotEmpty(value);
					}
				}
			}
		});
	};
}

export function MaxLengthForMember(property: string, max: number, validationOptions?: ValidationOptions) {
	return function(object: Object, propertyName: string) {
		registerDecorator({
			name: "isNotEmptyForMember",
			target: object.constructor,
			propertyName: propertyName,
			constraints: [property],
			options: validationOptions,
			validator: {
				validate(value: any, args: ValidationArguments) {
					const [relatedPropertyName] = args.constraints;
					const relatedValue = (args.object as any)[relatedPropertyName];
					if (relatedValue === UserTypeEnum.Admin || relatedValue === UserTypeEnum.Vendor) {
						return true;
					} else {
						const validator = new Validator();
						return validator.maxLength(value, max);
					}
				}
			}
		});
	};
}
