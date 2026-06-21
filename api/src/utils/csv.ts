import Papa from 'papaparse'
import type { PublishRecord } from '../../../shared/types.js'

interface PublishRecordCSV {
  渠道: string
  排期时间: string
  发布状态: string
  撤回原因: string
  发布时间: string
  内容标题: string
  内容类型: string
}

export async function generatePublishRecordsCSV(
  records: PublishRecord[],
): Promise<string> {
  const csvData: PublishRecordCSV[] = records.map((record) => ({
    渠道: record.schedule?.channel?.name || '',
    排期时间: record.schedule?.schedule_time || '',
    发布状态: mapPublishStatus(record.status),
    撤回原因: record.withdraw_reason || '',
    发布时间: record.publish_time || '',
    内容标题: record.schedule?.content?.title || '',
    内容类型: record.schedule?.content?.type || '',
  }))

  return Papa.unparse(csvData, {
    header: true,
  })
}

function mapPublishStatus(status: string): string {
  const statusMap: Record<string, string> = {
    pending: '待发布',
    success: '发布成功',
    failed: '发布失败',
    withdrawn: '已撤回',
  }
  return statusMap[status] || status
}
