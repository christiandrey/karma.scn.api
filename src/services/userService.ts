import * as JWT from "jsonwebtoken";
import { User } from "../entities/User";
import { Constants } from "../shared/constants";
import { Request } from "express";
import { getRepository } from "typeorm";
import { UserTypeEnum } from "../enums/UserTypeEnum";

export namespace UserService {

    // -------------------------------------------------------------------------------------------------
    /** Get the Id of the authenticated User */
    export function getAuthenticatedUserId(request: Request): string {
        const authenticatedUser = request.user as User;
        return authenticatedUser.id;
    }

    // -------------------------------------------------------------------------------------------------
    /** Get the Type of the authenticated User */
    export function getAuthenticatedUserType(request: Request): UserTypeEnum {
        const authenticatedUser = request.user as User;
        return authenticatedUser.type;
    }

    // -------------------------------------------------------------------------------------------------
    /** Get the authenticated User asynchronously */
    export async function getAuthenticatedUserAsync(request: Request, cleanPassword: boolean = true): Promise<User> {
        const userRepository = getRepository(User);
        const authenticatedUserId = getAuthenticatedUserId(request);
        const authenticatedUser = await userRepository.findOne({ id: authenticatedUserId });

        if (cleanPassword) {
            authenticatedUser.password = null;
        }

        return authenticatedUser;
    }

    // -------------------------------------------------------------------------------------------------
    /** Get a signed token for a specified user */
    export function getUserToken(user: User): string {
        return JWT.sign({
            id: user.id,
            email: user.email
        }, Constants.cipherKey, {
                expiresIn: "7 days"
            });
    }
}