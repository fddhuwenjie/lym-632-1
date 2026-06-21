import { get, post } from '../utils/request';
import type {
  Content,
  ReviewRecord,
  PaginationResult,
  PaginationParams,
} from '../types';

export const getReviewQueue = (params?: PaginationParams & { [key: string]: string | number | boolean | undefined }): Promise<PaginationResult<Content>> => {
  return get<PaginationResult<Content>>('/review/queue', params);
};

export const approveContent = (id: number, opinion: string): Promise<ReviewRecord> => {
  return post<ReviewRecord>(`/review/${id}/approve`, { opinion });
};

export const rejectContent = (id: number, opinion: string): Promise<ReviewRecord> => {
  return post<ReviewRecord>(`/review/${id}/reject`, { opinion });
};
