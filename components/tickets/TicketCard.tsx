import Link from 'next/link';
import { ExclamationCircleIcon as ExclamationCircleSolid } from '@heroicons/react/24/solid';
import { UserIcon, CalendarIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { Ticket } from '@/types/ticket';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import StatusBadge from './StatusBadge';

interface TicketCardProps {
  ticket: Ticket;
}

export default function TicketCard({ ticket }: TicketCardProps) {
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

  const isOverdue =
    ticket.dueDate && new Date(ticket.dueDate) < new Date() && ticket.status !== 'DONE';

  return (
    <Link href={`/tickets/${ticket.id}`}>
      <Card className="p-4 cursor-pointer">
        <div className="flex justify-between items-start gap-4 mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              #{ticket.id} {ticket.title}
            </h3>
          </div>
          <StatusBadge status={ticket.status} />
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{ticket.description}</p>

        <div className="flex flex-wrap gap-2 mb-3">
          {ticket.labels.map((label) => (
            <Badge key={label.id} variant="primary">
              {label.name}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-3 text-sm text-gray-500 flex-wrap">
          <div className="flex items-center gap-1">
            {ticket.priority === 'HIGH' && (
              <ExclamationCircleSolid className="w-5 h-5 text-red-600" />
            )}
            {ticket.priority === 'MEDIUM' && (
              <ExclamationCircleSolid className="w-5 h-5 text-yellow-600" />
            )}
            {ticket.priority === 'LOW' && (
              <ExclamationCircleSolid className="w-5 h-5 text-gray-600" />
            )}
            <span className={`font-medium ${priorityColors[ticket.priority]}`}>
              {getPriorityLabel(ticket.priority)}
            </span>
          </div>

          {ticket.assignee && (
            <span className="flex items-center gap-1 text-gray-600">
              <UserIcon className="w-4 h-4" />
              <span>@{ticket.assignee.name}</span>
            </span>
          )}

          {ticket.dueDate && (
            <span className={`flex items-center gap-1 ${isOverdue ? 'text-red-600 font-medium' : ''}`}>
              <CalendarIcon className="w-4 h-4" />
              <span>
                {new Date(ticket.dueDate).toLocaleDateString('ja-JP')}
                {isOverdue && ' (期限切れ)'}
              </span>
            </span>
          )}
        </div>

        {ticket.comments.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500 flex items-center gap-1">
            <ChatBubbleLeftIcon className="w-4 h-4" />
            <span>{ticket.comments.length} コメント</span>
          </div>
        )}
      </Card>
    </Link>
  );
}
