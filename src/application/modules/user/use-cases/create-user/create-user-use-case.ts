import { UseCase } from '@/application/@core/use-case';
import { CreateUserCommand } from './create-user-command';
import { CreateUserOutput } from './create-user-output';
import { Either } from '@/utils/either';
import { NotificationHandler } from '@/domain/validation/handler/notification-handler';

export abstract class CreateUserUseCase extends UseCase<CreateUserCommand, Either<NotificationHandler, CreateUserOutput>> {}