import { IHashGateway } from '@/domain/modules/hash/gateways/hash-gateway';
import bcryptjs from 'bcryptjs';

export class BCryptGateway implements IHashGateway {
	async hash(payload: string): Promise<string> {
		return bcryptjs.hash(payload, 8);
	}

	async compare(payload: string, hash: string): Promise<boolean> {
		return bcryptjs.compare(payload, hash);
	}

}