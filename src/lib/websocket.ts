import { WebSocket } from 'ws'
import { EventEmitter } from 'events'
import type {
  AtriunWebSocketConstructor,
  WebSocketResponse,
  Message,
} from './types'
import { RequestWaiter } from './request-waiter'
import { SendMessageBuilder } from './send-message-builder'

export class AtriunWebSocket extends EventEmitter {
  public userAgent?: string
  public endpoint: string
  public origin: string
  public headers: Record<string, string>
  public connection?: WebSocket | null
  public expiration?: number
  public ssid?: string
  public waiter: RequestWaiter
  public requestId: number
  public timestamp: number
  public broker: any

  constructor(constructor: AtriunWebSocketConstructor) {
    super()

    this.userAgent = constructor.userAgent
    this.endpoint = constructor.endpoint
    this.origin = constructor.origin
    this.headers = constructor.headers
    this.broker = constructor.broker

    this.requestId = 1
    this.timestamp = 0
    this.waiter = new RequestWaiter()

    this._onopen = this._onopen.bind(this)
    this._onmessage = this._onmessage.bind(this)
    this._onclose = this._onclose.bind(this)
    this._onerror = this._onerror.bind(this)
  }

  public async connect(opts = {}) {
    this.timestamp =
      Date.now() - Math.floor(Math.random() * (6000 - 4000) + 4000)

    this.connection = new WebSocket(this.endpoint, {
      origin: this.origin,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36',
      },
    })

    this.connection.on('open', this._onopen)
    this.connection.on('message', this._onmessage)
    this.connection.on('close', this._onclose)
    this.connection.on('error', this._onerror)

    await this.waitForWebSocket(this.connection)
  }

  public async send(
    name: string,
    msg: Message,
    returnResponse: boolean
  ): Promise<WebSocketResponse | undefined> {
    if (!this.connection) {
      return Promise.reject(new Error('WebSocket is not connected'))
    }

    const final_message_builder = new SendMessageBuilder()
      .setName(name)
      .setLocalTime(this.localTime() + 5000)
      .setRequestId(this.randomRequestId())
      .setMsg(msg)

    let final_message

    try {
      final_message = final_message_builder.build()
    } catch (err) {
      console.error('Failed to build message:', err)
      return Promise.reject(err)
    }

    this.connection.send(JSON.stringify(final_message))

    if (name === 'authenticate') {
      await this.sleep(4000)
    }

    if (returnResponse) {
      return Promise.resolve(
        this.waiter.waitForRequestId(final_message.request_id, 5000)
      )
    } else {
      return Promise.resolve(undefined)
    }
  }

  private _onopen(event: Event): void {
    this.emit('open', event)
  }

  private _onmessage(event: any): void {
    try {
      let message = JSON.parse(event.data || event)

      if (message.name === 'timeSync') {
        this.timestamp = message.msg
        const date = new Date(message.msg)

        let expiration = new Date(date.getTime())
        expiration.setMinutes(date.getMinutes() + 1)
        expiration.setSeconds(0, 0)

        if (date.getSeconds() > 30) {
          expiration.setMinutes(date.getMinutes() + 2)
        }

        let set_expiration = Math.round(expiration.getTime() / 1000)
        this.expiration = set_expiration

        this.emit('timeSync', message)
      }

      if (message.request_id) {
        this.waiter.resolveRequest(message.request_id, message)
      }

      this.emit('message', event.data || event)
    } catch (error) {
      this.emit('message', event.data || event)
    }
  }

  private _onclose(event: CloseEvent): void {
    this.emit('close', event)
  }

  private _onerror(event: Event): void {
    this.emit('error', event)
  }

  localTime() {
    return Date.now() - this.timestamp
  }

  newRequestId(
    isSubscription: boolean,
    customRequestId: string | null
  ): string {
    if (!customRequestId) {
      customRequestId = (isSubscription ? 's_' : '') + this.requestId++
    }
    return customRequestId.toString()
  }

  randomRequestId() {
    const secondsNow = Math.floor(Date.now() / 1000)
    const randId = Math.random().toString().slice(2, 11)
    return secondsNow + '_' + randId
  }

  private async waitForWebSocket(ws: WebSocket): Promise<void> {
    return new Promise<void>(function (resolve, reject) {
      ws.on('open', onopen)
      ws.on('error', done)

      function onopen() {
        done(null)
      }

      function done(err: any) {
        ws.removeListener('open', onopen)
        ws.removeListener('error', done)

        if (err) reject(err)
        else resolve()
      }
    })
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}
