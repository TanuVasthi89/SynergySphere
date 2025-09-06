import { useState } from "react";

export interface Comment {
  id: string;
  author: string;
  message: string;
  timestamp: string;
  parentId?: string;
}

interface CommentsProps {
  comments: Comment[];
  onAdd: (message: string, parentId?: string) => void;
  currentUser: string;
}

export function Comments({ comments, onAdd, currentUser }: CommentsProps) {
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent, parentId?: string) => {
    e.preventDefault();
    if (input.trim()) {
      onAdd(input, parentId);
      setInput("");
      setReplyTo(null);
    }
  };

  // Recursive render for threaded comments
  const renderComments = (parentId?: string) => (
    <ul className="space-y-2">
      {comments.filter(c => c.parentId === parentId).map(comment => (
        <li key={comment.id} className="border rounded p-2 bg-muted">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold">{comment.author}</span>
            <span className="text-xs text-muted-foreground">{new Date(comment.timestamp).toLocaleString()}</span>
          </div>
          <div className="mb-1">{comment.message}</div>
          <div className="flex gap-2">
            <button className="text-xs text-primary underline" onClick={() => setReplyTo(comment.id)}>Reply</button>
          </div>
          {replyTo === comment.id && (
            <form onSubmit={e => handleSubmit(e, comment.id)} className="mt-2 flex gap-2">
              <input
                className="flex-1 border rounded px-2 py-1"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Write a reply..."
                required
              />
              <button type="submit" className="text-xs px-2 py-1 bg-primary text-white rounded">Send</button>
            </form>
          )}
          {/* Render replies */}
          {renderComments(comment.id)}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="space-y-4">
      <form onSubmit={e => handleSubmit(e)} className="flex gap-2">
        <input
          className="flex-1 border rounded px-2 py-1"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Write a comment..."
          required
        />
        <button type="submit" className="text-xs px-2 py-1 bg-primary text-white rounded">Send</button>
      </form>
      {renderComments()}
    </div>
  );
}
