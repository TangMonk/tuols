import { request } from '../utils'

export async function get (query) {
  return request('/rebate/history', {
    method: 'get',
    query: query
  })
}

export async function getLevel (query) {
  return request('/rebate/history', {
    method: 'get',
    query: query
  })
}

