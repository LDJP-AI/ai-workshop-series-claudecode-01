'use client';

import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer';
import { deleteComment } from '@/lib/actions/tickets';
import { Comment } from '@/types/ticket';

interface TicketCommentsProps {
  comments: Comment[];
  ticketId: number;
}

export default function TicketComments({ comments, ticketId }: TicketCommentsProps) {
  const handleDeleteComment = async (commentId: number) => {
    if (window.confirm('コメントを削除しますか？')) {
      await deleteComment(ticketId.toString(), commentId.toString());
    }
  };

  if (comments.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        <p>コメントがまだありません</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          {/* Comment Header */}
          <div className="mb-3 flex items-center justify-between text-xs text-gray-500">
            <p>
              {new Date(comment.createdAt).toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
            <button
              onClick={() => handleDeleteComment(comment.id)}
              className="text-red-500 hover:text-red-700"
            >
              削除
            </button>
          </div>

          {/* Comment Content */}
          <MarkdownRenderer content={comment.content} />
        </div>
      ))}
    </div>
  );
}
