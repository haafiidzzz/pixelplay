import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { achievementService } from '../services/achievementService';
import './Achievements.css';

const Achievements = () => {
  const { user } = useAuth();
  const [allAchievements, setAllAchievements] = useState([]);
  const [unlockedIds, setUnlockedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAchievements();
  }, [user]);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch semua achievements
      const { data: achievements, error: achError } =
        await achievementService.getAllAchievements();
      if (achError) throw achError;
      setAllAchievements(achievements || []);

      // Kalo user login, fetch achievements yang udah di-unlock
      if (user) {
        const { data: userAch, error: userAchError } =
          await achievementService.getUserAchievements(user.id);
        if (userAchError) throw userAchError;

        const unlockedSet = new Set(
          (userAch || []).map((row) => row.achievements?.id)
        );
        setUnlockedIds(unlockedSet);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="achievements-page">
      <div className="achievements-header">
        <h1 className="achievements-title">🎯 ACHIEVEMENTS</h1>
        <p className="achievements-subtitle">
          {user
            ? `Unlock achievements to earn poin & climb the leaderboard`
            : `Sign in to track your progress`}
        </p>
      </div>

      {loading && (
        <div className="achievement-state">
          <p>Loading achievements...</p>
        </div>
      )}

      {error && (
        <div className="achievement-state error">
          <p>❌ Error: {error}</p>
        </div>
      )}

      {!loading && !error && allAchievements.length === 0 && (
        <div className="achievement-state empty">
          <p className="empty-icon">🏅</p>
          <p>No achievements available yet</p>
        </div>
      )}

      {!loading && !error && allAchievements.length > 0 && (
        <div className="achievements-grid">
          {allAchievements.map((ach) => {
            const isUnlocked = unlockedIds.has(ach.id);
            return (
              <div
                key={ach.id}
                className={`achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`}
              >
                <div className="achievement-icon">
                  {ach.icon_url ? (
                    <img src={ach.icon_url} alt={ach.nama} />
                  ) : (
                    <span>{isUnlocked ? '🏆' : '🔒'}</span>
                  )}
                </div>
                <h3 className="achievement-name">{ach.nama}</h3>
                <p className="achievement-desc">{ach.deskripsi}</p>
                <div className="achievement-points">
                  +{ach.poin_reward || 0} PTS
                </div>
                {isUnlocked && (
                  <div className="achievement-badge-unlocked">UNLOCKED ✓</div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};


export default Achievements;