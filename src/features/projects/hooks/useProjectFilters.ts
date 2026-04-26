import { useEffect, useMemo, useState } from 'react';
import type { DateRange } from 'react-day-picker';

import type { ProjectFilterParams } from '../api';
import { useTableQueryState } from './useTableQueryState';

const INITIAL_FILTERS: ProjectFilterParams = {
  search: '',
  title: '',
  dateRange: undefined,
  fiscalYear: '',
  procurementType: [],
  status: [],
  urgentStatus: [],
  units: [],
  myTasks: false,
};

const ARRAY_FILTER_KEYS = [
  'procurementType',
  'status',
  'urgentStatus',
  'assignees',
  'departments',
  'units',
] as const;

const FILTER_PARAM_KEYS = [
  'search',
  'title',
  'fiscalYear',
  'dateFrom',
  'dateTo',
  'myTasks',
  ...ARRAY_FILTER_KEYS,
] as const;

const parseDateRange = (searchParams: URLSearchParams): DateRange | undefined => {
  const dateFrom = searchParams.get('dateFrom');
  const dateTo = searchParams.get('dateTo');

  if (!dateFrom && !dateTo) return undefined;

  return {
    from: dateFrom ? new Date(dateFrom) : undefined,
    to: dateTo ? new Date(dateTo) : undefined,
  };
};

const parseProjectFilters = (searchParams: URLSearchParams): ProjectFilterParams => {
  const nextFilters: ProjectFilterParams = {
    search: searchParams.get('search') ?? '',
    title: searchParams.get('title') ?? '',
    dateRange: parseDateRange(searchParams),
    fiscalYear: searchParams.get('fiscalYear') ?? '',
    procurementType: searchParams.getAll('procurementType'),
    status: searchParams.getAll('status'),
    urgentStatus: searchParams.getAll('urgentStatus'),
    assignees: searchParams.getAll('assignees'),
    departments: searchParams.getAll('departments'),
    units: searchParams.getAll('units'),
    myTasks: searchParams.get('myTasks') === 'true',
  };

  return nextFilters;
};

const serializeProjectFilters = (filters: ProjectFilterParams) => {
  const serialized: Record<string, string | string[] | boolean | null> = {
    search: filters.search || null,
    title: filters.title || null,
    fiscalYear: filters.fiscalYear || null,
    procurementType: filters.procurementType?.length ? filters.procurementType : null,
    status: filters.status?.length ? filters.status : null,
    urgentStatus: filters.urgentStatus?.length ? filters.urgentStatus : null,
    assignees: filters.assignees?.length ? filters.assignees : null,
    departments: filters.departments?.length ? filters.departments : null,
    units: filters.units?.length ? filters.units : null,
    myTasks: filters.myTasks || null,
    dateFrom: filters.dateRange?.from ? filters.dateRange.from.toISOString() : null,
    dateTo: filters.dateRange?.to ? filters.dateRange.to.toISOString() : null,
  };

  return serialized;
};

export function useProjectFilters() {
  const { searchParams, updateQueryParams } = useTableQueryState();

  const appliedFilters = useMemo(() => parseProjectFilters(searchParams), [searchParams]);

  const [tempFilters, setTempFilters] = useState<ProjectFilterParams>(appliedFilters);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(appliedFilters.search ?? '');

  useEffect(() => {
    setTempFilters(appliedFilters);
  }, [appliedFilters]);

  useEffect(() => {
    setSearchQuery(appliedFilters.search ?? '');
  }, [appliedFilters.search]);

  const handleGlobalSearch = () => {
    updateQueryParams(
      {
        search: searchQuery || null,
      },
      { resetPage: true }
    );
  };

  const handleApplyFilter = () => {
    updateQueryParams(serializeProjectFilters(tempFilters), { resetPage: true });
    setIsFilterOpen(false);
  };

  const handleResetFilter = () => {
    setTempFilters(INITIAL_FILTERS);
    setSearchQuery('');
    updateQueryParams(
      Object.fromEntries(FILTER_PARAM_KEYS.map((key) => [key, null])) as Record<string, null>,
      { resetPage: true }
    );
  };

  return {
    filters: appliedFilters,
    tempFilters,
    setTempFilters,
    searchQuery,
    setSearchQuery,
    isFilterOpen,
    setIsFilterOpen,
    handleGlobalSearch,
    handleApplyFilter,
    handleResetFilter,
  };
}
