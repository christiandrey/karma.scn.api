import { getRepository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { Methods } from "../shared/methods";
import { validate } from "class-validator";
import { User } from "../entities/User";
import { UserService } from "../services/userService";
import { Connection } from "../entities/Connection";
import { ConnectionStatusEnum } from "../enums/ConnectionStatusEnum";
import { MapConnection } from "../mapping/mapConnection";

export class ResourcesController {

    private connectionRepository = getRepository(Connection);

    async connectAsync(req: Request, resp: Response, next: NextFunction) {
        const connection = new Connection(req.body);

        // ------------------------------------------------------------------------
        // Validate the data
        // ------------------------------------------------------------------------

        const validationResult = await validate(connection);
        if (validationResult.length > 0) {
            Methods.sendErrorResponse(resp, 400);
        }

        const authUserId = UserService.getAuthenticatedUserId(req);
        const dbConnection = await this.connectionRepository.createQueryBuilder("connection")
            .leftJoinAndSelect("connection.user", "user")
            .leftJoinAndSelect("connection.connectedTo", "connectedTo")
            .where("user.id = :userId", { id: authUserId })
            .andWhere("connectedTo.id = :connectedToUserId", { id: connection.connectedTo.id }).getOne();

        if (!!dbConnection) {
            Methods.sendErrorResponse(resp, 400, "A connection already exists");
        }

        const connectionToCreate = new Connection({
            connectedTo: new User({ id: connection.connectedTo.id }),
            user: new User({ id: authUserId }),
            status: ConnectionStatusEnum.Pending
        });

        const createdConnection = await this.connectionRepository.save(connectionToCreate);

        //TODO: Send Connection request notification to connection.connectedTo user
        const response = MapConnection.inConnectionControllerConnectAsync(createdConnection);

        return Methods.getJsonResponse(response, "Connection request has been sent");
    }

    async acceptConnectionRequestAsync(req: Request, resp: Response, next: NextFunction) {
        const id = req.params.id as string;
        const connection = await this.connectionRepository.findOne(id);

        if (!!connection) {
            Methods.sendErrorResponse(resp, 404, "Connection request was not found");
            return;
        }

        if (connection.status !== ConnectionStatusEnum.Pending) {
            Methods.sendErrorResponse(resp, 400, "Connection request has already been attended to");
            return;
        }

        connection.status = ConnectionStatusEnum.Accepted;

        const acceptedConnection = await this.connectionRepository.save(connection);

        //TODO: Send Notification to connection.user
        const response = MapConnection.inConnectionControllerAcceptConnectionRequestAsync(acceptedConnection);

        return Methods.getJsonResponse(response, "Connection request was successfully accepted");
    }

    async declineCnnectionRequestAsync(req: Request, resp: Response, next: NextFunction) {
        const id = req.params.id as string;
        const connection = await this.connectionRepository.findOne(id);

        if (!!connection) {
            Methods.sendErrorResponse(resp, 404, "Connection request was not found");
            return;
        }

        if (connection.status !== ConnectionStatusEnum.Pending) {
            Methods.sendErrorResponse(resp, 400, "Connection request has already been attended to");
            return;
        }

        connection.status = ConnectionStatusEnum.Declined;

        const declinedConnection = await this.connectionRepository.save(connection);
        const response = MapConnection.inConnectionControllerAcceptConnectionRequestAsync(declinedConnection);

        return Methods.getJsonResponse(response, "Connection request has been declined");
    }
}