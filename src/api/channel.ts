import { get, post, put, del } from '../utils/request';
import type { Channel } from '../types';

export const getChannelList = (): Promise<Channel[]> => {
  return get<Channel[]>('/channel');
};

export const getChannelStatus = (): Promise<any[]> => {
  return get<any[]>('/channel/status');
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
