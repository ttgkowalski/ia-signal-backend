import { BalanceResponse } from '@/@types/balance-response'
import { MessageFactory } from '../lib'
import { AtriunWebSocket } from '../lib/websocket'

export async function getBalanceService(
  ssid: string
): Promise<BalanceResponse> {
  try {
    console.log('emte')
    const messageFactory = new MessageFactory({
      expiration: 0,
      profits: {
        forex: { 1: 85, 2: 90 },
        crypto: { 1: 88, 2: 92 },
        stocks: { 1: 82, 2: 87 },
        'binary-option': { 1: 85, 2: 90 },
        'turbo-option': { 1: 90, 2: 95 },
      },
    })

    const userAgent =
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36'

    const websocketConfig = {
      userAgent,
      endpoint: 'wss://ws.trade.atriunbroker.finance/echo/websocket',
      origin: 'https://trade.atriunbroker.finance',
      headers: { 'User-Agent': userAgent },
      broker: { ssid },
    }

    const websocket = new AtriunWebSocket(websocketConfig)

    await websocket.connect()

    const authMessage = messageFactory.createAuthenticate({ ssid })
    await websocket.send('authenticate', authMessage, false)
    console.log('fuii', authMessage)
    const balancesMessage = messageFactory.createGetBalances()
    console.log(balancesMessage)
    const response = await websocket.send(
      balancesMessage.name,
      balancesMessage,
      true
    )
    console.log(response)
    if (websocket.connection) {
      websocket.connection.close()
    }

    if (response && response.msg) {
      return {
        success: true,
        data: response.msg,
        ssid: ssid,
      }
    } else {
      return {
        success: false,
        error: 'Resposta do balance vazia ou inválida',
        ssid: ssid,
      }
    }
  } catch (error) {
    return {
      success: false,
      error: `Erro: ${error}`,
      ssid: ssid,
    }
  }
}
