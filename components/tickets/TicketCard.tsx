import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import { Ticket } from '@/types/ticket';
import { CalendarIcon, ChatBubbleLeftIcon, UserIcon } from '@heroicons/react/24/outline';
import { ExclamationCircleIcon as ExclamationCircleSolid } from '@heroicons/react/24/solid';
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
      <Card className="cursor-pointer p-4">
        <div className="mb-2 flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-lg font-semibold text-gray-900">
              #{ticket.id} {ticket.title}
            </h3>
          </div>
          <StatusBadge status={ticket.status} />
        </div>

        <p className="mb-3 line-clamp-2 text-sm text-gray-600">{ticket.description}</p>

        <div className="mb-3 flex flex-wrap gap-2">
          {ticket.labels.map((ticketLabel) => (
            <Badge key={ticketLabel.id} variant="primary">
              {ticketLabel.label.name}
            </Badge>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            {ticket.priority === 'HIGH' && (
              <ExclamationCircleSolid className="h-5 w-5 text-red-600" />
            )}
            {ticket.priority === 'MEDIUM' && (
              <ExclamationCircleSolid className="h-5 w-5 text-yellow-600" />
            )}
            {ticket.priority === 'LOW' && (
              <ExclamationCircleSolid className="h-5 w-5 text-gray-600" />
            )}
            <span className={`font-medium ${priorityColors[ticket.priority]}`}>
              {getPriorityLabel(ticket.priority)}
            </span>
          </div>

          {ticket.assignee && (
            <span className="flex items-center gap-1 text-gray-600">
              <UserIcon className="h-4 w-4" />
              <span>@{ticket.assignee.name}</span>
            </span>
          )}

          {ticket.dueDate && (
            <span
              className={`flex items-center gap-1 ${isOverdue ? 'font-medium text-red-600' : ''}`}
            >
              <CalendarIcon className="h-4 w-4" />
              <span>
                {new Date(ticket.dueDate).toLocaleDateString('ja-JP')}
                {isOverdue && ' (期限切れ)'}
              </span>
            </span>
          )}
        </div>

        {ticket.comments.length > 0 && (
          <div className="mt-3 flex items-center gap-1 border-t border-gray-200 pt-3 text-xs text-gray-500">
            <ChatBubbleLeftIcon className="h-4 w-4" />
            <span>{ticket.comments.length} コメント</span>
          </div>
        )}
      </Card>
    </Link>
  );
}
