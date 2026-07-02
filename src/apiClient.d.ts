declare module '../apiClient' {
  export function get(endpoint: string): Promise<any>;
  export function post(endpoint: string, body?: any): Promise<any>;
  export function put(endpoint: string, body?: any): Promise<any>;
  export function del(endpoint: string): Promise<any>;
}
