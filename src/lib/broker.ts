import type { BrokerConfig } from './types'

export class Broker {
  public email: string
  public password: string
  public ssid?: string
  public brokerConfig: BrokerConfig

  constructor(constructor: {
    email: string
    password: string
    brokerConfig: BrokerConfig
  }) {
    this.email = constructor.email
    this.password = constructor.password
    this.brokerConfig = constructor.brokerConfig
  }

  async login(): Promise<Broker> {
    if (!this.email || !this.password) {
      throw new Error('Cannot login without email and password')
    }

    const request = {
      method: 'POST',
      headers: {
        Origin: this.brokerConfig.origin,
        'User-Agent': this.brokerConfig.userAgent,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier: this.email,
        password: this.password,
      }),
    }

    let res: Response

    try {
      res = await fetch(this.brokerConfig.endpoint, request)
    } catch (error) {
      throw error
    }

    const headerSetCookie = res.headers.get('set-cookie')
    if (headerSetCookie) {
      const splitCookieHeaders = headerSetCookie.split(',')
      const cookies = splitCookieHeaders.map((cookie) => {
        const [name, value] = cookie.trim().split('=')
        return { name, value }
      })

      const cookie = cookies.find((c) => c.name === 'ssid')
      if (cookie) {
        this.ssid = cookie.value
      }
    }

    return this
  }
}
