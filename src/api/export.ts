import { get, post } from '../utils/request';
import type {
  ExportRecord,
  PaginationResult,
  PaginationParams,
} from '../types';

export const exportPublishRecords = (filters: any): Promise<ExportRecord> => {
  return post<ExportRecord>('/export/publish', filters);
};

export const getExportRecords = (params?: PaginationParams & { [key: string]: any }): Promise<PaginationResult<ExportRecord>> => {
  return get<PaginationResult<ExportRecord>>('/export', params);
};

export const downloadExport = (filename: string): void => {
  window.open(`/api/export/download/${filename}`, '_blank');
};
