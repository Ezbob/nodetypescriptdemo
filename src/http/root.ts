import {Request, Response, NextFunction} from "express"
import SubApp, {Endpoint, HTTPMethod} from "../subapp/SubApp"
import SubAppErrorHandler from "../subapp/ErrorHandler"

export default class HttpRootApp extends SubApp {

    @Endpoint("/", HTTPMethod.GET)
    private getRoot(req: Request, res: Response) {

        res.send("<h2>Hello world!</h2>")
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

