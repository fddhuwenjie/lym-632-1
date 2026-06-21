import { get } from '../utils/request';
import type {
  PublishRecord,
  PaginationResult,
  PaginationParams,
} from '../types';

export const getPublishRecords = (params?: PaginationParams & { [key: string]: string | number | boolean | undefined }): Promise<PaginationResult<PublishRecord>> => {
  return get<PaginationResult<PublishRecord>>('/publish', params);
};
