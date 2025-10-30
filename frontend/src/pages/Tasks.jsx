import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios.js';

const statusLabels = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
};

const defaultMeta = {
  total: 0,
  page: 1,
  totalPages: 1,
  limit: 10,
};

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', q: '' });
  const [meta, setMeta] = useState(defaultMeta);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: meta.page,
        limit: meta.limit,
      };

      if (filters.status) {
        params.status = filters.status;
      }

      if (filters.q) {
        params.q = filters.q;
      }

      const response = await api.get('/tasks/my', { params });
      const tasksData = response.data.data.tasks || [];
      const responseMeta = response.data.meta || {};
      const total = responseMeta.total ?? tasksData.length;
      const limitValue = responseMeta.limit ?? params.limit;
      const pageValue = responseMeta.page ?? params.page;
      const computedTotalPages = responseMeta.totalPages ?? Math.ceil(total / limitValue);
      const totalPages = Math.max(computedTotalPages || 1, 1);

      setTasks(tasksData);
      setMeta({
        total,
        page: pageValue,
        totalPages,
        limit: limitValue,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to load tasks');
    } finally {
      setLoading(false);
    }
  }, [filters.status, filters.q, meta.page, meta.limit]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setMeta((prev) => ({ ...prev, page: 1 }));
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleLimitChange = (event) => {
    const value = Number(event.target.value);
    setMeta((prev) => ({ ...prev, limit: value, page: 1 }));
  };

  const handlePageChange = (direction) => {
    setMeta((prev) => {
      const nextPage = direction === 'next' ? prev.page + 1 : prev.page - 1;
      if (nextPage < 1 || nextPage > prev.totalPages) {
        return prev;
      }
      return { ...prev, page: nextPage };
    });
  };

  const handleDelete = async (taskId) => {
    const confirmation = window.confirm('Delete this task?');
    if (!confirmation) {
      return;
    }

    try {
      await api.delete(`/tasks/${taskId}`);
      toast.success('Task deleted');
      await fetchTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to delete task');
    }
  };

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Tasks</h1>
          <p className="page-subtitle">Manage your work by tracking tasks and updating progress.</p>
        </div>
        <Link className="primary-button" to="/tasks/new">
          New Task
        </Link>
      </div>

      <div className="filters">
        <input
          name="q"
          type="search"
          placeholder="Search by title or description"
          value={filters.q}
          onChange={handleFilterChange}
        />
        <select name="status" value={filters.status} onChange={handleFilterChange}>
          <option value="">All Statuses</option>
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <select name="limit" value={meta.limit} onChange={handleLimitChange}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={25}>25</option>
        </select>
      </div>

      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p className="empty-state">
          No tasks found. <Link to="/tasks/new">Create your first task.</Link>
        </p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task._id}>
                  <td>
                    <span className="task-title">{task.title}</span>
                    <p className="task-description">{task.description}</p>
                  </td>
                  <td>
                    <span className={`status-pill status-${task.status}`}>
                      {statusLabels[task.status] || task.status}
                    </span>
                  </td>
                  <td>{task.updatedAt ? new Date(task.updatedAt).toLocaleString() : '-'}</td>
                  <td className="task-actions">
                    <Link className="secondary-button" to={`/tasks/${task._id}`}>
                      Edit
                    </Link>
                    <button className="danger-button" type="button" onClick={() => handleDelete(task._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button type="button" onClick={() => handlePageChange('prev')} disabled={meta.page <= 1}>
              Previous
            </button>
            <span>
              Page {meta.page} of {meta.totalPages}
            </span>
            <button
              type="button"
              onClick={() => handlePageChange('next')}
              disabled={meta.page >= meta.totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
