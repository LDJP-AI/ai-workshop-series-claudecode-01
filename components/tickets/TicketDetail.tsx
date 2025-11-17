'use client';

import { Ticket, TicketStatus } from '@/types/ticket';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeftIcon, PencilIcon, TrashIcon, UserIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { ExclamationCircleIcon as ExclamationCircleSolid } from '@heroicons/react/24/solid';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import TicketComments from '@/components/tickets/TicketComments';
import CommentForm from '@/components/tickets/CommentForm';
import { updateTicketStatus, deleteTicket } from '@/lib/actions/tickets';

interface TicketDetailProps {
  ticket: Ticket;
}

export default function TicketDetail({ ticket }: TicketDetailProps) {
  const [status, setStatus] = useState(ticket.status);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      const result = await updateTicketStatus(ticket.id, newStatus as TicketStatus);
      if (!result.error) {
        setStatus(newStatus as TicketStatus);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('このチケットを削除してもよろしいですか？')) return;

    setIsDeleting(true);
    try {
      await deleteTicket(ticket.id);
    } finally {
      setIsDeleting(false);
    }
  };
  const priorityColors = {
    LOW: 'text-gray-600',
    MEDIUM: 'text-yellow-600',
    HIGH: 'text-red-600',
  };

  const getPriorityLabel = (priority: string) => {
    const priorityMap: { [key: string]: string } = {
      LOW: '低',
      MEDIUM: '中',
      HIGH: '高',
    };
    return priorityMap[priority] || priority;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/tickets" className="text-gray-600 hover:text-gray-900 flex items-center gap-1">
            <ArrowLeftIcon className="w-5 h-5" />
            <span>戻る</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            #{ticket.id} {ticket.title}
          </h1>
        </div>
        <div className="flex gap-2">
          <Link href={`/tickets/${ticket.id}/edit`}>
            <Button variant="secondary" size="sm" className="flex items-center gap-1">
              <PencilIcon className="w-4 h-4" />
              <span>編集</span>
            </Button>
          </Link>
          <Button
            variant="danger"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-1"
          >
            <TrashIcon className="w-4 h-4" />
            <span>{isDeleting ? '削除中...' : '削除'}</span>
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">ステータス</h3>
            <Select
              name="status"
              options={[
                { value: 'OPEN', label: 'オープン' },
                { value: 'IN_PROGRESS', label: '進行中' },
                { value: 'DONE', label: '完了' },
              ]}
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={isUpdating}
            />
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">優先度</h3>
            <div className="flex items-center gap-2">
              {ticket.priority === 'HIGH' && (
                <ExclamationCircleSolid className="w-6 h-6 text-red-600" />
              )}
              {ticket.priority === 'MEDIUM' && (
                <ExclamationCircleSolid className="w-6 h-6 text-yellow-600" />
              )}
              {ticket.priority === 'LOW' && (
                <ExclamationCircleSolid className="w-6 h-6 text-gray-600" />
              )}
              <span className={`text-lg font-semibold ${priorityColors[ticket.priority]}`}>
                {getPriorityLabel(ticket.priority)}
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">担当者</h3>
            {ticket.assignee ? (
              <div className="flex items-center gap-2 text-gray-900">
                <UserIcon className="w-5 h-5 text-gray-600" />
                <p>{ticket.assignee.name}</p>
              </div>
            ) : (
              <p className="text-gray-500 italic">未割り当て</p>
            )}
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">期限日</h3>
            {ticket.dueDate ? (
              <div className="flex items-center gap-2 text-gray-900">
                <CalendarIcon className="w-5 h-5 text-gray-600" />
                <p>{new Date(ticket.dueDate).toLocaleDateString('ja-JP')}</p>
              </div>
            ) : (
              <p className="text-gray-500 italic">期限なし</p>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-2">ラベル</h3>
          {ticket.labels.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {ticket.labels.map((label) => (
                <Badge key={label.id} variant="primary">
                  {label.name}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">ラベルなし</p>
          )}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">説明</h2>
        <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
      </Card>

      <Card className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">詳細情報</h2>
        <div className="space-y-2 text-sm text-gray-600">
          <p>
            <span className="font-medium">作成日時:</span>{' '}
            {new Date(ticket.createdAt).toLocaleString('ja-JP')}
          </p>
          <p>
            <span className="font-medium">更新日時:</span>{' '}
            {new Date(ticket.updatedAt).toLocaleString('ja-JP')}
          </p>
          <p>
            <span className="font-medium">コメント数:</span> {ticket.comments.length}
          </p>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          コメント ({ticket.comments.length})
        </h2>
        <TicketComments comments={ticket.comments} ticketId={ticket.id} />
      </Card>

      <Card className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">新規コメント</h2>
        <CommentForm ticketId={ticket.id} />
      </Card>
    </div>
  );
}
