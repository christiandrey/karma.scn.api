import { User } from "../entities/User";

export namespace MapUser {

    export function inSearchControllerSearchAsync(user: User): User {
        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            urlToken: user.urlToken,
            profilePhoto: !!user.profilePhoto ? {
                id: user.profilePhoto.id,
                url: user.profilePhoto.url
            } : null,
            latestExperience: !!user.latestExperience && user.latestExperience.current ? {
                role: user.latestExperience.role,
                organization: user.latestExperience.organization
            } : null
        } as User;
    }
}