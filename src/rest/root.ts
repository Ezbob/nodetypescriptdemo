import {Request, Response, NextFunction} from "express"
import SubApp from "../subapp/SubApp"
import {getConnection} from "typeorm"
import {User} from "../entity/user"

export default class RestApp extends SubApp {

    private async getUser(req: Request, res: Response) {
        let users = await getConnection().manager.find(User);
        res.json({"users": users});
    }


    routing(): SubApp {
        this.express.get("/", this.getUser)
        this.errorHandling()
        return this
    }

    error500(err: Error, req: Request, res: Response, next: NextFunction): void {
        console.log(err)
        res.status(500).json({
            error: "Internal server error",
            timestamp: Date.now(),
            code: 500
        })
    }

    error404(req: Request, res: Response, next: NextFunction) {
        res.status(404).json({
            error: "Resource not found",
            timestamp: Date.now(),
            code: 404
        })
    }
}
