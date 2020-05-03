import {Pagination} from './paginationModel';

export class PaginationResult<T> {
  result: T;
  pagination: Pagination;
}
