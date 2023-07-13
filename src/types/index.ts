import Amentity from "models/amenity";

export interface SearchParams {
  pageIndex: number;
  pageSize: number;
  status?: string;
  sortBy?: string;
  ascending?: boolean;
  searchKey?: string;
  amenitiesId?: string;

  [key: string]: any;
}

export interface ListResponse<T> {
  content: T[];
  pageable?: {
    pageNumber: number;
    pageSize: number;
  };
  last?: boolean;
  totalPages?: number;
  totalElements?: number;
  size?: number;
  number?: number;
  first?: boolean;
  numberOfElements?: number;
  empty?: boolean;
}

export interface GetAllResponse<T> {
  content: T[];
}

export interface DeleteType<T> {
  id: T | T[];
}
