import { transaction } from '../db/index.js'
import { createError } from '../types/index.js'
import ScheduleModel from '../models/Schedule.js'
import ContentModel from '../models/Content.js'
import ChannelModel from '../models/Channel.js'
import {
  validateScheduleTime,
  validateDuplicateSchedule,
} from '../utils/validator.js'
import type {
  Schedule,
  ScheduleStatus,
  PaginationParams,
  PaginationResult,
  UpdateScheduleRequest,
} from '../../../shared/types.js'

export async function createSchedule(
  contentId: number,
  data: { channel_id: number; schedule_time: string; status?: ScheduleStatus },
): Promise<Schedule> {
  const content = await ContentModel.findById(contentId)
  if (!content) {
    throw createError('内容不存在', 404, 'CONTENT_NOT_FOUND')
  }

  const channel = await ChannelModel.findById(data.channel_id)
  if (!channel) {
    throw createError('渠道不存在', 404, 'CHANNEL_NOT_FOUND')
  }

  if (channel.status !== 'active') {
    throw createError('渠道未激活', 400, 'CHANNEL_INACTIVE')
  }

  const scheduleTimeValid = await validateScheduleTime(data.schedule_time)
  if (!scheduleTimeValid.valid) {
    throw createError(scheduleTimeValid.error!, 400, 'INVALID_SCHEDULE_TIME')
  }

  const duplicateValid = await validateDuplicateSchedule(
    data.channel_id,
    data.schedule_time,
  )
  if (!duplicateValid.valid) {
    throw createError(duplicateValid.error!, 400, 'DUPLICATE_SCHEDULE')
  }

  return ScheduleModel.create({
    content_id: contentId,
    channel_id: data.channel_id,
    schedule_time: data.schedule_time,
    status: data.status || 'pending',
  })
}

export async function updateSchedule(
  scheduleId: number,
  data: UpdateScheduleRequest,
): Promise<Schedule> {
  const schedule = await ScheduleModel.findById(scheduleId)
  
  if (!schedule) {
    throw createError('排期不存在', 404, 'SCHEDULE_NOT_FOUND')
  }

  if (schedule.status === 'published') {
    throw createError('已发布排期无法修改', 400, 'SCHEDULE_PUBLISHED')
  }

  if (schedule.status === 'withdrawn') {
    throw createError('已撤回排期无法修改', 400, 'SCHEDULE_WITHDRAWN')
  }

  const channelId = data.channel_id ?? schedule.channel_id
  const scheduleTime = data.schedule_time ?? schedule.schedule_time

  if (data.schedule_time) {
    const scheduleTimeValid = await validateScheduleTime(data.schedule_time)
    if (!scheduleTimeValid.valid) {
      throw createError(scheduleTimeValid.error!, 400, 'INVALID_SCHEDULE_TIME')
    }
  }

  const duplicateValid = await validateDuplicateSchedule(
    channelId,
    scheduleTime,
    scheduleId,
  )
  if (!duplicateValid.valid) {
    throw createError(duplicateValid.error!, 400, 'DUPLICATE_SCHEDULE')
  }

  const updatedSchedule = await ScheduleModel.update(scheduleId, {
    channel_id: data.channel_id,
    schedule_time: data.schedule_time,
  })

  if (!updatedSchedule) {
    throw createError('更新排期失败', 500, 'UPDATE_FAILED')
  }

  return updatedSchedule
}

export async function withdrawSchedule(
  scheduleId: number,
  reason: string,
): Promise<Schedule> {
  const schedule = await ScheduleModel.findById(scheduleId)
  
  if (!schedule) {
    throw createError('排期不存在', 404, 'SCHEDULE_NOT_FOUND')
  }

  if (schedule.status === 'published') {
    throw createError('已发布排期无法撤回', 400, 'SCHEDULE_PUBLISHED')
  }

  if (schedule.status === 'withdrawn') {
    throw createError('排期已撤回', 400, 'SCHEDULE_ALREADY_WITHDRAWN')
  }

  if (!reason || reason.trim().length === 0) {
    throw createError('撤回原因不能为空', 400, 'EMPTY_REASON')
  }

  return transaction(async (tx) => {
    const updatedSchedule = await ScheduleModel.update(scheduleId, {
      status: 'withdrawn',
    })

    if (!updatedSchedule) {
      throw createError('撤回排期失败', 500, 'WITHDRAW_FAILED')
    }

    const updateStmt = tx.prepare(`
      UPDATE publish_records
      SET status = 'withdrawn', withdraw_reason = ?
      WHERE schedule_id = ? AND status = 'pending'
    `)
    updateStmt.run(reason, scheduleId)

    return updatedSchedule
  })
}

export async function getScheduleList(
  params?: PaginationParams & {
    status?: string
    channel_id?: number
    content_id?: number
    start_date?: string
    end_date?: string
  },
): Promise<PaginationResult<Schedule>> {
  if (params?.status) {
    return ScheduleModel.findByStatus(params.status as ScheduleStatus, params)
  }

  if (params?.channel_id && params?.start_date && params?.end_date) {
    return ScheduleModel.findByChannelIdAndTimeRange(
      params.channel_id,
      params.start_date,
      params.end_date,
      params,
    )
  }

  if (params?.content_id) {
    return ScheduleModel.findByContentId(params.content_id, params)
  }

  if (params?.start_date && params?.end_date) {
    return ScheduleModel.findByTimeRange(
      params.start_date,
      params.end_date,
      params,
    )
  }

  return ScheduleModel.findAll(params)
}

export async function getScheduleCalendar(
  startDate: string,
  endDate: string,
): Promise<Schedule[]> {
  const result = await ScheduleModel.findByTimeRange(startDate, endDate, {
    page: 1,
    pageSize: 1000,
  })
  return result.items
}

export async function getScheduleDetail(scheduleId: number): Promise<Schedule> {
  const schedule = await ScheduleModel.findById(scheduleId, true)
  
  if (!schedule) {
    throw createError('排期不存在', 404, 'SCHEDULE_NOT_FOUND')
  }

  return schedule
}

export default {
  createSchedule,
  updateSchedule,
  withdrawSchedule,
  getScheduleList,
  getScheduleCalendar,
  getScheduleDetail,
}
