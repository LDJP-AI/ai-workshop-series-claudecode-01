'use client';

import { Comment } from '@/types/ticket';
import { deleteComment } from '@/lib/actions/tickets';

interface TicketCommentsProps {
  comments: Comment[];
  ticketId: string;
}

export default function TicketComments({ comments, ticketId }: TicketCommentsProps) {
  const handleDeleteComment = async (commentId: string) => {
    if (window.confirm('コメントを削除しますか？')) {
      await deleteComment(ticketId, commentId);
    }
  };

  if (comments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>コメントがまだありません</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          {/* Comment Header */}
          <div className="flex justify-between items-center mb-3 text-xs text-gray-500">
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
          <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
        </div>
      ))}
    </div>
  );
}
