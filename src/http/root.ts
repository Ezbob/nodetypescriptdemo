import {Request, Response, NextFunction} from "express"
import SubApp from "../subapp/SubApp"
import SubAppErrorHandler from "../subapp/ErrorHandler"

export default class HttpRootApp extends SubApp {

    private getRoot(req: Request, res: Response) {

        res.send("<h2>Hello world!</h2>")
    }

    routing(): SubApp {
        this.express.get("/", this.getRoot)
        return this
    }
}

export class HttpRootErrorHandler extends SubAppErrorHandler {
    notFoundHandler(req: Request, res: Response, next: NextFunction): void {
        res.status(404).send("Not found")
    }

    exceptionHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
        console.log(err.stack)
        res.status(500).send("Internal server error")
    }
}

