import { getRepository, Brackets } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { Methods } from "../shared/methods";
import { validate } from "class-validator";
import { User } from "../entities/User";
import { UserService } from "../services/userService";
import { Connection } from "../entities/Connection";
import { ConnectionStatusEnum } from "../enums/ConnectionStatusEnum";
import { MapConnection } from "../mapping/mapConnection";
import { Notification } from "../entities/Notification";
import { NotificationTypeEnum } from "../enums/NotificationTypeEnum";
import { NotificationService } from "../services/notificationService";
import { UserTypeEnum } from "../enums/UserTypeEnum";
import { LogTypeEnum } from "../enums/LogTypeEnum";
import { LogService } from "../services/logService";

export class ConnectionsController {
	private connectionRepository = getRepository(Connection);
	private userRepository = getRepository(User);

	async getConnectionsCountAsync(req: Request, resp: Response, next: NextFunction) {
		const id = UserService.getAuthenticatedUserId(req);

		const connectionCount = await this.connectionRepository
			.createQueryBuilder("connection")
			.where("connection.status = :status", { status: ConnectionStatusEnum.Accepted })
			.andWhere(
				new Brackets(qb => {
					qb.where("connection.user.id = :userId", { userId: id }).orWhere("connection.connectedTo.id = :connectedToUserId", { connectedToUserId: id });
				})
			)
			.getCount();

		return Methods.getJsonResponse({ count: connectionCount }, `${connectionCount} connections found`);
	}

	async getConnectionsAsync(req: Request, resp: Response, next: NextFunction) {
		const id = UserService.getAuthenticatedUserId(req);

		const connections = await this.connectionRepository
			.createQueryBuilder("connection")
			.leftJoinAndSelect("connection.user", "user")
			.leftJoinAndSelect("user.company", "userCompany")
			.leftJoinAndSelect("userCompany.address", "userCompanyAddress")
			.leftJoinAndSelect("userCompanyAddress.country", "userCompanyAddressCountry")
			.leftJoinAndSelect("user.profilePhoto", "userProfilePhoto")
			.leftJoinAndSelect("user.experiences", "userExperiences")
			.leftJoinAndSelect("user.address", "userAddress")
			.leftJoinAndSelect("userAddress.country", "userAddressCountry")
			.leftJoinAndSelect("connection.connectedTo", "connectedTo")
			.leftJoinAndSelect("connectedTo.company", "connectedToCompany")
			.leftJoinAndSelect("connectedToCompany.address", "connectedToCompanyAddress")
			.leftJoinAndSelect("connectedToCompanyAddress.country", "connectedToCompanyAddressCountry")
			.leftJoinAndSelect("connectedTo.profilePhoto", "connectedToProfilePhoto")
			.leftJoinAndSelect("connectedTo.experiences", "connectedToExperiences")
			.leftJoinAndSelect("connectedTo.address", "connectedToAddress")
			.leftJoinAndSelect("connectedToAddress.country", "connectedToAddressCountry")
			.where("connection.status = :status", { status: ConnectionStatusEnum.Accepted })
			.where("connection.status = :status", { status: ConnectionStatusEnum.Pending })
			.where("user.id = :userId", { userId: id })
			.orWhere("connectedTo.id = :connectedToUserId", { connectedToUserId: id })
			.orderBy("connection.createdDate", "DESC")
			.getMany();

		const response = connections.map(x => MapConnection.inConnectionControllerGetConnectionsAsync(x));
		return Methods.getJsonResponse(response, `${connections.length} connections found`);
	}

	async getConnectionsByUserUrlTokenAsync(req: Request, resp: Response, next: NextFunction) {
		const urlToken = req.params.urlToken as string;
		const userRepository = getRepository(User);

		const user = await userRepository.findOne({ urlToken });

		if (!user) {
			Methods.sendErrorResponse(resp, 404, "User was not found");
		}
		const id = user.id;
		const connections = await this.connectionRepository
			.createQueryBuilder("connection")
			.leftJoinAndSelect("connection.user", "user")
			.leftJoinAndSelect("user.company", "userCompany")
			.leftJoinAndSelect("userCompany.address", "userCompanyAddress")
			.leftJoinAndSelect("userCompanyAddress.country", "userCompanyAddressCountry")
			.leftJoinAndSelect("user.profilePhoto", "userProfilePhoto")
			.leftJoinAndSelect("user.experiences", "userExperiences")
			.leftJoinAndSelect("user.address", "userAddress")
			.leftJoinAndSelect("userAddress.country", "userAddressCountry")
			.leftJoinAndSelect("connection.connectedTo", "connectedTo")
			.leftJoinAndSelect("connectedTo.company", "connectedToCompany")
			.leftJoinAndSelect("connectedToCompany.address", "connectedToCompanyAddress")
			.leftJoinAndSelect("connectedToCompanyAddress.country", "connectedToCompanyAddressCountry")
			.leftJoinAndSelect("connectedTo.profilePhoto", "connectedToProfilePhoto")
			.leftJoinAndSelect("connectedTo.experiences", "connectedToExperiences")
			.leftJoinAndSelect("connectedTo.address", "connectedToAddress")
			.leftJoinAndSelect("connectedToAddress.country", "connectedToAddressCountry")
			.where("connection.status = :status", { status: ConnectionStatusEnum.Accepted })
			.where("user.id = :userId", { userId: id })
			.orWhere("connectedTo.id = :connectedToUserId", { connectedToUserId: id })
			.orderBy("connection.createdDate", "DESC")
			.getMany();

		const response = connections.map(x => MapConnection.inConnectionControllerGetConnectionsAsync(x));
		return Methods.getJsonResponse(response, `${connections.length} connections found`);
	}

	async getConnectionRequestsAsync(req: Request, resp: Response, next: NextFunction) {
		const authUserId = UserService.getAuthenticatedUserId(req);

		const connections = await this.connectionRepository
			.createQueryBuilder("connection")
			.leftJoinAndSelect("connection.user", "user")
			.leftJoinAndSelect("user.company", "userCompany")
			.leftJoinAndSelect("userCompany.address", "userCompanyAddress")
			.leftJoinAndSelect("userCompanyAddress.country", "userCompanyAddressCountry")
			.leftJoinAndSelect("user.profilePhoto", "userProfilePhoto")
			.leftJoinAndSelect("user.experiences", "userExperiences")
			.leftJoinAndSelect("user.address", "userAddress")
			.leftJoinAndSelect("userAddress.country", "userAddressCountry")
			.leftJoinAndSelect("connection.connectedTo", "connectedTo")
			.leftJoinAndSelect("connectedTo.company", "connectedToCompany")
			.leftJoinAndSelect("connectedToCompany.address", "connectedToCompanyAddress")
			.leftJoinAndSelect("connectedToCompanyAddress.country", "connectedToCompanyAddressCountry")
			.leftJoinAndSelect("connectedTo.profilePhoto", "connectedToProfilePhoto")
			.leftJoinAndSelect("connectedTo.experiences", "connectedToExperiences")
			.leftJoinAndSelect("connectedTo.address", "connectedToAddress")
			.leftJoinAndSelect("connectedToAddress.country", "connectedToAddressCountry")
			.where("connectedTo.id = :id", { id: authUserId })
			.andWhere("connection.status = :status", { status: ConnectionStatusEnum.Pending })
			.getMany();

		const response = connections.map(x => MapConnection.inConnectionControllerGetConnectionsAsync(x));
		return Methods.getJsonResponse(response, `${connections.length} requests found`);
	}

	async connectAsync(req: Request, resp: Response, next: NextFunction) {
		const connection = new Connection(req.body);

		// ------------------------------------------------------------------------
		// Validate the data
		// ------------------------------------------------------------------------

		const validationResult = await validate(connection);
		if (validationResult.length > 0) {
			Methods.sendErrorResponse(resp, 400);
		}

		const authUser = await UserService.getAuthenticatedUserAsync(req);
		const dbConnection = await this.connectionRepository
			.createQueryBuilder("connection")
			.leftJoinAndSelect("connection.user", "user")
			.leftJoinAndSelect("connection.connectedTo", "connectedTo")
			.where("user.id = :userId", { userId: authUser.id })
			.andWhere("connectedTo.id = :connectedToUserId", { connectedToUserId: connection.connectedTo.id })
			.orWhere("user.id = :userId", { userId: connection.connectedTo.id })
			.andWhere("connectedTo.id = :connectedToUserId", { connectedToUserId: authUser.id })
			.getOne();

		if (!!dbConnection) {
			Methods.sendErrorResponse(resp, 400, "A connection already exists");
		}

		const connectionToCreate = new Connection({
			connectedTo: new User({ id: connection.connectedTo.id }),
			user: new User({ id: authUser.id }),
			status: ConnectionStatusEnum.Pending
		});

		const createdConnection = await this.connectionRepository.save(connectionToCreate);
		createdConnection.connectedTo = await this.userRepository.findOne(createdConnection.connectedTo.id);

		// ------------------------------------------------------------------------
		// Send notification to connectedTo user
		// ------------------------------------------------------------------------
		const notification = new Notification({
			user: new User({ id: createdConnection.connectedTo.id }),
			content:
				authUser.type === UserTypeEnum.Member
					? `${authUser.firstName} ${authUser.lastName} has just requested to connect with you.`
					: `${authUser.company.name} has just requested to connect with you.`,
			type: NotificationTypeEnum.ConnectionRequest,
			data: JSON.stringify({
				id: createdConnection.id
			}),
			hasBeenRead: false
		} as Notification);

		try {
			await NotificationService.sendNotificationAsync(req, notification);
		} catch (error) {
			await LogService.log(req, "An error occured while sending a connection request notification.", error.toString(), LogTypeEnum.Exception);
		}

		const response = MapConnection.inConnectionControllerConnectAsync(createdConnection);

		return Methods.getJsonResponse(response, "Connection request has been sent");
	}

	async acceptConnectionRequestAsync(req: Request, resp: Response, next: NextFunction) {
		const id = req.params.id as string;
		const connection = await this.connectionRepository.findOne(id);
		const authUserId = UserService.getAuthenticatedUserId(req);

		if (!connection) {
			Methods.sendErrorResponse(resp, 404, "Connection request was not found");
			return;
		}

		if (connection.status !== ConnectionStatusEnum.Pending) {
			Methods.sendErrorResponse(resp, 400, "Connection request has already been attended to");
			return;
		}

		if (connection.connectedTo.id !== authUserId) {
			Methods.sendErrorResponse(resp, 400);
			return;
		}

		connection.status = ConnectionStatusEnum.Accepted;

		const acceptedConnection = await this.connectionRepository.save(connection);
		acceptedConnection.connectedTo = await this.userRepository.findOne(acceptedConnection.connectedTo.id);

		// ------------------------------------------------------------------------
		// Send notification to connectedTo user
		// ------------------------------------------------------------------------
		const notification = new Notification({
			user: new User({ id: acceptedConnection.user.id }),
			content:
				acceptedConnection.connectedTo.type === UserTypeEnum.Member
					? `${acceptedConnection.connectedTo.firstName} ${acceptedConnection.connectedTo.lastName} has accepted your connection request!`
					: `${acceptedConnection.connectedTo.company} has accepted your connection request!`,
			type: NotificationTypeEnum.ConnectionResult,
			data: JSON.stringify({
				type: acceptedConnection.connectedTo.type,
				urlToken: acceptedConnection.connectedTo.urlToken
			}),
			hasBeenRead: false
		} as Notification);

		try {
			await NotificationService.sendNotificationAsync(req, notification);
		} catch (error) {
			await LogService.log(req, "An error occured while sending a connection acceptance notification.", error.toString(), LogTypeEnum.Exception);
		}

		const response = MapConnection.inConnectionControllerAcceptConnectionRequestAsync(acceptedConnection);

		return Methods.getJsonResponse(response, "Connection request was successfully accepted");
	}

	async declineConnectionRequestAsync(req: Request, resp: Response, next: NextFunction) {
		const id = req.params.id as string;
		const connection = await this.connectionRepository.findOne(id);
		const authUserId = UserService.getAuthenticatedUserId(req);

		if (!connection) {
			Methods.sendErrorResponse(resp, 404, "Connection request was not found");
			return;
		}

		if (connection.status !== ConnectionStatusEnum.Pending) {
			Methods.sendErrorResponse(resp, 400, "Connection request has already been attended to");
			return;
		}

		if (connection.connectedTo.id !== authUserId) {
			Methods.sendErrorResponse(resp, 400);
			return;
		}

		connection.status = ConnectionStatusEnum.Declined;

		const declinedConnection = await this.connectionRepository.save(connection);
		const response = MapConnection.inConnectionControllerAcceptConnectionRequestAsync(declinedConnection);

		return Methods.getJsonResponse(response, "Connection request has been declined");
	}
}
