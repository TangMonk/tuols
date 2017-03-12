import { request } from '../utils'

export async function get (query) {
  return request('/groups', {
    method: 'get',
    query: query
  })
}

export async function create (params) {
  return request('/group', {
    method: 'post',
    body: params
  })
}

export async function remove (params) {
  let id = params.id
  delete params.id
  return request(`/group/${id}`, {
    method: 'delete',
    body: params
  })
}

export async function update (params) {
  let id = params.id
  delete params.id
  return request(`/group/${id}`, {
    method: 'put',
    body: params
  })
}


export async function search (query) {
  
  return request('/group', {
    method: 'get',
    query: query
  })
}