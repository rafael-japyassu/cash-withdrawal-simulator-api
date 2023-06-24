import { UseCase } from '@/application/@core/use-case';
import { WithdrawMoneyCommand } from './withdraw-money-command';
import { Either } from '@/utils/either';
import { NotificationHandler } from '@/domain/validation/handler/notification-handler';
import { WithdrawMoneyOutput } from './withdraw-money-output';

export abstract class WithdrawMoneyUseCase extends UseCase<
  WithdrawMoneyCommand,
  Either<NotificationHandler, WithdrawMoneyOutput>
> {}
