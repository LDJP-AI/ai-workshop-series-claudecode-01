import Link from 'next/link';
import TicketFilters from '@/components/tickets/TicketFilters';
import TicketList from '@/components/tickets/TicketList';
import Button from '@/components/ui/Button';
import { searchTickets } from '@/lib/data/tickets';

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
  const status = params.status || 'ALL';
  const sort = params.sort || 'created';

  const tickets = await searchTickets(searchQuery, status, sort);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">チケット一覧</h1>
          <p className="mt-1 text-gray-600">全 {tickets.length} 件のチケット</p>
        </div>
        <Link href="/tickets/new">
          <Button>新規チケット作成</Button>
        </Link>
      </div>

      <TicketFilters />

      {tickets.length > 0 ? (
        <TicketList tickets={tickets} />
      ) : (
        <div className="py-12 text-center">
          <p className="text-lg text-gray-500">チケットが見つかりません</p>
          <p className="mt-2 text-sm text-gray-400">フィルターを変更してお試しください</p>
        </div>
      )}
    </main>
  );
}
