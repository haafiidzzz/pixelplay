import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { leaderboardService } from '../services/leaderboardService';
import './Leaderboard.css';

const Leaderboard = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await leaderboardService.getTopUsers(100);
      if (error) throw error;
      setLeaderboard(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getMedal = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return null;
  };

  const getAvatarUrl = (avatar_url, username) => {
    if (avatar_url) return avatar_url;
    return `https://placehold.co/80x80/4EC5C1/ffffff?text=${(username || 'U').charAt(0).toUpperCase()}`;
  };

  return (
    <div className="leaderboard-page">
      <div className="leaderboard-header">
        <h1 className="leaderboard-title">🏆 LEADERBOARD 🏆</h1>
        <p className="leaderboard-subtitle">Top 100 PixelPlay Players</p>
      </div>

      {loading && (
        <div className="leaderboard-state">
          <p>Loading leaderboard...</p>
        </div>
      )}

      {error && (
        <div className="leaderboard-state error">
          <p>❌ Error: {error}</p>
          <button onClick={fetchLeaderboard} className="retry-btn">RETRY</button>
        </div>
      )}

      {!loading && !error && leaderboard.length === 0 && (
        <div className="leaderboard-state empty">
          <p className="empty-icon">🎮</p>
          <p className="empty-title">No Players Yet</p>
          <p className="empty-text">
            Be the first to claim the top spot!
          </p>
        </div>
      )}

      {!loading && !error && leaderboard.length > 0 && (
        <div className="leaderboard-list">
          {leaderboard.map((player, index) => {
            const rank = index + 1;
            const medal = getMedal(rank);
            const isCurrentUser = user?.id === player.id;
            const isTop3 = rank <= 3;

            return (
              <div
                key={player.id}
                className={`leaderboard-item ${isCurrentUser ? 'current-user' : ''} ${isTop3 ? 'top-three' : ''}`}
              >
                <div className="rank-section">
                  {medal ? (
                    <span className="medal">{medal}</span>
                  ) : (
                    <span className="rank-number">#{rank}</span>
                  )}
                </div>

                <div className="avatar-section">
                  <img
                    src={getAvatarUrl(player.avatar_url, player.username)}
                    alt={player.username}
                    className="user-avatar"
                  />
                </div>

                <div className="user-info">
                  <div className="user-name">
                    {player.display_name || player.username}
                    {isCurrentUser && <span className="you-badge">YOU</span>}
                  </div>
                  <div className="user-username">@{player.username}</div>
                </div>

                <div className="points-section">
                  <span className="points-value">
                    {(player.score || 0).toLocaleString()}
                  </span>
                  <span className="points-label">PTS</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Leaderboard;