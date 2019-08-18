import * as express from 'express';
declare class Application {
    private app;
    constructor();
    private initApp;
    getExpressServer(): express.Application;
    private initDB;
    private initMiddleware;
    private initRoutes;
    initExpressConnection(): void;
}
export default Application;
