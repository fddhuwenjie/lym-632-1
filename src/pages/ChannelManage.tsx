import { useState } from 'react';
import { Plus, Edit2, Trash2, Eye, X, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { cn } from '../lib/utils';
import type { Channel } from '../../shared/types';

const mockChannels: (Channel & { today_count: number })[] = [
  { id: 1, name: '微信公众号', type: 'wechat', status: 'active', today_count: 3 },
  { id: 2, name: '微博', type: 'weibo', status: 'active', today_count: 2 },
  { id: 3, name: '抖音', type: 'douyin', status: 'active', today_count: 2 },
  { id: 4, name: '小红书', type: 'xiaohongshu', status: 'active', today_count: 1 },
  { id: 5, name: 'B站', type: 'bilibili', status: 'inactive', today_count: 0 },
];

const channelTypes = [
  { value: 'wechat', label: '微信公众号', color: 'bg-green-500' },
  { value: 'weibo', label: '微博', color: 'bg-red-500' },
  { value: 'douyin', label: '抖音', color: 'bg-pink-500' },
  { value: 'xiaohongshu', label: '小红书', color: 'bg-orange-500' },
  { value: 'bilibili', label: 'B站', color: 'bg-blue-500' },
  { value: 'other', label: '其他', color: 'bg-gray-500' },
];

const getChannelTypeInfo = (type: string) => {
  return channelTypes.find(t => t.value === type) || channelTypes[channelTypes.length - 1];
};

export default function ChannelManage() {
  const [channels, setChannels] = useState(mockChannels);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingChannel, setEditingChannel] = useState<Channel | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [name, setName] = useState('');
  const [type, setType] = useState('wechat');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [config, setConfig] = useState('');

  const handleOpenModal = (channel?: Channel) => {
    if (channel) {
      setEditingChannel(channel);
      setName(channel.name);
      setType(channel.type);
      setStatus(channel.status);
      setConfig(channel.config || '');
    } else {
      setEditingChannel(null);
      setName('');
      setType('wechat');
      setStatus('active');
      setConfig('');
    }
    setShowModal(true);
  };

  const handleOpenDetail = (channel: Channel) => {
    setSelectedChannel(channel);
    setShowDetailModal(true);
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert('请输入渠道名称');
      return;
    }
    if (editingChannel) {
      setChannels(channels.map(c => c.id === editingChannel.id ? { ...c, name, type, status, config } as Channel & { today_count: number } : c));
    } else {
      const newChannel: Channel & { today_count: number } = {
        id: Math.max(...channels.map(c => c.id)) + 1,
        name,
        type,
        status,
        config,
        today_count: 0,
      };
      setChannels([...channels, newChannel]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: number, name: string) => {
    if (confirm(`确定要删除渠道"${name}"吗？`)) {
      setChannels(channels.filter(c => c.id !== id));
    }
  };

  const toggleStatus = (id: number) => {
    setChannels(channels.map(c => c.id === id ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' } : c));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">渠道管理</h1>
            <p className="text-gray-500 mt-1">管理内容发布渠道</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1e3a5f] text-white rounded-lg font-medium hover:bg-[#2d4a6f] transition-colors"
          >
            <Plus className="w-5 h-5" />
            新增渠道
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {channels.map((channel) => {
            const typeInfo = getChannelTypeInfo(channel.type);
            return (
              <div
                key={channel.id}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', typeInfo.color)}>
                      <span className="text-white font-bold text-lg">{channel.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{channel.name}</h3>
                      <p className="text-sm text-gray-500">{typeInfo.label}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleStatus(channel.id)}
                    className={cn(
                      'p-1.5 rounded-lg transition-colors',
                      channel.status === 'active' ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'
                    )}
                    title={channel.status === 'active' ? '已启用，点击停用' : '已停用，点击启用'}
                  >
                    {channel.status === 'active' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                  </button>
                </div>

                <div className="flex items-center gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">今日排期</span>
                  </div>
                  <span className="ml-auto text-xl font-bold text-[#1e3a5f]">{channel.today_count}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={cn(
                    'px-2.5 py-1 rounded-md text-xs font-medium flex-1 text-center',
                    channel.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  )}>
                    {channel.status === 'active' ? '已启用' : '已停用'}
                  </span>
                  <button
                    onClick={() => handleOpenDetail(channel)}
                    className="p-2 rounded-lg text-gray-500 hover:text-[#1e3a5f] hover:bg-[#1e3a5f]/5 transition-colors"
                    title="查看详情"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOpenModal(channel)}
                    className="p-2 rounded-lg text-gray-500 hover:text-[#1e3a5f] hover:bg-[#1e3a5f]/5 transition-colors"
                    title="编辑"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(channel.id, channel.name)}
                    className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="删除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6 animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingChannel ? '编辑渠道' : '新增渠道'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">渠道名称</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="请输入渠道名称"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-[#1e3a5f] transition-all outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">渠道类型</label>
                <div className="grid grid-cols-3 gap-2">
                  {channelTypes.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setType(t.value)}
                      className={cn(
                        'px-3 py-2 rounded-lg text-sm font-medium transition-all border-2',
                        type === t.value
                          ? 'border-[#1e3a5f] bg-[#1e3a5f]/5 text-[#1e3a5f]'
                          : 'border-transparent bg-gray-100 text-gray-600 hover:bg-gray-200'
                      )}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">状态</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStatus('active')}
                    className={cn(
                      'flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 border-2',
                      status === 'active'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 bg-gray-50 text-gray-600'
                    )}
                  >
                    <CheckCircle className="w-4 h-4" />
                    启用
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('inactive')}
                    className={cn(
                      'flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 border-2',
                      status === 'inactive'
                        ? 'border-gray-500 bg-gray-100 text-gray-700'
                        : 'border-gray-200 bg-gray-50 text-gray-600'
                    )}
                  >
                    <XCircle className="w-4 h-4" />
                    停用
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">配置信息（可选）</label>
                <textarea
                  value={config}
                  onChange={(e) => setConfig(e.target.value)}
                  placeholder="请输入渠道配置信息，如API密钥等..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-[#1e3a5f] transition-all outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 px-4 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                disabled={!name.trim()}
                className={cn(
                  'flex-1 py-2.5 px-4 rounded-lg font-medium text-white transition-all',
                  'bg-[#1e3a5f] hover:bg-[#2d4a6f]',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              >
                {editingChannel ? '保存修改' : '添加'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDetailModal && selectedChannel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6 animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">渠道详情</h3>
              <button onClick={() => setShowDetailModal(false)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className={cn('w-14 h-14 rounded-xl flex items-center justify-center', getChannelTypeInfo(selectedChannel.type).color)}>
                  <span className="text-white font-bold text-xl">{selectedChannel.name.charAt(0)}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-lg">{selectedChannel.name}</h4>
                  <p className="text-sm text-gray-500">{getChannelTypeInfo(selectedChannel.type).label}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">状态</p>
                  <span className={cn(
                    'px-2.5 py-1 rounded-md text-xs font-medium',
                    selectedChannel.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  )}>
                    {selectedChannel.status === 'active' ? '已启用' : '已停用'}
                  </span>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">今日排期</p>
                  <p className="text-2xl font-bold text-[#1e3a5f]">{channels.find(c => c.id === selectedChannel.id)?.today_count || 0}</p>
                </div>
              </div>

              {selectedChannel.config && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-2">配置信息</p>
                  <p className="text-gray-700 text-sm font-mono break-all">{selectedChannel.config}</p>
                </div>
              )}
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setShowDetailModal(false)}
                className="flex-1 py-2.5 px-4 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                关闭
              </button>
              <button
                onClick={() => { setShowDetailModal(false); handleOpenModal(selectedChannel); }}
                className="flex-1 py-2.5 px-4 rounded-lg font-medium bg-[#1e3a5f] text-white hover:bg-[#2d4a6f] transition-colors"
              >
                编辑渠道
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
