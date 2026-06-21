import React, { useState } from 'react';
import { Eye, Check, X, FileText, Video, Image, AlertTriangle } from 'lucide-react';
import { cn } from '../lib/utils';
import type { Content, ContentType } from '../../shared/types';

const mockPendingContents: Content[] = [
  { id: 1, title: '2024年度产品发布会预告', type: 'article', status: 'pending_review', created_at: '2024-01-15 10:30', creator_id: 1, content: '', scan_version: 1, updated_at: '2024-01-15 10:30' },
  { id: 2, title: '新品上市短视频宣传', type: 'video', status: 'pending_review', created_at: '2024-01-15 09:15', creator_id: 1, content: '', scan_version: 1, updated_at: '2024-01-15 09:15' },
  { id: 3, title: '春节活动海报设计', type: 'poster', status: 'pending_review', created_at: '2024-01-14 16:45', creator_id: 1, content: '', scan_version: 1, updated_at: '2024-01-14 16:45' },
  { id: 4, title: '客户案例分享文章', type: 'article', status: 'pending_review', created_at: '2024-01-14 14:20', creator_id: 1, content: '', scan_version: 1, updated_at: '2024-01-14 14:20' },
  { id: 5, title: '品牌日活动宣传视频', type: 'video', status: 'pending_review', created_at: '2024-01-14 11:00', creator_id: 1, content: '', scan_version: 1, updated_at: '2024-01-14 11:00' },
];

const sensitiveHitCounts: Record<number, number> = {
  1: 2, 2: 0, 3: 1, 4: 3, 5: 0,
};

const typeIcons: Record<ContentType, typeof FileText> = {
  article: FileText,
  video: Video,
  poster: Image,
};

const typeLabels: Record<ContentType, string> = {
  article: '文章',
  video: '视频',
  poster: '海报',
};

const typeColors: Record<ContentType, string> = {
  article: 'bg-blue-100 text-blue-700',
  video: 'bg-purple-100 text-purple-700',
  poster: 'bg-orange-100 text-orange-700',
};

export default function ReviewQueue() {
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewType, setReviewType] = useState<'approve' | 'reject'>('approve');
  const [opinion, setOpinion] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const handleOpenReview = (content: Content, type: 'approve' | 'reject') => {
    setSelectedContent(content);
    setReviewType(type);
    setOpinion('');
    setShowReviewModal(true);
  };

  const handleSubmitReview = async () => {
    if (reviewType === 'reject' && !opinion.trim()) {
      alert('驳回意见不能为空');
      return;
    }
    setSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setSubmitting(false);
    setShowReviewModal(false);
    alert(`已${reviewType === 'approve' ? '通过' : '驳回'}：${selectedContent?.title}`);
  };

  const handleViewDetail = (content: Content) => {
    setSelectedContent(content);
    setShowDetailModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">待复核队列</h1>
          <p className="text-gray-500 mt-1">审核待发布的内容</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">标题</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">类型</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">敏感词命中</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">提交时间</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mockPendingContents.map((item) => {
                  const hitCount = sensitiveHitCounts[item.id] || 0;
                  const Icon = typeIcons[item.type];
                  return (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-gray-900 font-medium truncate max-w-xs">{item.title}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn('px-2.5 py-1 rounded-md text-xs font-medium inline-flex items-center gap-1.5', typeColors[item.type])}>
                          <Icon className="w-3.5 h-3.5" />
                          {typeLabels[item.type]}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium',
                          hitCount > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        )}>
                          {hitCount > 0 && <AlertTriangle className="w-3.5 h-3.5" />}
                          {hitCount} 次
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-sm hidden md:table-cell">{item.created_at}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleViewDetail(item)}
                            className="p-2 rounded-lg text-gray-500 hover:text-[#1e3a5f] hover:bg-[#1e3a5f]/5 transition-colors"
                            title="查看详情"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenReview(item, 'approve')}
                            className="p-2 rounded-lg text-gray-500 hover:text-green-600 hover:bg-green-50 transition-colors"
                            title="通过"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenReview(item, 'reject')}
                            className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="驳回"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {mockPendingContents.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                      <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>暂无待复核内容</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showReviewModal && selectedContent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6 animate-scale-in">
            <h3 className={cn(
              'text-lg font-semibold mb-2',
              reviewType === 'approve' ? 'text-green-700' : 'text-red-700'
            )}>
              {reviewType === 'approve' ? '通过审核' : '驳回内容'}
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              {reviewType === 'approve' ? '将通过：' : '将驳回：'}<span className="font-medium text-gray-700">{selectedContent.title}</span>
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {reviewType === 'reject' ? '驳回意见' : '审核意见'}
                {reviewType === 'reject' && <span className="text-red-500"> *</span>}
              </label>
              <textarea
                value={opinion}
                onChange={(e) => setOpinion(e.target.value)}
                placeholder={reviewType === 'reject' ? '请输入驳回原因...' : '请输入审核意见（选填）...'}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-[#1e3a5f] transition-all outline-none resize-none"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowReviewModal(false)}
                className="flex-1 py-2.5 px-4 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={submitting || (reviewType === 'reject' && !opinion.trim())}
                className={cn(
                  'flex-1 py-2.5 px-4 rounded-lg font-medium text-white transition-all flex items-center justify-center gap-2',
                  reviewType === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              >
                {submitting ? '提交中...' : '确认提交'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDetailModal && selectedContent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[80vh] overflow-hidden animate-scale-in">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">内容详情</h3>
              <button onClick={() => setShowDetailModal(false)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="mb-4">
                <span className={cn('px-2.5 py-1 rounded-md text-xs font-medium inline-flex items-center gap-1.5', typeColors[selectedContent.type])}>
                  {React.createElement(typeIcons[selectedContent.type], { className: 'w-3.5 h-3.5' })}
                  {typeLabels[selectedContent.type]}
                </span>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">{selectedContent.title}</h4>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-gray-700 whitespace-pre-wrap">
                  这是内容的预览区域。在实际应用中，这里会显示完整的内容正文。\n\n包含多行内容...
                </p>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <span>提交时间：{selectedContent.created_at}</span>
                <span className="flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" />
                  敏感词命中：{sensitiveHitCounts[selectedContent.id] || 0} 次
                </span>
              </div>
            </div>
            <div className="flex gap-4 p-6 border-t border-gray-200">
              <button
                onClick={() => { setShowDetailModal(false); handleOpenReview(selectedContent, 'reject'); }}
                className="flex-1 py-2.5 px-4 rounded-lg font-medium border border-red-300 text-red-700 hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                驳回
              </button>
              <button
                onClick={() => { setShowDetailModal(false); handleOpenReview(selectedContent, 'approve'); }}
                className="flex-1 py-2.5 px-4 rounded-lg font-medium bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                通过
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scale-in { animation: scale-in 0.2s ease-out; }
      `}</style>
    </div>
  );
}
