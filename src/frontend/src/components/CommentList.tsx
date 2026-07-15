import React, { useState, useMemo } from 'react';

import { Button, TextArea } from './common';
import { Comment, User } from '../types';

import './CommentList.css';

const dateFormatter = new Intl.DateTimeFormat('en-AU', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

interface CommentListProps {
  comments: Comment[];
  users: User[];
  onAddComment?: (message: string) => void;
  loading?: boolean;
}

export const CommentList: React.FC<CommentListProps> = ({
  comments,
  users,
  onAddComment,
  loading = false,
}) => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const userMap = useMemo(
    () => new Map(users.map((u) => [u.id, u.name])),
    [users],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setError('Comment message is required');
      return;
    }
    setError('');
    onAddComment?.(message);
    setMessage('');
  };

  return (
    <div className="comment-list">
      <h3 className="comment-list__title">
        Comments ({comments.length})
      </h3>

      <div className="comment-list__items">
        {comments.length === 0 && (
          <p className="comment-list__empty">No comments yet.</p>
        )}
        {comments.map((comment) => (
          <div key={comment.id} className="comment-item">
            <div className="comment-item__header">
              <span className="comment-item__author">{userMap.get(comment.createdBy) || 'Unknown User'}</span>
              <time className="comment-item__time" dateTime={comment.createdAt}>
                {dateFormatter.format(new Date(comment.createdAt))}
              </time>
            </div>
            <p className="comment-item__message">{comment.message}</p>
          </div>
        ))}
      </div>

      {onAddComment && (
        <form className="comment-list__form" onSubmit={handleSubmit}>
          <TextArea
            label="Add a comment"
            placeholder="Write your comment..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            error={error}
            rows={3}
          />
          <Button type="submit" size="sm" loading={loading}>
            Add Comment
          </Button>
        </form>
      )}
    </div>
  );
};
