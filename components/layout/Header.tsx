import Link from 'next/link';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import Button from '@/components/ui/Button';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <CheckCircleIcon className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900 hidden sm:inline">Ticket Manager</span>
        </Link>

        <nav className="flex items-center gap-4">
          <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
            ダッシュボード
          </Link>
          <Link href="/tickets" className="text-gray-600 hover:text-gray-900 transition-colors">
            チケット一覧
          </Link>
          <Link href="/tickets/new">
            <Button size="sm">新規チケット作成</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
