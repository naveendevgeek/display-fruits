
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

type RequestOptions = {
  method: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
  mode?: RequestMode
};

export type ApiResponse<T> = {
    data: T | null;
    error: string | null;
  };

  async function makeApiRequest<T>(
    urlPath: string,
    options: RequestOptions,
  ): Promise<ApiResponse<T>> {
    try {
      const { method, headers = {}, body, mode } = options;
      let apiFullUrl = '';
      console.log('mode', mode);
  
      const requestOptions: RequestInit = {
        method,
        headers: {
          ...headers,
        },
        mode: mode
      };
  
      if (body) {
        requestOptions.body = JSON.stringify(body);
      }

      console.log('process.env.NODE_ENV', process.env.NODE_ENV, process.env.REACT_APP_FRUITS_API_BASE_URL);
      apiFullUrl = new URL(`/api/v1/${urlPath}`, process.env.REACT_APP_FRUITS_API_BASE_URL).toString();  
      console.info(`Making a ${method} request to the ${apiFullUrl}`);
  
      const response = await fetch(apiFullUrl, requestOptions);
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        data: null,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  }

async function getRequest<T>(
    urlPath: string,
    headers?: Record<string, string>,
    mode?: any
  ): Promise<ApiResponse<T>> {
    return makeApiRequest<T>(urlPath, { method: 'GET', headers, mode: mode?.mode },);
  }
  
  async function postRequest<T>(
    urlPath: string,
    body: any,
    headers?: Record<string, string>,
  ): Promise<ApiResponse<T>> {
    return makeApiRequest<T>(urlPath, { method: 'POST', body, headers });
  }
  
  async function putRequest<T>(
    urlPath: string,
    body: any,
    headers?: Record<string, string>,
  ): Promise<ApiResponse<T>> {
    console.info(`Making PUT request to: ${urlPath}`);
    return makeApiRequest<T>(urlPath, { method: 'PUT', body, headers });
  }
  
  async function deleteRequest<T>(
    urlPath: string,
    headers?: Record<string, string>,
  ): Promise<ApiResponse<T>> {
    return makeApiRequest<T>(urlPath, { method: 'DELETE', headers });
  }
  
  async function patchRequest<T>(
    urlPath: string,
    body: any,
    headers?: Record<string, string>,
  ): Promise<ApiResponse<T>> {
    return makeApiRequest<T>(urlPath, { method: 'PATCH', body, headers });
  }
  
  export const finofoApi = {
    get: getRequest,
    post: postRequest,
    put: putRequest,
    patch: patchRequest,
    delete: deleteRequest,
  };

export const ApiRoutes = {
    GET_FRIUTS: 'get-fruits',
} as const;