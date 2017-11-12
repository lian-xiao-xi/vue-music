import originJsonp from 'jsonp'

export function param(data) {
  let url = '';
  for (var k in data) {
    let value = data[k] != null ? data[k] : '';
    url += '&' + k + '=' + encodeURIComponent(value);
  }
  return url ? url.substring(1) : '';
}

export default function jsonp(url, data, option) {
  url += (url.indexOf('?') >= 0 ? '&' : '?') + param(data);
  return new Promise((resolve, reject) => {
    originJsonp(url, option, (err, resultData) => {
      if(!err) resolve(resultData);
      else reject(err);
    })
  })
}