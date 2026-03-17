import { useState, useEffect } from "react";
import { useGroupBuyApi } from "../hooks/useGroupBuyApi";
import type { GroupbuyPost } from "../types";

interface Props {
  onClose: () => void;
}

export default function HistoryPanel({ onClose }: Props) {
  const [posts, setPosts] = useState<GroupbuyPost[]>([]);
  const { listPosts, deletePost } = useGroupBuyApi();

  useEffect(() => {
    listPosts().then(setPosts);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async (id: number) => {
    await deletePost(id);
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="history-overlay" onClick={onClose}>
      <div className="history-panel" onClick={(e) => e.stopPropagation()}>
        <div className="history-header">
          <h3>📋 歷史記錄</h3>
          <button type="button" onClick={onClose}>✕</button>
        </div>
        <div className="history-list">
          {posts.map((post) => (
            <div key={post.id} className="history-item">
              <div className="history-info">
                <strong>{post.product_name}</strong>
                <span className="history-price">{post.group_price}</span>
                <span className="history-date">
                  {new Date(post.created_at).toLocaleDateString("zh-TW")}
                </span>
                <span className={`status-badge ${post.status}`}>{post.status}</span>
              </div>
              <button
                type="button"
                className="delete-btn"
                onClick={() => handleDelete(post.id)}
              >
                🗑️
              </button>
            </div>
          ))}
          {posts.length === 0 && <p className="empty-state">尚無記錄</p>}
        </div>
      </div>
    </div>
  );
}
