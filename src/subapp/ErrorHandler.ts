import {Express, NextFunction, Request, Response} from "express"

export default abstract class SubAppErrorHandler {
    abstract notFoundHandler(req: Request, res: Response, next: NextFunction): void;

    abstract exceptionHandler(err: Error, req: Request, res: Response, next: NextFunction): void;
}