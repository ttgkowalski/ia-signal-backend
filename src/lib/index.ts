export * from './types'
export * from './broker'
export * from './websocket'
export * from './connect'
export * from './message-factory'
export * from './request-waiter'
export * from './send-message-builder'
export * from './utils'

export async function createAtriumConnection(email: string, password: string) {
  const { connect } = await import('./connect')
  const { MessageFactory } = await import('./message-factory')

  const [broker, atriunWebSocket] = await connect(email, password)

  const messageFactory = new MessageFactory({ expiration: 0, profits: {} })

  return {
    broker,
    atriunWebSocket,
    messageFactory,
  }
}


