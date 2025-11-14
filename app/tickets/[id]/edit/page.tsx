import { notFound } from 'next/navigation';
import Card from '@/components/ui/Card';
import TicketForm from '@/components/tickets/TicketForm';
import { getTicketById } from '@/lib/data/tickets';
import { updateTicket } from '@/lib/actions/tickets';

interface EditTicketPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditTicketPage({ params }: EditTicketPageProps) {
  const { id } = await params;
  const ticket = await getTicketById(id);

  if (!ticket) {
    notFound();
  }

  const updateTicketWithId = updateTicket.bind(null, id);

  return (
    <main className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">チケット編集</h1>
        <p className="text-gray-600">#{ticket.id} {ticket.title}</p>
      </div>

      <Card className="p-6">
        <TicketForm action={updateTicketWithId} ticket={ticket} />
      </Card>
    </main>
  );
}
