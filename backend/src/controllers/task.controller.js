import Task from '../models/Task.js';
import { sendSuccess, sendError } from '../utils/httpResponses.js';

const parsePagination = (page = 1, limit = 10) => {
  const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
  const limitNumber = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
  const skip = (pageNumber - 1) * limitNumber;
  return { page: pageNumber, limit: limitNumber, skip };
};

const buildFilter = ({ owner, status, q }) => {
  const filter = {};
  if (owner) {
    filter.owner = owner;
  }
  if (status) {
    filter.status = status;
  }
  if (q) {
    filter.$or = [
      { title: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
    ];
  }
  return filter;
};

export const createTask = async (req, res, next) => {
  try {
    const { title, description, status } = req.body;

    const task = await Task.create({
      title,
      description,
      status,
      owner: req.user.id,
    });

    await task.populate('owner', 'name email role');

    return sendSuccess(res, 201, 'Task created successfully', { task });
  } catch (error) {
    return next(error);
  }
};

export const getMyTasks = async (req, res, next) => {
  try {
    const { status, q, page, limit } = req.query;
    const pagination = parsePagination(page, limit);
    const filter = buildFilter({ owner: req.user.id, status, q });

    const [tasks, total] = await Promise.all([
      Task.find(filter)
        .sort({ updatedAt: -1 })
        .skip(pagination.skip)
        .limit(pagination.limit)
        .lean(),
      Task.countDocuments(filter),
    ]);

    const meta = {
      total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.max(Math.ceil(total / pagination.limit), 1),
    };

    return sendSuccess(res, 200, 'Tasks retrieved successfully', { tasks }, meta);
  } catch (error) {
    return next(error);
  }
};

export const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate('owner', 'name email role');

    if (!task) {
      return sendError(res, 404, 'Task not found', { id: 'Task does not exist' });
    }

    const isOwner =
      task.owner && task.owner._id
        ? task.owner._id.toString() === req.user.id
        : task.owner.toString() === req.user.id;

    if (!isOwner && req.user.role !== 'admin') {
      return sendError(res, 403, 'Forbidden', { owner: 'You do not own this task' });
    }

    return sendSuccess(res, 200, 'Task retrieved successfully', { task });
  } catch (error) {
    return next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return sendError(res, 404, 'Task not found', { id: 'Task does not exist' });
    }

    const isOwner = task.owner.toString() === req.user.id;
    if (!isOwner && req.user.role !== 'admin') {
      return sendError(res, 403, 'Forbidden', { owner: 'You do not own this task' });
    }

    const updatableFields = ['title', 'description', 'status'];
    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        task[field] = req.body[field];
      }
    });

    await task.save();
    await task.populate('owner', 'name email role');

    return sendSuccess(res, 200, 'Task updated successfully', { task });
  } catch (error) {
    return next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return sendError(res, 404, 'Task not found', { id: 'Task does not exist' });
    }

    const isOwner = task.owner.toString() === req.user.id;
    if (!isOwner && req.user.role !== 'admin') {
      return sendError(res, 403, 'Forbidden', { owner: 'You do not own this task' });
    }

    await task.deleteOne();

    return sendSuccess(res, 200, 'Task deleted successfully', {});
  } catch (error) {
    return next(error);
  }
};

export const getAllTasksAdmin = async (req, res, next) => {
  try {
    const { status, q, page, limit } = req.query;
    const pagination = parsePagination(page, limit);
    const filter = buildFilter({ status, q });

    const [tasks, total] = await Promise.all([
      Task.find(filter)
        .populate('owner', 'name email role')
        .sort({ updatedAt: -1 })
        .skip(pagination.skip)
        .limit(pagination.limit)
        .lean(),
      Task.countDocuments(filter),
    ]);

    const meta = {
      total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.max(Math.ceil(total / pagination.limit), 1),
    };

    return sendSuccess(res, 200, 'All tasks retrieved successfully', { tasks }, meta);
  } catch (error) {
    return next(error);
  }
};
