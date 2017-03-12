import { request } from '../utils'

export async function query (params) {
  return request('/users', {
    method: 'get',
    query: params
  })
}

export async function create (params) {
  return request('/users', {
    method: 'post',
    body: params
  })
}

export async function remove (params) {
  return request(`/users/{params}`, {
    method: 'delete'
  })
}

export async function update (params) {
  return request(`/users/params.id`, {
    method: 'put',
    body: params.body
  })
}
