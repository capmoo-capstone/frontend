import { useCallback, useMemo } from 'react';

import {
  type PaginationState,
  type SortingState,
} from '@tanstack/react-table';
import { useSearchParams } from 'react-router-dom';

export type TableSortType = 'ASC' | 'DESC';

export type QueryParamValue = string | number | boolean | string[] | null | undefined;

export interface UpdateQueryParamsOptions {
  replace?: boolean;
  resetPage?: boolean;
}

export interface UseTableQueryStateResult {
  searchParams: URLSearchParams;
  page: number;
  pageSize: number;
  sortField?: string;
  sortType?: TableSortType;
  pagination: PaginationState;
  sorting: SortingState;
  stringFilters: Record<string, string>;
  updateQueryParams: (updates: Record<string, QueryParamValue>, options?: UpdateQueryParamsOptions) => void;
}

const PAGE_PARAM = 'page';
const PAGE_SIZE_PARAM = 'pageSize';
const SORT_FIELD_PARAM = 'sortField';
const SORT_TYPE_PARAM = 'sortType';

const RESERVED_KEYS = new Set([PAGE_PARAM, PAGE_SIZE_PARAM, SORT_FIELD_PARAM, SORT_TYPE_PARAM]);

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 25;

const parsePositiveInt = (value: string | null, fallback: number) => {
  const parsed = Number(value);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const normalizeArrayValue = (value: string[]) => value.filter((item) => item.trim() !== '');

export function useTableQueryState(): UseTableQueryStateResult {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parsePositiveInt(searchParams.get(PAGE_PARAM), DEFAULT_PAGE);
  const pageSize = parsePositiveInt(searchParams.get(PAGE_SIZE_PARAM), DEFAULT_PAGE_SIZE);

  const sortField = searchParams.get(SORT_FIELD_PARAM) || undefined;
  const sortType =
    sortField && searchParams.get(SORT_TYPE_PARAM) === 'DESC' ? 'DESC' : sortField ? 'ASC' : undefined;

  const sorting = useMemo<SortingState>(() => {
    if (!sortField) return [];

    return [
      {
        id: sortField,
        desc: sortType === 'DESC',
      },
    ];
  }, [sortField, sortType]);

  const pagination = useMemo<PaginationState>(
    () => ({
      pageIndex: page - 1,
      pageSize,
    }),
    [page, pageSize]
  );

  const stringFilters = useMemo(() => {
    const filters: Record<string, string> = {};

    searchParams.forEach((value, key) => {
      if (RESERVED_KEYS.has(key)) return;

      if (!(key in filters)) {
        filters[key] = value;
      }
    });

    return filters;
  }, [searchParams]);

  const updateQueryParams = useCallback(
    (updates: Record<string, QueryParamValue>, options?: UpdateQueryParamsOptions) => {
      const nextParams = new URLSearchParams(searchParams);

      if (options?.resetPage && updates[PAGE_PARAM] === undefined) {
        nextParams.set(PAGE_PARAM, String(DEFAULT_PAGE));
      }

      Object.entries(updates).forEach(([key, value]) => {
        nextParams.delete(key);

        if (value === null || value === undefined) {
          return;
        }

        if (Array.isArray(value)) {
          const normalizedValues = normalizeArrayValue(value.map((item) => String(item)));

          if (normalizedValues.length === 0) return;

          normalizedValues.forEach((item) => nextParams.append(key, item));
          return;
        }

        if (typeof value === 'boolean') {
          if (value) {
            nextParams.set(key, 'true');
          }
          return;
        }

        const stringValue = String(value);
        if (stringValue.trim() === '') return;

        nextParams.set(key, stringValue);
      });

      setSearchParams(nextParams, { replace: options?.replace ?? true });
    },
    [searchParams, setSearchParams]
  );

  return {
    searchParams,
    page,
    pageSize,
    sortField,
    sortType,
    pagination,
    sorting,
    stringFilters,
    updateQueryParams,
  };
}