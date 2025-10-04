export interface PageResult<T> {
  results: T[];
  page: number;
  size: number;
  totalPages: number;
  hasMore: boolean;
  total: number;
}
