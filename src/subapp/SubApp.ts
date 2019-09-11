import express, {Express, NextFunction, Request, Response} from "express"

export default abstract class SubApp {

    constructor() {
        this.routing()
    }

    private application: Express = express()

    abstract routing(): SubApp;

    abstract error404(req: Request, res: Response, next: NextFunction): void;

    abstract error500(err: Error, req: Request, res: Response, next: NextFunction): void;

    errorHandling(): void {
        this.application.use(this.error500)
        this.application.use(this.error404)
    }

    attachOnto(prefix: string, superApp: SubApp): SubApp {
        superApp.express.use(prefix, this.express)
        return this
    }

    get express(): Express {
        return this.application
    }
}