import { Address } from "../entities/Address";
import { Country } from "../entities/Country";

export namespace MapAddress {

    export function inAllControllers(address: Address): Address {
        const { id, city, state, country } = address;
        return {
            id, city, state,
            country: !!address.country ? new Country({
                id: country.id,
                name: country.name
            }) : null
        } as Address;
    }
}