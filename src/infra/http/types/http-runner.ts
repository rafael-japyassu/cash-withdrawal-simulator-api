export abstract class HttpRunner {
  protected abstract listen(): void;
  protected abstract initRoutes(): void;
  protected abstract loadMiddlewares(): void;

  start() {
  	this.initRoutes();
  	this.listen();
  	this.loadMiddlewares();
  }
}
