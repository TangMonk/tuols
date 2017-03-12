import { request } from '../utils'

export async function query (params) {
  return request('/<%= name %>', {
    method: 'get',
    query: params
  })
}

export async function create (params) {
  return request('/<%= name %>', {
    method: 'post',
    body: params
  })
}

export async function remove (params) {
  return request(`/<%= name %>/${params}`, {
    method: 'delete'
  })
}

export async function update (params) {
  return request(`/<%= name %>/${params.id}`, {
    method: 'put',
    body: params.body
  })
}
