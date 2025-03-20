import {
  getToken,
  ReqBodyType,
  APIFunctionType,
  ReqDataBodyType,
} from "./misc";

const protect = async (vip: APIFunctionType) => {
  let validated;
  try {
    validated = await vip();
  } catch {
    validated = { error: "failed-to-connect", errorMessage: "Server / Network issues" };
  }
  return validated;
};

export const getApiJson = async (url: string, token?: string) =>
  await protect(async () => {
    // check token
    token = token ? token : getToken();
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
        // 'Common-API-Key': sessionToken ?? getSessionToken(),
      },
    });
    const responseJson = await response.json();
    return responseJson;
  });

export const postApiJson = async (
  url: string,
  data: ReqBodyType = {},
  token?: string
) =>
  await protect(async () => {
    // check token
    token = token ? token : getToken();
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
        // 'Common-API-Key': sessionToken ?? getSessionToken(),
      },
      body: JSON.stringify(data),
    });
    const responseJson = await response.json();
    return responseJson;
  });

export const patchApiJson = async (
  url: string,
  data: ReqBodyType = {},
  token?: string
) =>
  await protect(async () => {
    // check token
    token = token ? token : getToken();
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
        // 'Common-API-Key': sessionToken ?? getSessionToken(),
      },
      body: JSON.stringify(data),
    });
    const responseJson = await response.json();
    return responseJson;
  });

export const putApiJson = async (
  url: string,
  data: ReqBodyType = {},
  token?: string
) =>
  await protect(async () => {
    // check token
    token = token ? token : getToken();
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
        // 'Common-API-Key': sessionToken ?? getSessionToken(),
      },
      body: JSON.stringify(data),
    });
    const responseJson = await response.json();
    return responseJson;
  });

export const deleteApiJson = async (
  url: string,
  data: ReqBodyType = {},
  token?: string
) =>
  await protect(async () => {
    // check token
    token = token ? token : getToken();
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
        // 'Common-API-Key': sessionToken ?? getSessionToken(),
      },
      body: JSON.stringify(data),
    });
    const responseJson = await response.json();
    return responseJson;
  });

export const postApiFormData = async (
  url: string,
  data: ReqDataBodyType = {},
  token?: string
) =>
  await protect(async () => {
    // check token
    token = token ? token : getToken();
    const formData = new FormData();

    for (const name in data) {
      formData.append(name, data[name]);
    }
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // 'Common-API-Key': sessionToken ?? getSessionToken(),
      },
      body: formData,
    });
    const responseJson = await response.json();
    return responseJson;
  });

export const patchApiFormData = async (
  url: string,
  data: ReqDataBodyType = {},
  token?: string
) =>
  await protect(async () => {
    // check token
    token = token ? token : getToken();
    const formData = new FormData();
    for (const name in data) {
      formData.append(name, data[name]);
    }
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        // 'Common-API-Key': sessionToken ?? getSessionToken(),
      },
      body: formData,
    });
    const responseJson = await response.json();
    return responseJson;
  });

export const putApiFormData = async (
  url: string,
  data: ReqDataBodyType = {},
  token?: string
) =>
  await protect(async () => {
    // check token
    token = token ? token : getToken();
    const formData = new FormData();
    for (const name in data) {
      formData.append(name, data[name]);
    }
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        // 'Common-API-Key': sessionToken ?? getSessionToken(),
      },
      body: formData,
    });
    const responseJson = await response.json();
    return responseJson;
  });
