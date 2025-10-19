import axios from 'axios'
import { AtriumErrors } from '../utils/atrium.error'

const api = axios.create({
  baseURL: process.env.SPACE_BASE_URL,
})
console.log('process.env.SPACE_BASE_URL', process.env.SPACE_BASE_URL)
export async function getUserData(id: string) {
  try {
    const { data } = await api.get(`/${id}`)
    return data.data.data[0].affId
  } catch (error: any) {
    AtriumErrors(error)
  }
}
