import fetch from 'dva/fetch';
const param = require('jquery-param')

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default async function request(url, options) {

  if (options.body) {
    options.body = JSON.stringify(options.body)
  }
  if(options.query){
    url += (url.indexOf('?') === -1 ? '?' : '&') + param(options.query)
    delete options.query
  }
  const token = localStorage.getItem('token')
  
  options.headers = {
    'token': token,
    'Content-Type': 'application/json'
  }
  const response = await fetch(`${API_URL}${url}`, options);
  // checkStatus(response);

  const data = await response.json();

  return data;
}