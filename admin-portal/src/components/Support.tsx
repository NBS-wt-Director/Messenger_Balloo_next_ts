'use client';

import { useState, useEffect } from 'react';
import { supportApi, usersApi } from '@/lib/api-client';
import { Headphones, Plus, MessageSquare, Clock, AlertCircle, CheckCircle } from 'lucide-react';

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  userId: string;
  assignedTo?: string;
  resolution?: string;
  createdAt: number;
  processedAt?: number;
}

interface User {
  id: string;
  email: string;
  displayName: string;
  adminRoles?: string[];
}

export function SupportSection() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [staff, setStaff] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');

  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    priority: 'medium',
    userId: ''
  });

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    loadData();
  }, [filterStatus, filterPriority]);

  const loadData = async () => {
    try {
      const [ticketsRes, staffRes] = await Promise.all([
        supportApi.getTickets({ 
          status: filterStatus || undefined,
          priority: filterPriority || undefined
        }),
        supportApi.getStaff()
      ]);
      setTickets(ticketsRes.data.tickets || []);
      setStaff(staffRes.data.staff || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async () => {
    try {
      await supportApi.createTicket(newTicket);
      setShowCreateModal(false);
      setNewTicket({ title: '', description: '', priority: 'medium', userId: '' });
      loadData();
    } catch (error) {
      console.error('Error creating ticket:', error);
    }
  };

  const handleUpdateTicket = async (ticketId: string, updates: any) => {
    try {
      await supportApi.updateTicket(ticketId, updates);
      if (selectedTicket?.id === ticketId) {
        setSelectedTicket({ ...selectedTicket, ...updates });
      }
      loadData();
    } catch (error) {
      console.error('Error updating ticket:', error);
    }
  };

  const handleAddMessage = async () => {
    if (!selectedTicket || !newMessage.trim()) return;
    
    try {
      await supportApi.addMessage(selectedTicket.id, newMessage);
      setNewMessage('');
      loadData();
    } catch (error) {
      console.error('Error adding message:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-slate-400';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open': return <span className="badge" style={{ background: '#3b82f6' }}>Открыт</span>;
      case 'in-progress': return <span className="badge" style={{ background: '#f59e0b' }}>В работе</span>;
      case 'resolved': return <span className="badge" style={{ background: '#22c55e' }}>Решён</span>;
      case 'closed': return <span className="badge" style={{ background: '#64748b' }}>Закрыт</span>;
      default: return <span className="badge">{status}</span>;
    }
  };

  if (loading) {
    return <div className="admin-card">Загрузка...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Техподдержка</h2>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          Создать тикет
        </button>
      </div>

      {/* Filters */}
      <div className="admin-card mb-6">
        <div className="flex gap-4">
          <select 
            className="admin-input"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">Все статусы</option>
            <option value="open">Открытые</option>
            <option value="in-progress">В работе</option>
            <option value="resolved">Решённые</option>
            <option value="closed">Закрытые</option>
          </select>

          <select 
            className="admin-input"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="">Все приоритеты</option>
            <option value="high">Высокий</option>
            <option value="medium">Средний</option>
            <option value="low">Низкий</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tickets List */}
        <div className="admin-card">
          <h3 className="text-lg font-semibold mb-4">Тикеты ({tickets.length})</h3>
          {tickets.length === 0 ? (
            <p className="text-slate-400">Тикетов нет</p>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {tickets.map(ticket => (
                <div 
                  key={ticket.id}
                  className={`p-4 bg-slate-700 rounded-lg cursor-pointer hover:bg-slate-600 ${
                    selectedTicket?.id === ticket.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold">{ticket.title}</h4>
                    {getStatusBadge(ticket.status)}
                  </div>
                  <p className="text-sm text-slate-400 mb-2 line-clamp-2">
                    {ticket.description}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className={getPriorityColor(ticket.priority)}>
                      {ticket.priority === 'high' && <AlertCircle size={14} className="inline mr-1" />}
                      {ticket.priority === 'medium' && <Clock size={14} className="inline mr-1" />}
                      {ticket.priority === 'low' && <CheckCircle size={14} className="inline mr-1" />}
                      {ticket.priority === 'high' ? 'Высокий' : ticket.priority === 'medium' ? 'Средний' : 'Низкий'}
                    </span>
                    {ticket.assignedTo && (
                      <span className="text-slate-400">
                        {staff.find(s => s.id === ticket.assignedTo)?.displayName || 'Не назначен'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ticket Details */}
        <div className="admin-card">
          <h3 className="text-lg font-semibold mb-4">
            {selectedTicket ? selectedTicket.title : 'Выберите тикет'}
          </h3>
          
          {selectedTicket ? (
            <div>
              <div className="mb-4 flex gap-2">
                {getStatusBadge(selectedTicket.status)}
                <span className={getPriorityColor(selectedTicket.priority)}>
                  Приоритет: {selectedTicket.priority}
                </span>
              </div>

              <div className="mb-4 p-3 bg-slate-700 rounded">
                <p className="text-sm text-slate-400 mb-1">Описание</p>
                <p>{selectedTicket.description}</p>
              </div>

              {/* Status Update */}
              <div className="mb-4">
                <p className="text-sm text-slate-400 mb-2">Обновить статус</p>
                <select 
                  className="admin-input mb-2"
                  value={selectedTicket.status}
                  onChange={(e) => handleUpdateTicket(selectedTicket.id, { status: e.target.value })}
                >
                  <option value="open">Открыт</option>
                  <option value="in-progress">В работе</option>
                  <option value="resolved">Решён</option>
                  <option value="closed">Закрыт</option>
                </select>

                <p className="text-sm text-slate-400 mb-2">Назначить исполнителя</p>
                <select 
                  className="admin-input mb-2"
                  value={selectedTicket.assignedTo || ''}
                  onChange={(e) => handleUpdateTicket(selectedTicket.id, { assignedTo: e.target.value })}
                >
                  <option value="">Не назначен</option>
                  {staff.map(s => (
                    <option key={s.id} value={s.id}>{s.displayName}</option>
                  ))}
                </select>

                <p className="text-sm text-slate-400 mb-2">Решение</p>
                <textarea
                  className="admin-input"
                  rows={3}
                  value={selectedTicket.resolution || ''}
                  onChange={(e) => handleUpdateTicket(selectedTicket.id, { resolution: e.target.value })}
                  placeholder="Опишите решение..."
                />
              </div>

              {/* Messages */}
              <div>
                <p className="text-sm text-slate-400 mb-2 flex items-center gap-2">
                  <MessageSquare size={16} />
                  Сообщения
                </p>
                <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
                  <p className="text-xs text-slate-500">История сообщений будет здесь</p>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="admin-input flex-1"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Написать сообщение..."
                    onKeyPress={(e) => e.key === 'Enter' && handleAddMessage()}
                  />
                  <button onClick={handleAddMessage} className="btn-primary">
                    <MessageSquare size={16} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-slate-400">Выберите тикет для просмотра деталей</p>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="admin-card w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Создать тикет</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Заголовок *</label>
                <input
                  type="text"
                  className="admin-input"
                  value={newTicket.title}
                  onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Описание *</label>
                <textarea
                  className="admin-input"
                  rows={4}
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Приоритет</label>
                <select
                  className="admin-input"
                  value={newTicket.priority}
                  onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                >
                  <option value="low">Низкий</option>
                  <option value="medium">Средний</option>
                  <option value="high">Высокий</option>
                </select>
              </div>

              <div className="flex gap-2 pt-4">
                <button 
                  onClick={handleCreateTicket}
                  disabled={!newTicket.title || !newTicket.description}
                  className="btn-primary flex-1"
                >
                  Создать
                </button>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="btn-secondary flex-1"
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
