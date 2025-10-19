import axios from 'axios'
import { AtriumLoginInput, AtriumRegisterInput } from '../@types/atrium'

import { AtriumErrors } from '../utils/atrium.error'

const atriumClient = axios.create({
  baseURL: process.env.ATRIUM_BASE_URL,
})

export async function atriumRegister(input: AtriumRegisterInput) {
  try {
    const { data } = await atriumClient.post('/v3/users/register', input)
    return data
  } catch (error: any) {
    AtriumErrors(error)
    // if (error.response?.status === 409) {}
  }
}

export async function atriumLogin(input: AtriumLoginInput) {
  try {
    const { data } = await atriumClient.post('/v2/login', {
      identifier: input.identifier,
      password: input.password,
    })
    return data
  } catch (error: any) {
    AtriumErrors(error)
  }
}

export async function atriumGetProfile(ssid: string) {
  try {
    const { data } = await atriumClient.get('/v1/users/current/profile', {
      headers: {
        Cookie: `ssid=${ssid}`,
      },
    })

    return data
  } catch (error: any) {
    AtriumErrors(error)
  }
}

export { atriumClient }
