import Link from 'next/link';
import { searchTickets } from '@/lib/data/tickets';
import { TicketStatus } from '@/types/ticket';
import Button from '@/components/ui/Button';
import TicketList from '@/components/tickets/TicketList';
import TicketFilters from '@/components/tickets/TicketFilters';

interface TicketsPageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    sort?: string;
  }>;
}

export default async function TicketsPage({ searchParams }: TicketsPageProps) {
  const params = await searchParams;
  const searchQuery = params.search || '';
  const status = params.status ? (params.status as TicketStatus) : undefined;
  const sortBy = params.sort || 'created';

  const tickets = await searchTickets(searchQuery, status, sortBy);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">チケット一覧</h1>
          <p className="text-gray-600 mt-1">全 {tickets.length} 件のチケット</p>
        </div>
        <Link href="/tickets/new">
          <Button>新規チケット作成</Button>
        </Link>
      </div>

      <TicketFilters />

      {tickets.length > 0 ? (
        <TicketList tickets={tickets} />
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">チケットが見つかりません</p>
          <p className="text-gray-400 text-sm mt-2">フィルターを変更してお試しください</p>
        </div>
      )}
    </main>
  );
}
