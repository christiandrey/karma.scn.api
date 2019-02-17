import { Country } from "../entities/Country";

export namespace MapCountry {
	export function inAllControllers(country: Country) {
		const { id, name, states } = country;
		return {
			id,
			name,
			states
		};
	}
}
