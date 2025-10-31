import { BalanceResponse } from '@/@types/balance-response'
import { MessageFactory } from '@/lib'
import { AtriunWebSocket } from '@/lib/websocket'

export async function getBalanceService(
  ssid: string
): Promise<BalanceResponse> {
  try {
    const messageFactory = new MessageFactory({
      expiration: 0,
      profits: {} as any,
    })

    const userAgent =
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36'

    const websocket = new AtriunWebSocket({
      userAgent,
      endpoint: 'wss://ws.trade.atriunbroker.finance/echo/websocket',
      origin: 'https://trade.atriunbroker.finance',
      headers: { 'User-Agent': userAgent },
      broker: { ssid },
    })

    await websocket.connect()

    const authMessage = messageFactory.createAuthenticate({ ssid })
    await websocket.send('authenticate', authMessage, false)

    const balancesMessage = messageFactory.createGetBalances()
    const response = await websocket.send(
      balancesMessage.name,
      balancesMessage,
      true
    )

    if (websocket.connection) {
      websocket.connection.close()
    }

    if (response && (response as any).msg) {
      return {
        success: true,
        data: (response as any).msg,
        ssid,
      }
    }

    return {
      success: false,
      error: 'Resposta do balance vazia ou inválida',
      ssid,
    }
  } catch (error: any) {
    return {
      success: false,
      error: String(error?.message || error),
      ssid,
    }
  }
}
