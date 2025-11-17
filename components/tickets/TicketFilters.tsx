'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';

export default function TicketFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get('search') || '');
  const isComposingRef = useRef(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const currentStatus = searchParams.get('status') || 'ALL';
  const currentSearch = searchParams.get('search') || '';
  const currentSort = searchParams.get('sort') || 'created';

  // URLの検索パラメータが変更されたときにローカルステートを同期
  useEffect(() => {
    setSearchValue(currentSearch);
  }, [currentSearch]);

  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams(searchParams);
    if (status === 'ALL') {
      params.delete('status');
    } else {
      params.set('status', status);
    }
    router.push(`/tickets?${params.toString()}`);
  };

  const updateSearch = (search: string) => {
    const params = new URLSearchParams(searchParams);
    if (search === '') {
      params.delete('search');
    } else {
      params.set('search', search);
    }
    router.push(`/tickets?${params.toString()}`);
  };

  const handleSearchChange = (search: string) => {
    setSearchValue(search);

    // デバウンス処理：最後のキー入力から500ms後に検索実行
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      if (!isComposingRef.current) {
        updateSearch(search);
      }
    }, 500);
  };

  const handleCompositionStart = () => {
    isComposingRef.current = true;
  };

  const handleCompositionEnd = () => {
    isComposingRef.current = false;
    updateSearch(searchValue);
  };

  const handleSortChange = (sort: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', sort);
    router.push(`/tickets?${params.toString()}`);
  };

  const handleClearFilters = () => {
    router.push('/tickets');
  };

  const hasFilters = currentStatus !== 'ALL' || currentSearch !== '';

  return (
    <div className="space-y-4 mb-6">
      {/* 検索ボックス */}
      <div>
        <Input
          label="検索"
          name="search"
          placeholder="チケットを検索..."
          value={searchValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
        />
      </div>

      {/* フィルターと並べ替え */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ステータスフィルター */}
        <Select
          label="ステータス"
          name="status"
          options={[
            { value: 'ALL', label: 'すべて表示' },
            { value: 'OPEN', label: 'オープン' },
            { value: 'IN_PROGRESS', label: '進行中' },
            { value: 'DONE', label: '完了' },
          ]}
          value={currentStatus}
          onChange={(e) => handleStatusChange(e.target.value)}
        />

        {/* 並べ替え */}
        <Select
          label="並べ替え"
          name="sort"
          options={[
            { value: 'created', label: '作成日（新しい順）' },
            { value: 'created-asc', label: '作成日（古い順）' },
            { value: 'updated', label: '更新日（新しい順）' },
            { value: 'priority', label: '優先度（高い順）' },
          ]}
          value={currentSort}
          onChange={(e) => handleSortChange(e.target.value)}
        />
      </div>

      {/* フィルターリセットボタン */}
      {hasFilters && (
        <div>
          <Button variant="secondary" size="sm" onClick={handleClearFilters}>
            フィルターをリセット
          </Button>
        </div>
      )}

      {/* フィルター状態表示 */}
      {hasFilters && (
        <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
          <span>フィルター適用中:</span>
          {currentStatus !== 'ALL' && (
            <span className="ml-2">
              ステータス: <strong>{currentStatus}</strong>
            </span>
          )}
          {currentSearch && (
            <span className="ml-2">
              検索: <strong>&ldquo;{currentSearch}&rdquo;</strong>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
