import { notFound } from 'next/navigation';
import TicketForm from '@/components/tickets/TicketForm';
import Card from '@/components/ui/Card';
import { updateTicket } from '@/lib/actions/tickets';
import { getTicketById, getUsers, getLabels } from '@/lib/data/tickets';

interface EditTicketPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditTicketPage({ params }: EditTicketPageProps) {
  const { id } = await params;
  const [ticket, users, labels] = await Promise.all([
    getTicketById(parseInt(id, 10)),
    getUsers(),
    getLabels(),
  ]);

  if (!ticket) {
    notFound();
  }

  const updateTicketWithId = updateTicket.bind(null, id);

  return (
    <main className="container mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">チケット編集</h1>
        <p className="text-gray-600">
          #{ticket.id} {ticket.title}
        </p>
      </div>

      <Card className="p-6">
        <TicketForm action={updateTicketWithId} ticket={ticket} users={users} labels={labels} />
      </Card>
    </main>
  );
}
