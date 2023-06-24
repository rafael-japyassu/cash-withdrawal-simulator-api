import { UseCase } from '@/application/@core/use-case';
import { WithdrawalMoneyCommand } from './withdrawal-money-command';
import { Either } from '@/utils/either';
import { NotificationHandler } from '@/domain/validation/handler/notification-handler';
import { WithdrawalMoneyOutput } from './withdrawal-money-output';

export abstract class WithdrawMoneyUseCase extends UseCase<
WithdrawalMoneyCommand,
  Either<NotificationHandler, WithdrawalMoneyOutput>
> {}
