import type { 
  TradingProfits, 
  AuthenticateMessage, 
  GetBalancesMessage, 
  BinaryOptionsOpenOptionMessage,
  HeartbeatMessage,
  CoreGetProfileMessage,
  GetAdditionalBlocksMessage,
  SetOptionsMessage,
  Message 
} from "./types";

export class MessageFactory {
  constructor(private trading: { expiration: number; profits: Record<string, Record<number, number>> }) {
    this.trading.expiration = trading.expiration;
    this.trading.profits = trading.profits;
  }

  createAuthenticate(opts: { ssid: string }): AuthenticateMessage {
    return {
      ssid: opts.ssid,
      protocol: 3,
      session_id: "",
      client_session_id: "",
    };
  }

  createSetOptions(opts: { sendResults: boolean }): SetOptionsMessage {
    return {
      name: "setOptions",
      sendResults: opts.sendResults,
    };
  }

  createGetAdditionalBlocks(): GetAdditionalBlocksMessage {
    return {
      name: "get-additional-blocks",
      version: "1.0",
    };
  }

  createHeartbeat(opts: { userTime: number; heartbeatTime: number }): HeartbeatMessage {
    return {
      name: "heartbeat",
      userTime: opts.userTime,
      heartbeatTime: opts.heartbeatTime,
    };
  }

  createCoreGetProfile(): CoreGetProfileMessage {
    return {
      name: "core.get-profile",
      version: "1.0",
      body: {},
    };
  }

  createGetBalances(): GetBalancesMessage {
    return {
      name: "internal-billing.get-balances",
      version: "1.0",
      body: { types_ids: [1, 4, 2], tournaments_statuses_ids: [3, 2] },
    };
  }

  createBinaryOptionsOpenOption(opts: {
    expired: number;
    active_id: number;
    option_type_id: 1 | 3;
    direction: string;
    expiration_size: number;
    price: number;
    value: number;
    user_balance_id: number;
    profit_percent?: number;
  }): BinaryOptionsOpenOptionMessage {
    if (opts.expired == null) throw new Error(`"expired" não pode ser null`);
    if (this.trading.expiration == null) throw new Error(`"this.trading.expiration" não pode ser null`);
    if (opts.active_id == null) throw new Error(`"active_id" não pode ser null`);

    const expired = opts.expired < 1000000000
      ? this.trading.expiration + ((opts.expired - 1) * 60)
      : opts.expired;

    const value = parseInt((opts.value || 0).toString().replace('.', ''), 10);

    const instrument_type =
      opts.option_type_id === 1 ? "binary-option" :
        opts.option_type_id === 3 ? "turbo-option" :
          (() => { throw new Error("Invalid option_type_id"); })();

    return {
      name: "binary-options.open-option",
      version: "1.0",
      body: {
        user_balance_id: opts.user_balance_id,
        active_id: opts.active_id,
        option_type_id: opts.option_type_id,
        direction: opts.direction,
        expiration_size: opts.expiration_size,
        expired,
        refund_value: 0,
        price: opts.price,
        value,
        profit_percent: opts.profit_percent
          ?? this.trading.profits[instrument_type as keyof TradingProfits]?.[opts.active_id]
          ?? 0, // fallback
      },
    };
  }
}

