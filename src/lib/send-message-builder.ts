import type { SendMessageData } from "./types";

export class SendMessageBuilder {
  public name?: string | null;
  public request_id?: string | null;
  public local_time?: number | null;
  public msg?: object | null;

  constructor() { }

  setName(name: string): SendMessageBuilder {
    if (name === "authenticate") {
      this.name = name;
    } else {
      this.name = "sendMessage";
    }
    return this;
  }

  setRequestId(request_id: string): SendMessageBuilder {
    this.request_id = request_id;
    return this;
  }

  setLocalTime(local_time: number): SendMessageBuilder {
    this.local_time = local_time;
    return this;
  }

  setMsg(msg: object): SendMessageBuilder {
    this.msg = msg;
    return this;
  }

  build(): SendMessageData {
    const missingFields: string[] = [];

    if (this.name == null || this.name === "") missingFields.push("name");
    if (this.request_id == null) missingFields.push("request_id");
    if (this.local_time == null) missingFields.push("local_time");
    if (this.msg == null) missingFields.push("msg");

    if (missingFields.length > 0) {
      throw new Error(
        `Cannot build SendMessage due to required fields: ${JSON.stringify(missingFields)}`
      );
    }

    return new SendMessage(
      this.name!,
      this.request_id!,
      this.local_time!,
      this.msg!
    );
  }
}

export class SendMessage {
  public readonly name: string;
  public readonly request_id: string;
  public readonly local_time: number;
  public readonly msg: object;

  constructor(
    name: string,
    request_id: string,
    local_time: number,
    msg: object
  ) {
    if (name === "get-balances") {
      this.name = "sendMessage";
    } else {
      this.name = name;
    }
    this.request_id = request_id;
    this.local_time = local_time;
    this.msg = msg;
  }
}
