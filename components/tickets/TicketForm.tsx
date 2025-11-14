'use client';

import { useFormStatus } from 'react-dom';
import { Ticket } from '@/types/ticket';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';

interface TicketFormProps {
  action: (formData: FormData) => void;
  ticket?: Ticket;
  isLoading?: boolean;
}

function SubmitButton({ isLoading }: { isLoading?: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending || isLoading}>
      {pending ? 'Saving...' : isLoading ? 'Processing...' : 'Save Ticket'}
    </Button>
  );
}

export default function TicketForm({ action, ticket, isLoading }: TicketFormProps) {
  const isEditing = !!ticket;

  const priorityOptions = [
    { value: 'LOW', label: '🟢 Low' },
    { value: 'MEDIUM', label: '🟡 Medium' },
    { value: 'HIGH', label: '🔴 High' },
  ];

  return (
    <form action={action} className="space-y-6">
      <Input
        label="Title"
        name="title"
        placeholder="e.g., Fix login bug"
        defaultValue={ticket?.title || ''}
        required
        minLength={3}
      />

      <Textarea
        label="Description"
        name="description"
        placeholder="Describe the ticket in detail..."
        defaultValue={ticket?.description || ''}
        required
        minLength={10}
        rows={6}
      />

      <Select
        label="Priority"
        name="priority"
        options={priorityOptions}
        defaultValue={ticket?.priority || 'MEDIUM'}
      />

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
          Cancel
        </Button>
      </div>
    </form>
  );
}
