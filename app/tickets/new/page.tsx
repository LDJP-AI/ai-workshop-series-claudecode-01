import Card from '@/components/ui/Card';
import TicketForm from '@/components/tickets/TicketForm';
import { createTicket } from '@/lib/actions/tickets';

export default function NewTicketPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">新規チケット作成</h1>
        <p className="text-gray-600">新しいチケットを作成してください</p>
      </div>

      <Card className="p-6">
        <TicketForm action={createTicket} />
      </Card>
    </main>
  );
}
