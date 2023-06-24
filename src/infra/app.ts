import './config/env';
import { HttpRunner } from './http/types/http-runner';

export class ApplicationRunner {
	constructor(private readonly httpRunner: HttpRunner) {}

	init() {
		this.httpRunner.start();
	}
}
