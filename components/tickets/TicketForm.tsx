'use client';

import { useFormStatus } from 'react-dom';
import { Ticket } from '@/types/ticket';
import { users as dataUsers, labels as dataLabels } from '@/lib/data/tickets';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';

// ユーザー情報（未割り当てオプション付き）
const users = [{ id: '', name: '未割り当て' }, ...dataUsers];

// ラベル情報
const labels = dataLabels;

interface TicketFormProps {
  action: (formData: FormData) => void;
  ticket?: Ticket;
  isLoading?: boolean;
}

function SubmitButton({ isLoading }: { isLoading?: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending || isLoading}>
      {pending ? '保存中...' : isLoading ? '処理中...' : 'チケットを保存'}
    </Button>
  );
}

export default function TicketForm({ action, ticket, isLoading }: TicketFormProps) {
  const isEditing = !!ticket;

  const priorityOptions = [
    { value: 'LOW', label: '低' },
    { value: 'MEDIUM', label: '中' },
    { value: 'HIGH', label: '高' },
  ];

  const assigneeOptions = users.map((user) => ({
    value: user.id,
    label: user.name,
  }));

  const formatDateForInput = (date: Date | undefined | null) => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <form action={action} className="space-y-6">
      <Input
        label="タイトル"
        name="title"
        placeholder="例）ログイン機能のバグ修正"
        defaultValue={ticket?.title || ''}
        required
        minLength={3}
      />

      <Textarea
        label="説明"
        name="description"
        placeholder="チケットの詳細を説明してください..."
        defaultValue={ticket?.description || ''}
        required
        minLength={10}
        rows={6}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="優先度"
          name="priority"
          options={priorityOptions}
          defaultValue={ticket?.priority || 'MEDIUM'}
        />

        <Select
          label="担当者"
          name="assigneeId"
          options={assigneeOptions}
          defaultValue={ticket?.assigneeId || ''}
        />
      </div>

      <Input
        label="期限日"
        name="dueDate"
        type="date"
        defaultValue={formatDateForInput(ticket?.dueDate)}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">ラベル</label>
        <div className="space-y-2">
          {labels.map((label) => {
            const isSelected = ticket?.labels?.some((l) => l.id === label.id) ?? false;
            const colorClasses = {
              red: 'bg-red-600',
              blue: 'bg-blue-600',
              green: 'bg-green-600',
              orange: 'bg-orange-600',
            } as Record<string, string>;
            return (
              <div key={label.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`label-${label.id}`}
                  name={`label-${label.id}`}
                  defaultChecked={isSelected}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer"
                />
                <label
                  htmlFor={`label-${label.id}`}
                  className="ml-2 text-sm text-gray-700 cursor-pointer flex items-center"
                >
                  <span
                    className={`inline-block w-2 h-2 rounded-full mr-2 ${colorClasses[label.color as keyof typeof colorClasses]}`}
                  ></span>
                  {label.name}
                </label>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex gap-4">
        <SubmitButton isLoading={isLoading} />
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            if (isEditing) {
              window.history.back();
            } else {
              window.location.href = '/tickets';
            }
          }}
        >
          キャンセル
        </Button>
      </div>
    </form>
  );
}
