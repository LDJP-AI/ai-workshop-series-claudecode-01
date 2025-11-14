import { notFound } from 'next/navigation';
import { getTicketById } from '@/lib/data/tickets';
import TicketDetail from '@/components/tickets/TicketDetail';

interface TicketPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TicketPage({ params }: TicketPageProps) {
  const { id } = await params;
  const ticket = await getTicketById(id);

  if (!ticket) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <TicketDetail ticket={ticket} />
    </main>
  );
}
