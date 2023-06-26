import { UseCase } from '@/application/@core/use-case';
import { FindAllTransactionsCommand } from './find-all-transactions-command';
import { Either } from '@/utils/either';
import { NotificationHandler } from '@/domain/validation/handler/notification-handler';
import { FindAllTransactionsOutput } from './find-all-transactions-output';

export abstract class FindAllTransactionsUseCase extends UseCase<
  FindAllTransactionsCommand,
  Either<NotificationHandler, FindAllTransactionsOutput>
> {}
