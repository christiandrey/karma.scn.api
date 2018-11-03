import { Certificate } from "../entities/Certificate";
import { MapMedia } from "./mapMedia";

export namespace MapCertificate {
    export function inAllControllers(certificate: Certificate): Certificate {
        const { id, issuer, certificateNumber, dateOfIssue, issuerLogoUrl, media } = certificate;
        return {
            id, issuer, certificateNumber, dateOfIssue, issuerLogoUrl,
            media: MapMedia.inAllControllers(media)
        } as Certificate;
    }
}