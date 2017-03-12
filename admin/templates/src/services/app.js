import { request } from '../utils'

export async function login (params) {
  return request('/admin/login', {
    method: 'post',
    body: params
  })
}

export async function logout (params) {
  return request('/api/logout', {
    method: 'post',
    data: params
  })
}

export async function userInfo () {
  return request('/admin/token', {
    method: 'get'
  })
}
