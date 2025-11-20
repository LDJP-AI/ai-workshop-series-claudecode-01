'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import { Label, Ticket, User } from '@/types/ticket';

interface TicketFormProps {
  action: (formData: FormData) => void;
  ticket?: Ticket;
  isLoading?: boolean;
  users?: User[];
  labels?: Label[];
}

function SubmitButton({ isLoading }: { isLoading?: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending || isLoading}>
      {pending ? '保存中...' : isLoading ? '処理中...' : 'チケットを保存'}
    </Button>
  );
}

export default function TicketForm({
  action,
  ticket,
  isLoading,
  users = [],
  labels = [],
}: TicketFormProps) {
  const isEditing = !!ticket;
  const [description, setDescription] = useState(ticket?.description || '');

  const priorityOptions = [
    { value: 'LOW', label: '低' },
    { value: 'MEDIUM', label: '中' },
    { value: 'HIGH', label: '高' },
  ];

  const usersWithUnassigned = [
    { id: 0, name: '未割り当て', email: '', createdAt: new Date(), updatedAt: new Date() },
    ...users,
  ];

  const assigneeOptions = usersWithUnassigned.map((user) => ({
    value: user.id === 0 ? '' : user.id.toString(),
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <Textarea
            label="説明"
            name="description"
            placeholder="チケットの詳細を説明してください...（マークダウン形式対応）"
            value={description}
            onChange={(e) => setDescription(e.currentTarget.value)}
            required
            minLength={10}
            rows={8}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">プレビュー</label>
          <div className="max-h-96 overflow-y-auto rounded border border-gray-200 bg-gray-50 p-4">
            {description ? (
              <MarkdownRenderer content={description} />
            ) : (
              <p className="text-sm text-gray-400">説明を入力するとプレビューが表示されます</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
        <label className="mb-3 block text-sm font-medium text-gray-700">ラベル</label>
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
                  className="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600"
                />
                <label
                  htmlFor={`label-${label.id}`}
                  className="ml-2 flex cursor-pointer items-center text-sm text-gray-700"
                >
                  <span
                    className={`mr-2 inline-block h-2 w-2 rounded-full ${colorClasses[label.color as keyof typeof colorClasses]}`}
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
