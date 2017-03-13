import { request } from '../utils'

export async function query (params) {
  return request('/admin/<%= name %>s', {
    method: 'get',
    query: params
  })
}

export async function create (params) {
  return request('/admin/<%= name %>s', {
    method: 'post',
    body: params
  })
}

export async function remove (params) {
  return request(`/admin/<%= name %>s/${params}`, {
    method: 'delete'
  })
}

export async function update (params) {
  return request(`/admin/<%= name %>s/${params.id}`, {
    method: 'put',
    body: params.body
  })
}
