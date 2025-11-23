export interface IPaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface IAppResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}
