import type { WebSocketResponse } from "./types";

class RequestWaiter {
  private listeners: Map<
    string,
    { resolve: (res: WebSocketResponse) => void; reject: (err: Error) => void }
  > = new Map();

  constructor() { }

  waitForRequestId(request_id: string, timeout: number): Promise<WebSocketResponse> {
    return new Promise((resolve, reject) => {
      this.listeners.set(request_id, { resolve, reject });

      setTimeout(() => {
        if (this.listeners.has(request_id)) {
          this.listeners.delete(request_id);
          reject(new Error(`Timeout waiting for request_id: ${request_id}`));
        }
      }, timeout);
    });
  }

  resolveRequest(request_id: string, response: WebSocketResponse) {
    const listener = this.listeners.get(request_id);
    if (listener) {
      listener.resolve(response);
      this.listeners.delete(request_id);
    }
  }

  rejectRequest(request_id: string, error: Error) {
    const listener = this.listeners.get(request_id);
    if (listener) {
      listener.reject(error);
      this.listeners.delete(request_id);
    }
  }
}

export { RequestWaiter };

