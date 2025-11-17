import Link from 'next/link';
import TicketList from '@/components/tickets/TicketList';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { getOverdueTickets, getTicketCount, getTickets } from '@/lib/data/tickets';
import { PlusIcon, TicketIcon } from '@heroicons/react/24/outline';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';

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
        <h1 className="mb-2 text-4xl font-bold text-gray-900">ダッシュボード</h1>
        <p className="text-gray-600">チケット管理システムへようこそ</p>
      </div>

      {/* 統計カード */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="p-6">
          <div className="text-center">
            <div className="mb-2 text-3xl font-bold text-blue-600">{counts.OPEN}</div>
            <p className="text-gray-600">オープン</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-center">
            <div className="mb-2 text-3xl font-bold text-yellow-600">{counts.IN_PROGRESS}</div>
            <p className="text-gray-600">進行中</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-center">
            <div className="mb-2 text-3xl font-bold text-green-600">{counts.DONE}</div>
            <p className="text-gray-600">完了</p>
          </div>
        </Card>
      </div>

      {/* 期限切れ警告 */}
      {overdueTickets.length > 0 && (
        <Card className="mb-8 border-red-200 bg-red-50 p-4">
          <div className="flex items-center gap-3">
            <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-900">期限切れのチケット</h3>
              <p className="text-sm text-red-700">
                {overdueTickets.length} 件のチケットが期限を過ぎています
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* 最近のチケット */}
      <div className="mb-8">
        <div className="mb-6 flex items-center justify-between">
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
            <p className="text-lg text-gray-500">チケットがありません</p>
            <Link href="/tickets/new" className="mt-4 inline-block">
              <Button>最初のチケットを作成</Button>
            </Link>
          </Card>
        )}
      </div>

      {/* クイックリンク */}
      <Card className="p-6">
        <h2 className="mb-4 text-xl font-bold text-gray-900">クイックリンク</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/tickets">
            <Button variant="secondary" size="sm" className="flex items-center gap-1">
              <TicketIcon className="h-4 w-4" />
              <span>すべてのチケット</span>
            </Button>
          </Link>
          <Link href="/tickets/new">
            <Button size="sm" className="flex items-center gap-1">
              <PlusIcon className="h-4 w-4" />
              <span>新規チケット作成</span>
            </Button>
          </Link>
        </div>
      </Card>
    </main>
  );
}
