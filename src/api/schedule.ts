import { get, post, put } from '../utils/request';
import type {
  Schedule,
  SubmitScheduleRequest,
  UpdateScheduleRequest,
  PaginationResult,
  PaginationParams,
} from '../types';

export const getScheduleList = (params?: PaginationParams & { [key: string]: string | number | boolean | undefined }): Promise<PaginationResult<Schedule>> => {
  return get<PaginationResult<Schedule>>('/schedule', params);
};

export const getScheduleCalendar = (startDate: string, endDate: string): Promise<Schedule[]> => {
  return get<Schedule[]>('/schedule/calendar', { startDate, endDate });
};

export const createSchedule = (data: SubmitScheduleRequest & { content_id: number }): Promise<Schedule> => {
  return post<Schedule>('/schedule', data);
};

export const updateSchedule = (id: number, data: UpdateScheduleRequest): Promise<Schedule> => {
  return put<Schedule>(`/schedule/${id}`, data);
};

export const withdrawSchedule = (id: number, reason: string): Promise<Schedule> => {
  return post<Schedule>(`/schedule/${id}/withdraw`, { reason });
};
