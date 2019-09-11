import express, {Express, NextFunction, Request, Response, Application} from "express"
import SubAppErrorHandler from "./ErrorHandler"

interface EndpointFunction {
    (req: Request, res: Response): any;
}

interface EndpointMiddlewareFunction {
    (req: Request, res: Response, next: NextFunction): any;
}

interface EndpointDescriptor {
    prefix: string,
    method: HTTPMethod,
    function: EndpointFunction
}

interface EndpointMethodMapping {
    [method: string]: Array<EndpointMiddlewareFunction>;
}

interface EndpointMiddlewareMapping {
    [prefix: string]: EndpointMethodMapping
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
    __middleware: EndpointMiddlewareMapping | undefined
    private application: Express = express()

    private __mountEndpoints(): void {
        if (this.__endpoints) {
            for (let entry of this.__endpoints) {

                if (this.__middleware && this.__middleware[entry.prefix] 
                    && this.__middleware[entry.prefix][entry.method]) {
                    const middlewareList = this.__middleware[entry.prefix][entry.method]
                    for (const func of middlewareList) {
                        // attaching middle by method and prefix
                        this.application[entry.method]
                        .call(this.application, entry.prefix, (func as Application))
                    }
                    this.application[entry.method]
                        .call(this.application, entry.prefix, entry.function as Application)
                } else {
                    this.application[entry.method]
                        .call(this.application, entry.prefix, entry.function as Application)
                }
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
        let func: EndpointFunction = descriptor.value 
        if (!target.__endpoints) {
            target.__endpoints = []
        }
        target.__endpoints.push({
            prefix,
            method: HTTPMethod.GET, 
            function: func
        })
        return descriptor
    }
}

export function EndpointMiddleware<T extends SubApp>(prefix: string, method: HTTPMethod) {
    return (target: T, _propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
        let func: EndpointMiddlewareFunction = descriptor.value 
        if (!target.__middleware) {
            target.__middleware = {}
        }
        if (!target.__middleware[prefix]) {
            target.__middleware[prefix] = {}
        }
        if (!target.__middleware[prefix][method]) {
            target.__middleware[prefix][method] = []
        }

        target.__middleware[prefix][method].push(func)
        return descriptor
    }
}