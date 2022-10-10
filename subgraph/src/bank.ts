import {
  Deposit
} from "../generated/Bank/Bank";
import { DepositEntity } from "../generated/schema";

export function handleDeposit(event: Deposit): void {
  const id =
    event.params.customer.toHex() +
    "-" +
    Date.now().toString();

  let deposit = new DepositEntity(id);

  deposit.customer = event.params.customer;
  deposit.amount = event.params.amount;

  deposit.save();
}