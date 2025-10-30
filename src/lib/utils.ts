export function randomNumber(min: number, max: number): number {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min)
}

export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function waitForWebSocket(ws: any): Promise<void> {
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
