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
    OPEN: 'Open',
    IN_PROGRESS: 'In Progress',
    DONE: 'Done',
  };

  return <Badge variant={variants[status]}>{labels[status]}</Badge>;
}
