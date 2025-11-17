import { notFound } from 'next/navigation';
import TicketDetail from '@/components/tickets/TicketDetail';
import { getTicketById } from '@/lib/data/tickets';

interface TicketPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TicketPage({ params }: TicketPageProps) {
  const { id } = await params;
  const ticket = await getTicketById(parseInt(id, 10));

  if (!ticket) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <TicketDetail ticket={ticket} />
    </main>
  );
}
