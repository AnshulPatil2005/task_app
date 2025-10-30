import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios.js';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    todo: 0,
    in_progress: 0,
    done: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const response = await api.get('/tasks/my', {
          params: { page: 1, limit: 100 },
        });
        const tasks = response.data.data.tasks || [];
        const calculated = tasks.reduce(
          (acc, task) => {
            acc.total += 1;
            const key = ['todo', 'in_progress', 'done'].includes(task.status)
              ? task.status
              : 'todo';
            acc[key] += 1;
            return acc;
          },
          { total: 0, todo: 0, in_progress: 0, done: 0 }
        );
        setStats(calculated);
      } catch (error) {
        toast.error('Unable to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Overview of your productivity at a glance.</p>
        </div>
        <Link className="primary-button" to="/tasks/new">
          Create Task
        </Link>
      </div>
      {loading ? (
        <p>Loading summary...</p>
      ) : (
        <div className="card-grid">
          <div className="card">
            <h2>Total Tasks</h2>
            <p className="card-value">{stats.total}</p>
          </div>
          <div className="card">
            <h2>To Do</h2>
            <p className="card-value">{stats.todo}</p>
          </div>
          <div className="card">
            <h2>In Progress</h2>
            <p className="card-value">{stats.in_progress}</p>
          </div>
          <div className="card">
            <h2>Done</h2>
            <p className="card-value">{stats.done}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
