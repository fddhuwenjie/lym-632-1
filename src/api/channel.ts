import { get, post, put, del } from '../utils/request';
import type { Channel } from '../types';

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
