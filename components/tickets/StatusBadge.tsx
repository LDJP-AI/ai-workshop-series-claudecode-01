import { TicketStatus } from '@/types/ticket';
import Badge from '@/components/ui/Badge';

interface StatusBadgeProps {
  status: TicketStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const variants = {
    OPEN: 'default',
    IN_PROGRESS: 'warning',
    DONE: 'success',
  } as const;

  const labels = {
    OPEN: 'オープン',
    IN_PROGRESS: '進行中',
    DONE: '完了',
  };

  return <Badge variant={variants[status]}>{labels[status]}</Badge>;
}
