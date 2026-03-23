const someCommonValues = ['common', 'values'];

export const resolvePath = (object, path, defaultValue) => path
  .split('.')
  .reduce((o, p) => o ? o[p] : defaultValue, object)

export const capitalize = (string) => {
  return string && string[0].toUpperCase() + string.slice(1);
};

export const callApi = (contextData, method, methodUrl, callbackFunction, body) => {
  let token = contextData.session?.authorization?.token
  const headers = {
    'Accept': 'application/json',
    Authorization: 'bearer ' + token
  };

  // If a body is provided assume JSON payload unless caller set otherwise
  if (body) {
    headers['Content-Type'] = 'application/json';
  }

  fetch(contextData.apiBaseUrl + methodUrl, {
    mode: 'cors',
    method: method,
    headers,
    body: body
  })
    .then(async (res) => {
      if (res.status === 401) {
        localStorage.removeItem('session');
        window.location.reload();
        return;
      }

      // Try to parse JSON response when possible
      let data;
      try {
        data = await res.json();
      } catch (e) {
        data = null;
      }

      if (!res.ok) {
        // Map some common server errors to friendly messages
        if (res.status === 500) {
          return { status: 'error', code: 500, message: 'Ha ocurrido un error inesperado, contacte al administrador.' };
        }
        if (res.status === 422) {
          return { status: 'error', code: 422, message: 'Los datos ingresados no son válidos.' };
        }

        return data ?? { status: 'error', code: res.status, message: 'Error en la petición.' };
      }

      return data;
    })
    .then((response) => {
      // If response is undefined (e.g. due to 401 reload) skip callback
      if (typeof response === 'undefined') return;
      callbackFunction(response);
    })
    .catch((err) => {
      // Network or parsing error
      callbackFunction({ status: 'error', message: 'No se pudo conectar con el servidor. Reintente más tarde.' });
    });
}

export const getFormattedDate = (dateString) => {
  // let dateObject = new Date(dateString)
  // let dateResult = dateObject.getDate() + '/' + (dateObject.getMonth() + 1) + '/' + dateObject.getFullYear() + ' ' + dateObject.getHours() + ':' + dateObject.getMinutes()
  // return dateResult
  return dateString
}
