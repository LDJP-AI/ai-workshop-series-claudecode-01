import TicketForm from '@/components/tickets/TicketForm';
import Card from '@/components/ui/Card';
import { createTicket } from '@/lib/actions/tickets';

export default function NewTicketPage() {
  return (
    <main className="container mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">新規チケット作成</h1>
        <p className="text-gray-600">新しいチケットを作成してください</p>
      </div>

      <Card className="p-6">
        <TicketForm action={createTicket} />
      </Card>
    </main>
  );
}
