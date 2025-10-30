import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios.js';

const statusOptions = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

const TaskForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(isEdit);
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'todo',
  });

  useEffect(() => {
    if (!isEdit) {
      setInitializing(false);
      return;
    }

    const loadTask = async () => {
      try {
        const response = await api.get(`/tasks/${id}`);
        const task = response.data.data.task;
        setForm({
          title: task.title,
          description: task.description || '',
          status: task.status,
        });
      } catch (error) {
        toast.error(error.response?.data?.message || 'Unable to load task');
        navigate('/tasks');
      } finally {
        setInitializing(false);
      }
    };

    loadTask();
  }, [id, isEdit, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await api.put(`/tasks/${id}`, form);
        toast.success('Task updated');
      } else {
        await api.post('/tasks', form);
        toast.success('Task created');
      }
      navigate('/tasks');
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to save task';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (initializing) {
    return <p>Loading task...</p>;
  }

  return (
    <div className="form-card">
      <h1 className="page-title">{isEdit ? 'Edit Task' : 'Create Task'}</h1>
      <form className="task-form" onSubmit={handleSubmit}>
        <label>
          Title
          <input name="title" value={form.title} onChange={handleChange} required />
        </label>
        <label>
          Description
          <textarea
            name="description"
            rows="5"
            value={form.description}
            onChange={handleChange}
          />
        </label>
        <label>
          Status
          <select name="status" value={form.status} onChange={handleChange}>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <div className="form-actions">
          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? 'Saving...' : isEdit ? 'Update Task' : 'Create Task'}
          </button>
          <button
            type="button"
            className="secondary-button"
            onClick={() => navigate('/tasks')}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
