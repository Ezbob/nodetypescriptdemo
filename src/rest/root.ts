import {Request, Response, NextFunction} from "express"
import SubApp from "../subapp/SubApp"

export default class RestApp extends SubApp {

    private getUser(req: Request, res: Response) {
        res.json({"Key": [23, 34]});
    }


    routing(): void {
        this.app.get("/", this.getUser)
        this.app.use(this.error500)
        this.app.use(this.error404)
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
