import Link from 'next/link';
import Button from '@/components/ui/Button';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <CheckCircleIcon className="h-5 w-5 text-white" />
          </div>
          <span className="hidden text-xl font-bold text-gray-900 sm:inline">Ticket Manager</span>
        </Link>

        <nav className="flex items-center gap-4">
          <Link href="/" className="text-gray-600 transition-colors hover:text-gray-900">
            ダッシュボード
          </Link>
          <Link href="/tickets" className="text-gray-600 transition-colors hover:text-gray-900">
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
