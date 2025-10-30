export interface BrokerConfig {
  userAgent: string
  endpoint: string
  origin: string
}

export interface AtriunWebSocketConstructor {
  userAgent?: string
  endpoint: string
  origin: string
  headers: Record<string, string>
  broker: any
}

export interface TradingProfits {
  forex: Record<number, number>
  crypto: Record<number, number>
  stocks: Record<number, number>
  'binary-option'?: Record<number, number>
  'turbo-option'?: Record<number, number>
}

export interface TradingConfig {
  expiration: number | null
  profits: TradingProfits
}

export interface AuthenticateMessage {
  ssid: string
  protocol: number
  session_id: string
  client_session_id: string
}

export interface GetBalancesMessage {
  name: string
  version: '1.0'
  body: {
    types_ids: number[]
    tournaments_statuses_ids: number[]
  }
}

export interface BalanceResponse {
  id: number
  user_id: number
  type: number
  amount: number
  enrolled_amount: number
  enrolled_sum_amount: number
  bonus_amount: number
  hold_amount: number
  orders_amount: number
  currency: string
  tournament_id: number | null
  tournament_name: string | null
  is_fiat: boolean
  is_marginal: boolean
  has_deposits: boolean
  auth_amount: number
  equivalent: number
  created: number
}

export interface WebSocketResponse {
  request_id: string
  name: string
  msg: any
}

export interface SendMessageData {
  name: string
  request_id: string
  local_time: number
  msg: object
}

export interface BinaryOptionsOpenOptionMessage {
  name: string
  version: string
  body: {
    user_balance_id: number
    active_id: number
    option_type_id: 1 | 3
    direction: string
    expiration_size: number
    expired: number
    refund_value: number
    price: number
    value: number
    profit_percent: number
  }
}

export interface HeartbeatMessage {
  name: string
  userTime: number
  heartbeatTime: number
}

export interface CoreGetProfileMessage {
  name: string
  version: string
  body: object
}

export interface GetAdditionalBlocksMessage {
  name: string
  version: string
}

export interface SetOptionsMessage {
  name: string
  sendResults: boolean
}

export type Message =
  | AuthenticateMessage
  | GetAdditionalBlocksMessage
  | HeartbeatMessage
  | CoreGetProfileMessage
  | GetBalancesMessage
  | BinaryOptionsOpenOptionMessage
