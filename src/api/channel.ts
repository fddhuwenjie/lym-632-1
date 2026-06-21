import { get, post, put, del } from '../utils/request';
import type { Channel, ChannelHealth, ScheduleRiskWarning } from '../types';

export const getChannelList = (): Promise<Channel[]> => {
  return get<Channel[]>('/channel');
};

export interface ChannelStatus {
  channel_id: number;
  channel_name: string;
  total_count: number;
  success_count: number;
  failed_count: number;
  pending_count: number;
}

export const getChannelStatus = (): Promise<ChannelStatus[]> => {
  return get<ChannelStatus[]>('/channel/status');
};

export const addChannel = (data: Partial<Channel>): Promise<Channel> => {
  return post<Channel>('/channel', data);
};

export const updateChannel = (id: number, data: Partial<Channel>): Promise<Channel> => {
  return put<Channel>(`/channel/${id}`, data);
};

export const deleteChannel = (id: number): Promise<void> => {
  return del<void>(`/channel/${id}`);
};

export const getChannelHealthList = (): Promise<ChannelHealth[]> => {
  return get<ChannelHealth[]>('/channel/health');
};

export const getChannelHealth = (channelId: number): Promise<ChannelHealth> => {
  return get<ChannelHealth>(`/channel/${channelId}/health`);
};

export const updateChannelHealth = (channelId: number, data: {
  success_rate?: number;
  last_failure_reason?: string;
  rate_limit_status?: string;
  responsible_person?: string;
}): Promise<ChannelHealth> => {
  return put<ChannelHealth>(`/channel/${channelId}/health`, data);
};

export const refreshChannelHealth = (channelId: number): Promise<ChannelHealth> => {
  return post<ChannelHealth>(`/channel/${channelId}/health/refresh`);
};

export const getHighRiskChannels = (): Promise<ScheduleRiskWarning[]> => {
  return get<ScheduleRiskWarning[]>('/channel/risk/high');
};
