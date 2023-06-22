import { UseCase } from '@/application/@core/use-case';
import { AuthenticateCommand } from './authenticate-command';
import { Either } from '@/utils/either';
import { NotificationHandler } from '@/domain/validation/handler/notification-handler';
import { AuthenticateOutput } from './authenticate-output';

export abstract class AuthenticateUseCase extends UseCase<
  AuthenticateCommand,
  Either<NotificationHandler, AuthenticateOutput>
> {}
