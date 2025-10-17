export interface AtriumRegisterInput {
  identifier: string
  password: string
  accepted: ('terms' | 'privacy policy')[]
  country_id: number
  first_name: string
  last_name: string
  timezone: string
}

export interface AtriumLoginInput {
  identifier: string
  password: string
  affiliate_id: string
}
