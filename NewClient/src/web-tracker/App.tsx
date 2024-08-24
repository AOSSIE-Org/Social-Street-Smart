import { useEffect, useState } from 'react';
import './App.css';

interface Activity {
  domain: string;
  time: number;
}

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const fetchData = () => {
      chrome.storage.local.get(null, (items) => {
        const activityList: Activity[] = Object.entries(items).map(([domain, time]) => ({
          domain,
          time: Math.round(Number(time) / 1000), // Convert to seconds
        }));
        setActivities(activityList.sort((a, b) => b.time - a.time));
      });
    };

    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="App">
      <h1>Web Activity Tracker</h1>
      <ul className="activity-list">
        {activities.map((activity) => (
          <li key={activity.domain} className="activity-item">
            <span className="domain">{activity.domain}</span>
            <span className="time">{formatTime(activity.time)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
