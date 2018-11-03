import { NextFunction, Request, Response } from "express";
import { User } from "../entities/User";
import { getRepository } from "typeorm";
import { Methods } from "../shared/methods";
import { Certificate } from "../entities/Certificate";
import { validate } from "class-validator";
import { FormResponse } from "../dto/classes/FormResponse";
import { IFormResponse } from "../dto/interfaces/IFormResponse";
import { UserService } from "../services/userService";
import { Media } from "../entities/Media";
import { MapCertificate } from "../mapping/mapCertificate";

export class CertificatesController {

    private certificateRepository = getRepository(Certificate);

    async createAsync(req: Request, resp: Response, next: NextFunction) {
        const certificate = new Certificate(req.body);

        // ------------------------------------------------------------------------
        // Validate the data
        // ------------------------------------------------------------------------

        const validationResult = await validate(certificate);
        if (validationResult.length > 0) {
            const invalidResponse = new FormResponse({
                isValid: false,
                errors: validationResult.map(e => e.constraints)
            } as IFormResponse);
            return Methods.getJsonResponse(invalidResponse, "Certificate data provided was not valid", false);
        }

        // ------------------------------------------------------------------------
        // Create New Entity
        // ------------------------------------------------------------------------

        const { issuer, certificateNumber, dateOfIssue, issuerLogoUrl, media } = certificate;

        const certificateToCreate = new Certificate({
            issuer, certificateNumber, dateOfIssue, issuerLogoUrl,
            media: new Media({ id: media.id }),
            user: new User({ id: UserService.getAuthenticatedUserId(req) })
        });

        const createdCertificate = await this.certificateRepository.save(certificateToCreate);
        const validResponse = new FormResponse<Certificate>({
            isValid: true,
            target: MapCertificate.inAllControllers(createdCertificate)
        });
        return Methods.getJsonResponse(validResponse);
    }
}