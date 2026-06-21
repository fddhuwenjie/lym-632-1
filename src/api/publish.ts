import { get, post } from '../utils/request';
import type {
  PublishRecord,
  FailureReview,
  PaginationResult,
  PaginationParams,
} from '../types';

export const getPublishRecords = (params?: PaginationParams & { [key: string]: string | number | boolean | undefined }): Promise<PaginationResult<PublishRecord>> => {
  return get<PaginationResult<PublishRecord>>('/publish', params);
};

export const getFailureReviews = (params?: PaginationParams & { status?: string }): Promise<PaginationResult<FailureReview>> => {
  return get<PaginationResult<FailureReview>>('/failure-reviews', params as Record<string, string | number | boolean | undefined>);
};

export const resolveFailureReview = (id: number, conclusion: string, actionType: 'republish' | 'manual_publish'): Promise<FailureReview> => {
  return post<FailureReview>(`/failure-reviews/${id}/resolve`, { conclusion, action_type: actionType });
};
