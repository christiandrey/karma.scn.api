import { Connection } from "../entities/Connection";
import { User } from "../entities/User";

export namespace MapConnection {

    export function inConnectionControllerConnectAsync(connection: Connection): Connection {
        const { id, user, connectedTo, status } = connection;

        return {
            id, status,
            user: new User({
                id: user.id
            }),
            connectedTo: new User({
                id: connectedTo.id,
                firstName: connectedTo.firstName,
                lastName: connectedTo.lastName
            })
        } as Connection;
    }

    export function inConnectionControllerAcceptConnectionRequestAsync(connection: Connection): Connection {
        const { id, user, connectedTo, status } = connection;

        return {
            id, status,
            user: new User({
                id: user.id
            }),
            connectedTo: new User({
                id: connectedTo.id
            })
        } as Connection;
    }

    export function inConnectionControllerDeclineConnectionRequestAsync(connection: Connection): Connection {
        const { id, user, connectedTo, status } = connection;

        return {
            id, status,
            user: new User({
                id: user.id
            }),
            connectedTo: new User({
                id: connectedTo.id
            })
        } as Connection;
    }
}