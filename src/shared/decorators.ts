import { registerDecorator, ValidationOptions, ValidationArguments } from "class-validator";

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
