import {Request, Response, NextFunction} from "express"
import SubApp from "../subapp/SubApp"

export default class HttpRootApp extends SubApp {

    private getRoot(req: Request, res: Response) {
        res.send("<h2>Hello world!</h2>")
    }

    routing(): void {
        this.app.get("/", this.getRoot)
        this.app.use(this.error500)
        this.app.use(this.error404)
    }

    error500(err: Error, request: Request, response: Response, next: NextFunction) {
        console.log(err.stack)
        response.status(500).send("Internal server error")
    }

    error404(_req: Request, res: Response, next: NextFunction) {
        res.status(404).send("Not found")
    }
}

