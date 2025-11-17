import { Ticket } from '@/types/ticket';
import TicketCard from './TicketCard';

interface TicketListProps {
  tickets: Ticket[];
}

export default function TicketList({ tickets }: TicketListProps) {
  if (tickets.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg text-gray-500">チケットがありません</p>
        <p className="mt-2 text-sm text-gray-400">新しいチケットを作成してください</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tickets.map((ticket) => (
        <TicketCard key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
}
