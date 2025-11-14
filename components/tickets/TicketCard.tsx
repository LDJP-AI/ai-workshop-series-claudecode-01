import Link from 'next/link';
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

  const priorityEmoji = {
    LOW: '🟢',
    MEDIUM: '🟡',
    HIGH: '🔴',
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
          <span className={`font-medium ${priorityColors[ticket.priority]}`}>
            {priorityEmoji[ticket.priority]} {ticket.priority}
          </span>

          {ticket.assignee && (
            <span className="text-gray-600">👤 @{ticket.assignee.name}</span>
          )}

          {ticket.dueDate && (
            <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
              📅 {new Date(ticket.dueDate).toLocaleDateString('ja-JP')}
              {isOverdue && ' (期限切れ)'}
            </span>
          )}
        </div>

        {ticket.comments.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
            💬 {ticket.comments.length} コメント
          </div>
        )}
      </Card>
    </Link>
  );
}
