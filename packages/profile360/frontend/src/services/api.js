export const callGetApi = async ({ fullUrl }) => {
  const request = await fetch(fullUrl, {
    method: 'GET',
  });
  return request;
};

export const callPostApi = async ({ fullUrl, payload, headers, credentials }) => {
  const request = await fetch(fullUrl, {
    method: 'POST',
    body: payload instanceof FormData ? payload : JSON.stringify(payload),
    headers: headers,
    credentials: credentials,
  });

  return request;
};

export const callPutApi = async ({ fullUrl, payload }) => {
  const request = await fetch(fullUrl, {
    method: 'PUT',
    body: payload instanceof FormData ? payload : JSON.stringify(payload),
  });

  return request;
};
