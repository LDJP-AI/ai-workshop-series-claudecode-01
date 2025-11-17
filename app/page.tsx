import Link from 'next/link';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import { TicketIcon, PlusIcon } from '@heroicons/react/24/outline';
import { getTickets, getTicketCount, getOverdueTickets } from '@/lib/data/tickets';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import TicketList from '@/components/tickets/TicketList';

export default async function Home() {
  const tickets = await getTickets();
  const counts = await getTicketCount();
  const overdueTickets = await getOverdueTickets();

  // 最近のチケット（作成日時の降順）
  const recentTickets = [...tickets]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">ダッシュボード</h1>
        <p className="text-gray-600">チケット管理システムへようこそ</p>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{counts.OPEN}</div>
            <p className="text-gray-600">オープン</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">{counts.IN_PROGRESS}</div>
            <p className="text-gray-600">進行中</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{counts.DONE}</div>
            <p className="text-gray-600">完了</p>
          </div>
        </Card>
      </div>

      {/* 期限切れ警告 */}
      {overdueTickets.length > 0 && (
        <Card className="p-4 mb-8 border-red-200 bg-red-50">
          <div className="flex items-center gap-3">
            <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-900">期限切れのチケット</h3>
              <p className="text-red-700 text-sm">
                {overdueTickets.length} 件のチケットが期限を過ぎています
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* 最近のチケット */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">最近のチケット</h2>
          <Link href="/tickets">
            <Button variant="secondary" size="sm">
              すべて表示
            </Button>
          </Link>
        </div>

        {recentTickets.length > 0 ? (
          <TicketList tickets={recentTickets} />
        ) : (
          <Card className="p-8 text-center">
            <p className="text-gray-500 text-lg">チケットがありません</p>
            <Link href="/tickets/new" className="inline-block mt-4">
              <Button>最初のチケットを作成</Button>
            </Link>
          </Card>
        )}
      </div>

      {/* クイックリンク */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">クイックリンク</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/tickets">
            <Button variant="secondary" size="sm" className="flex items-center gap-1">
              <TicketIcon className="w-4 h-4" />
              <span>すべてのチケット</span>
            </Button>
          </Link>
          <Link href="/tickets/new">
            <Button size="sm" className="flex items-center gap-1">
              <PlusIcon className="w-4 h-4" />
              <span>新規チケット作成</span>
            </Button>
          </Link>
        </div>
      </Card>
    </main>
  );
}
