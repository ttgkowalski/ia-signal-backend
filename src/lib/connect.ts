import { Broker } from './broker'
import { AtriunWebSocket } from './websocket'
import type { BrokerConfig, AtriunWebSocketConstructor } from './types'
export async function connect(
  email: string,
  password: string
): Promise<[Broker, AtriunWebSocket]> {
  const userAgent =
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36'

  const brokerConfig: BrokerConfig = {
    userAgent,
    endpoint: 'https://auth.trade.atriunbroker.finance/api/v2/login',
    origin: 'https://login.trade.atriunbroker.finance',
  }

  const broker = new Broker({ email, password, brokerConfig })

  const atriunWebSocketConfig: AtriunWebSocketConstructor = {
    userAgent,
    endpoint: 'wss://ws.trade.atriunbroker.finance/echo/websocket',
    origin: 'https://trade.atriunbroker.finance',
    headers: { 'User-Agent': userAgent },
    broker,
  }

  await broker.login()

  let atriunWebSocket: AtriunWebSocket

  try {
    atriunWebSocket = new AtriunWebSocket(atriunWebSocketConfig)
    await atriunWebSocket.connect()
    console.log('WebSocket Connected :)')
  } catch (error) {
    console.log(`error: ${error}`)
    throw error
  }

  return [broker, atriunWebSocket]
}
