import axios from 'axios';
import { format } from 'date-fns';

import api from '@/lib/axios';

import {
  type CreateVendorSubmissionPayload,
  CreateVendorSubmissionResponseSchema,
  type VendorFilterParams,
  VendorSubmissionListResponseSchema,
  type VendorSubmissionQueryOptions,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

const publicApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const formatDateParam = (date: Date) => format(date, 'yyyy-MM-dd');

export const createVendorSubmission = async (payload: CreateVendorSubmissionPayload) => {
  const { data } = await publicApi.post('/vendors', payload);
  return CreateVendorSubmissionResponseSchema.parse(data);
};

export const getVendorSubmissions = async (
  filters: VendorFilterParams,
  options: VendorSubmissionQueryOptions = {}
) => {
  const from = filters.dateRange?.from;
  const to = filters.dateRange?.to ?? from;

  const { data } = await api.get('/vendors', {
    params: {
      page: options.page ?? 1,
      limit: options.limit ?? 10,
      ...(filters.search.trim() ? { q: filters.search.trim() } : {}),
      ...(from ? { from: formatDateParam(from) } : {}),
      ...(to ? { to: formatDateParam(to) } : {}),
    },
  });

  return VendorSubmissionListResponseSchema.parse(data);
};
