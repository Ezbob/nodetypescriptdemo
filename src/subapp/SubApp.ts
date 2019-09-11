import express, {Express, NextFunction, Request, Response, Application} from "express"
import SubAppErrorHandler from "./ErrorHandler"

interface EndpointFunction {
    (req: Request, res: Response): any;
}

interface EndpointDescriptor {
    prefix: string,
    method: HTTPMethod,
    function: EndpointFunction
}

export enum HTTPMethod {
    GET = "get",
    POST = "post",
    PUT = "put",
    DELETE = "delete",
    PATCH = "patch",
    OPTIONS = "options"
}

export default abstract class SubApp {
    __endpoints: Array<EndpointDescriptor> | undefined
    private application: Express = express()

    private __mountEndpoints(): void {
        if (this.__endpoints) {
            for (let entry of this.__endpoints) {
                this.application[entry.method]
                    .call(this.application, entry.prefix, entry.function as Application)
            }
        }
    }

    constructor() {
        this.__mountEndpoints()
    }

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

export function Endpoint<T extends SubApp>(prefix: string, method: HTTPMethod) {
    return (target: T, _propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
        if (!target.__endpoints) {
            target.__endpoints = []
        }
        target.__endpoints.push({
            prefix,
            method: HTTPMethod.GET, 
            function: descriptor.value
        })
        return descriptor
    }
}