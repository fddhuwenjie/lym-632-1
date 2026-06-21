import { useState } from 'react';
import { Download, Filter, FileText, CheckCircle, XCircle, Clock, AlertCircle, Calendar, ChevronDown, AlertTriangle, Activity, RefreshCw, Wrench, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';
import type { PublishRecord, PublishStatus, Schedule, Content, Channel, FailureReview, ChannelHealth } from '../../shared/types';

const mockChannels: Channel[] = [
  { id: 1, name: '微信公众号', type: 'wechat', status: 'active' },
  { id: 2, name: '微博', type: 'weibo', status: 'active' },
  { id: 3, name: '抖音', type: 'douyin', status: 'active' },
  { id: 4, name: '小红书', type: 'xiaohongshu', status: 'active' },
];

const mockPublishRecords: (PublishRecord & { schedule?: Schedule & { content?: Content; channel?: Channel } })[] = [
  { id: 1, schedule_id: 1, status: 'success', publish_time: '2024-01-15 14:05', created_at: '2024-01-15 10:00', schedule: { id: 1, content_id: 1, channel_id: 1, schedule_time: '2024-01-15 14:00', status: 'published', created_at: '', updated_at: '', content: { id: 1, title: '年度总结报告', type: 'article' } as Content, channel: mockChannels[0] } },
  { id: 2, schedule_id: 2, status: 'success', publish_time: '2024-01-15 15:32', created_at: '2024-01-15 10:00', schedule: { id: 2, content_id: 2, channel_id: 2, schedule_time: '2024-01-15 15:30', status: 'published', created_at: '', updated_at: '', content: { id: 2, title: '新品介绍视频', type: 'video' } as Content, channel: mockChannels[1] } },
  { id: 3, schedule_id: 3, status: 'failed', created_at: '2024-01-15 10:00', schedule: { id: 3, content_id: 3, channel_id: 3, schedule_time: '2024-01-15 18:00', status: 'scheduled', created_at: '', updated_at: '', content: { id: 3, title: '促销活动海报', type: 'poster' } as Content, channel: mockChannels[2] } },
  { id: 4, schedule_id: 4, status: 'withdrawn', withdraw_reason: '内容需要调整', publish_time: '2024-01-15 20:00', created_at: '2024-01-15 10:00', schedule: { id: 4, content_id: 4, channel_id: 4, schedule_time: '2024-01-15 20:00', status: 'withdrawn', created_at: '', updated_at: '', content: { id: 4, title: '用户故事分享', type: 'article' } as Content, channel: mockChannels[3] } },
  { id: 5, schedule_id: 5, status: 'pending', created_at: '2024-01-14 10:00', schedule: { id: 5, content_id: 5, channel_id: 1, schedule_time: '2024-01-16 10:00', status: 'scheduled', created_at: '', updated_at: '', content: { id: 5, title: '品牌日活动宣传', type: 'video' } as Content, channel: mockChannels[0] } },
];

const statusOptions: { value: PublishStatus | 'all'; label: string; color: string; icon: typeof Clock }[] = [
  { value: 'all', label: '全部状态', color: 'bg-gray-100 text-gray-700', icon: Clock },
  { value: 'pending', label: '待发布', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  { value: 'success', label: '发布成功', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  { value: 'failed', label: '发布失败', color: 'bg-red-100 text-red-700', icon: XCircle },
  { value: 'withdrawn', label: '已撤回', color: 'bg-orange-100 text-orange-700', icon: AlertCircle },
];

const mockFailureReviews: FailureReview[] = [
  { id: 1, publish_record_id: 3, schedule_id: 3, handler_id: null, conclusion: null, action_type: null, status: 'pending', created_at: '2024-01-15 18:05', resolved_at: null },
];

const mockChannelHealthMap: Record<number, { success_rate: number; rate_limit_status: string; responsible_person: string | null }> = {
  1: { success_rate: 0.95, rate_limit_status: 'normal', responsible_person: '张三' },
  2: { success_rate: 0.72, rate_limit_status: 'limited', responsible_person: '李四' },
  3: { success_rate: 0.35, rate_limit_status: 'blocked', responsible_person: '王五' },
  4: { success_rate: 0.88, rate_limit_status: 'normal', responsible_person: '赵六' },
};

const channelColors: Record<number, string> = {
  1: 'bg-green-500',
  2: 'bg-red-500',
  3: 'bg-pink-500',
  4: 'bg-orange-500',
};

export default function PublishRecords() {
  const [statusFilter, setStatusFilter] = useState<PublishStatus | 'all'>('all');
  const [channelFilter, setChannelFilter] = useState<number | 'all'>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showChannelDropdown, setShowChannelDropdown] = useState(false);
  const [showFailureReviewModal, setShowFailureReviewModal] = useState(false);
  const [selectedFailureReview, setSelectedFailureReview] = useState<FailureReview | null>(null);
  const [reviewConclusion, setReviewConclusion] = useState('');
  const [reviewActionType, setReviewActionType] = useState<'republish' | 'manual_publish'>('republish');

  const filteredRecords = mockPublishRecords.filter(item => {
    const matchStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchChannel = channelFilter === 'all' || item.schedule?.channel_id === channelFilter;
    let matchDate = true;
    if (startDate && item.publish_time) {
      matchDate = matchDate && item.publish_time >= startDate;
    }
    if (endDate && item.publish_time) {
      matchDate = matchDate && item.publish_time <= endDate + ' 23:59:59';
    }
    return matchStatus && matchChannel && matchDate;
  });

  const handleExport = () => {
    alert('导出CSV功能已触发，正在生成导出文件...');
  };

  const getStatusInfo = (status: PublishStatus) => {
    return statusOptions.find(s => s.value === status) || statusOptions[0];
  };

  const selectedStatusInfo = statusOptions.find(s => s.value === statusFilter) || statusOptions[0];
  const selectedChannelName = channelFilter === 'all' ? '全部渠道' : mockChannels.find(c => c.id === channelFilter)?.name;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">发布记录</h1>
            <p className="text-gray-500 mt-1">查看内容发布历史记录</p>
          </div>
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1e3a5f] text-white rounded-lg font-medium hover:bg-[#2d4a6f] transition-colors"
          >
            <Download className="w-5 h-5" />
            导出CSV
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex flex-wrap gap-3 lg:flex-1">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-[#1e3a5f] transition-all outline-none text-sm"
                />
                <span className="text-gray-400">至</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-[#1e3a5f] transition-all outline-none text-sm"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => { setShowStatusDropdown(!showStatusDropdown); setShowChannelDropdown(false); }}
                  className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  <Filter className="w-4 h-4 text-gray-500" />
                  <span className={cn('w-2 h-2 rounded-full', selectedStatusInfo.color.split(' ')[0])} />
                  <span className="font-medium text-gray-900">{selectedStatusInfo.label}</span>
                  <ChevronDown className={cn('w-4 h-4 text-gray-400 transition-transform', showStatusDropdown && 'rotate-180')} />
                </button>
                {showStatusDropdown && (
                  <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[140px]">
                    {statusOptions.map(opt => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => { setStatusFilter(opt.value); setShowStatusDropdown(false); }}
                        className={cn(
                          'w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-2',
                          statusFilter === opt.value && 'bg-[#1e3a5f]/5 text-[#1e3a5f]'
                        )}
                      >
                        <span className={cn('w-2 h-2 rounded-full', opt.color.split(' ')[0])} />
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => { setShowChannelDropdown(!showChannelDropdown); setShowStatusDropdown(false); }}
                  className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  <Filter className="w-4 h-4 text-gray-500" />
                  {typeof channelFilter === 'number' && <span className={cn('w-2 h-2 rounded-full', channelColors[channelFilter])} />}
                  <span className="font-medium text-gray-900">{selectedChannelName}</span>
                  <ChevronDown className={cn('w-4 h-4 text-gray-400 transition-transform', showChannelDropdown && 'rotate-180')} />
                </button>
                {showChannelDropdown && (
                  <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[140px]">
                    <button
                      type="button"
                      onClick={() => { setChannelFilter('all'); setShowChannelDropdown(false); }}
                      className={cn(
                        'w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors',
                        channelFilter === 'all' && 'bg-[#1e3a5f]/5 text-[#1e3a5f]'
                      )}
                    >
                      全部渠道
                    </button>
                    {mockChannels.map(channel => (
                      <button
                        key={channel.id}
                        type="button"
                        onClick={() => { setChannelFilter(channel.id); setShowChannelDropdown(false); }}
                        className={cn(
                          'w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-2',
                          channelFilter === channel.id && 'bg-[#1e3a5f]/5 text-[#1e3a5f]'
                        )}
                      >
                        <span className={cn('w-2 h-2 rounded-full', channelColors[channel.id])} />
                        {channel.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">内容标题</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">渠道</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">渠道健康</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden sm:table-cell">排期时间</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">发布状态</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">发布时间</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden lg:table-cell">撤回原因</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRecords.map((item) => {
                  const statusInfo = getStatusInfo(item.status);
                  const StatusIcon = statusInfo.icon;
                  return (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900 font-medium truncate max-w-xs">{item.schedule?.content?.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={cn('w-2 h-2 rounded-full', channelColors[item.schedule?.channel_id || 1])} />
                          <span className="text-gray-700">{item.schedule?.channel?.name}</span>
                        </div>
                      </td>
                      {(() => {
                        const health = mockChannelHealthMap[item.schedule?.channel_id || 0];
                        if (!health) return <td className="px-6 py-4 hidden md:table-cell">-</td>;
                        const healthDotColor = health.success_rate >= 0.8 ? 'bg-green-500' : health.success_rate >= 0.5 ? 'bg-yellow-500' : 'bg-red-500';
                        const healthTextColor = health.success_rate >= 0.8 ? 'text-green-700' : health.success_rate >= 0.5 ? 'text-yellow-700' : 'text-red-700';
                        const rateLimitBadgeClass = health.rate_limit_status === 'limited' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700';
                        return (
                          <td className="px-6 py-4 hidden md:table-cell">
                            <div className="flex items-center gap-2">
                              <span className={cn('w-2 h-2 rounded-full', healthDotColor)} />
                              <span className={cn('text-sm font-medium', healthTextColor)}>{(health.success_rate * 100).toFixed(0)}%</span>
                              {health.rate_limit_status !== 'normal' && (
                                <span className={cn('px-1.5 py-0.5 rounded text-xs', rateLimitBadgeClass)}>
                                  {health.rate_limit_status === 'limited' ? '限流' : '阻断'}
                                </span>
                              )}
                            </div>
                          </td>
                        );
                      })()}
                      <td className="px-6 py-4 text-gray-500 text-sm hidden sm:table-cell">{item.schedule?.schedule_time}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={cn('px-2.5 py-1 rounded-md text-xs font-medium inline-flex items-center gap-1.5', statusInfo.color)}>
                            <StatusIcon className="w-3.5 h-3.5" />
                            {statusInfo.label}
                          </span>
                          {item.status === 'failed' && (() => {
                            const review = mockFailureReviews.find(r => r.publish_record_id === item.id);
                            if (!review) return null;
                            return (
                              <button
                                onClick={() => { setSelectedFailureReview(review); setShowFailureReviewModal(true); setReviewConclusion(''); setReviewActionType('republish'); }}
                                className={cn(
                                  'px-1.5 py-0.5 rounded text-xs font-medium inline-flex items-center gap-1 cursor-pointer',
                                  review.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                                )}
                              >
                                {review.status === 'pending' ? (
                                  <><AlertTriangle className="w-3 h-3" />待复盘</>
                                ) : (
                                  <><CheckCircle className="w-3 h-3" />已复盘</>
                                )}
                              </button>
                            );
                          })()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-sm hidden md:table-cell">{item.publish_time || '-'}</td>
                      <td className="px-6 py-4 text-gray-500 text-sm hidden lg:table-cell">
                        <span className={cn('max-w-xs truncate block', item.withdraw_reason ? 'text-orange-600' : 'text-gray-400')}>
                          {item.withdraw_reason || '-'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {filteredRecords.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                      <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>暂无发布记录</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showFailureReviewModal && selectedFailureReview && (() => {
          const record = mockPublishRecords.find(r => r.id === selectedFailureReview.publish_record_id);
          return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowFailureReviewModal(false)}>
              <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <h2 className="text-lg font-semibold text-gray-900">失败复盘</h2>
                  </div>
                  <button onClick={() => setShowFailureReviewModal(false)} className="text-gray-400 hover:text-gray-600">
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500">内容标题:</span>
                      <span className="text-gray-900 font-medium">{record?.schedule?.content?.title}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500">渠道:</span>
                      <span className="text-gray-900">{record?.schedule?.channel?.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500">复盘状态:</span>
                      <span className={cn('px-2 py-0.5 rounded text-xs font-medium', selectedFailureReview.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700')}>
                        {selectedFailureReview.status === 'pending' ? '待复盘' : '已复盘'}
                      </span>
                    </div>
                  </div>
                  {selectedFailureReview.status === 'pending' ? (
                    <div className="space-y-4 border-t border-gray-100 pt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">复盘结论</label>
                        <textarea
                          value={reviewConclusion}
                          onChange={(e) => setReviewConclusion(e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-[#1e3a5f] outline-none text-sm"
                          placeholder="请输入复盘结论..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">处理方式</label>
                        <select
                          value={reviewActionType}
                          onChange={(e) => setReviewActionType(e.target.value as 'republish' | 'manual_publish')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-[#1e3a5f] outline-none text-sm"
                        >
                          <option value="republish">重新发布</option>
                          <option value="manual_publish">转人工发布</option>
                        </select>
                      </div>
                      <button
                        onClick={() => {
                          if (!reviewConclusion.trim()) { alert('请输入复盘结论'); return; }
                          alert(`复盘已提交：结论="${reviewConclusion}"，处理方式="${reviewActionType === 'republish' ? '重新发布' : '转人工发布'}"`);
                          setShowFailureReviewModal(false);
                        }}
                        className="w-full px-4 py-2.5 bg-[#1e3a5f] text-white rounded-lg font-medium hover:bg-[#2d4a6f] transition-colors inline-flex items-center justify-center gap-2"
                      >
                        <ArrowRight className="w-4 h-4" />
                        提交复盘
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3 border-t border-gray-100 pt-4">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-500">复盘结论:</span>
                        <span className="text-gray-900">{selectedFailureReview.conclusion}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-500">处理方式:</span>
                        <span className="text-gray-900">{selectedFailureReview.action_type === 'republish' ? '重新发布' : '转人工发布'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-500">处理人:</span>
                        <span className="text-gray-900">{selectedFailureReview.handler_id ?? '-'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-500">处理时间:</span>
                        <span className="text-gray-900">{selectedFailureReview.resolved_at ?? '-'}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
