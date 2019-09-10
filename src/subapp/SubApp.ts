import express, {Express, NextFunction, Request, Response} from "express"

export default abstract class SubApp {
    private application: Express = express()

    abstract routing(): void;

    abstract error404(req: Request, res: Response, next: NextFunction): void;

    abstract error500(err: Error, req: Request, res: Response, next: NextFunction): void;

    get app(): Express {
        return this.application
    }
}