import {Request, Response, NextFunction} from "express"
import SubApp from "../subapp/SubApp"
import {getConnection} from "typeorm"
import {User} from "../entity/user"
import SubAppErrorHandler from "../subapp/ErrorHandler";

export default class RestApp extends SubApp {
    private async getUsers(req: Request, res: Response) {
        let users = await getConnection().manager.find(User);
        res.json({"users": users});
    }

    routing(): SubApp {
        this.express.get("/users", this.getUsers)
        return this
    }
}

export class RestErrorHandler extends SubAppErrorHandler {
    notFoundHandler(req: Request, res: Response, next: NextFunction): void {
        res.status(404).json({
            error: "Resource not found",
            timestamp: Date.now(),
            code: 404
        })
    }

    exceptionHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
        console.log(err)
        res.status(500).json({
            error: "Internal server error",
            timestamp: Date.now(),
            code: 500
        })
    }
}
