'use client';

import { Comment } from '@/types/ticket';
import { deleteComment } from '@/lib/actions/tickets';

interface TicketCommentsProps {
  comments: Comment[];
  ticketId: string;
}

export default function TicketComments({
  comments,
  ticketId,
}: TicketCommentsProps) {
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
        <div
          key={comment.id}
          className="border border-gray-200 rounded-lg p-4 bg-gray-50"
        >
          {/* Comment Header */}
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="font-semibold text-gray-900">{comment.author.name}</p>
              <p className="text-sm text-gray-500">{comment.author.email}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">
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
                className="text-xs text-red-500 hover:text-red-700 mt-1"
              >
                削除
              </button>
            </div>
          </div>

          {/* Comment Content */}
          <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
        </div>
      ))}
    </div>
  );
}
