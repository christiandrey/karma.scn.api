import { Country } from "../entities/Country";

export namespace MapCountry {
	export function inAllControllers(country: Country) {
		const { id, name } = country;
		return {
			id,
			name
		};
	}
}
