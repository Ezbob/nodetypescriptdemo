import express, {Express, NextFunction, Request, Response} from "express"
import SubAppErrorHandler from "./ErrorHandler"

export default abstract class SubApp {

    private application: Express = express()

    constructor() {
        this.routing()
    }

    abstract routing(): SubApp;

    attachErrorHandler(errorHandler: SubAppErrorHandler): void {
        this.application.use(errorHandler.exceptionHandler)
        this.application.use(errorHandler.notFoundHandler)
    }

    attachOnto(superApp: SubApp, prefix: string): SubApp {
        superApp.express.use(prefix, this.express)
        return this
    }

    get express(): Express {
        return this.application
    }
}