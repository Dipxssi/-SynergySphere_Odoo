import Task from '../models/Task';
import Project from '../models/Project';
import { Types } from 'mongoose';

export const taskService = {
  async getProjectTasks(projectId: string, userId: string) {
    // Verify user has access to the project
    const project = await Project.findOne({
      _id: projectId,
      $or: [
        { owner: userId },
        { 'members.user': userId }
      ]
    });

    if (!project) {
      throw new Error('Project not found or access denied');
    }

    return await Task.find({ project: projectId })
      .populate('assignee', 'firstName lastName email avatar')
      .populate('createdBy', 'firstName lastName email avatar')
      .populate('comments.user', 'firstName lastName email avatar')
      .sort({ createdAt: -1 });
  },

  async getTask(taskId: string, userId: string) {
    const task = await Task.findById(taskId)
      .populate('project')
      .populate('assignee', 'firstName lastName email avatar')
      .populate('createdBy', 'firstName lastName email avatar')
      .populate('comments.user', 'firstName lastName email avatar');

    if (!task) {
      throw new Error('Task not found');
    }

    // Check if user has access to the project
    const project = await Project.findOne({
      _id: task.project,
      $or: [
        { owner: userId },
        { 'members.user': userId }
      ]
    });

    if (!project) {
      throw new Error('Access denied');
    }

    return task;
  },

  async createTask(taskData: any) {
    // Verify user has access to the project
    const project = await Project.findOne({
      _id: taskData.project,
      $or: [
        { owner: taskData.createdBy },
        { 'members.user': taskData.createdBy }
      ]
    });

    if (!project) {
      throw new Error('Project not found or access denied');
    }

    const task = new Task(taskData);
    await task.save();

    // Update project task stats
    await this.updateProjectTaskStats(taskData.project);

    return await Task.findById(task._id)
      .populate('assignee', 'firstName lastName email avatar')
      .populate('createdBy', 'firstName lastName email avatar')
      .populate('project', 'name');
  },

  async updateTask(taskId: string, updateData: any, userId: string) {
    const task = await Task.findById(taskId).populate('project');
    
    if (!task) {
      throw new Error('Task not found');
    }

    // Check if user has access to the project
    const project = await Project.findOne({
      _id: task.project,
      $or: [
        { owner: userId },
        { 'members.user': userId }
      ]
    });

    if (!project) {
      throw new Error('Access denied');
    }

    const oldStatus = task.status;
    Object.assign(task, updateData);
    await task.save();

    // Update project stats if status changed
    if (oldStatus !== task.status) {
      await this.updateProjectTaskStats(task.project._id.toString());
    }

    return await Task.findById(task._id)
      .populate('assignee', 'firstName lastName email avatar')
      .populate('createdBy', 'firstName lastName email avatar')
      .populate('project', 'name');
  },

  async deleteTask(taskId: string, userId: string) {
    const task = await Task.findById(taskId).populate('project');
    
    if (!task) {
      throw new Error('Task not found');
    }

    // Check if user has access (owner or creator)
    const project = await Project.findOne({
      _id: task.project,
      $or: [
        { owner: userId },
        { 'members.user': userId, 'members.role': { $in: ['owner', 'admin'] } }
      ]
    });

    if (!project && task.createdBy.toString() !== userId) {
      throw new Error('Access denied');
    }

    await Task.findByIdAndDelete(taskId);
    
    // Update project task stats
    await this.updateProjectTaskStats(task.project._id.toString());
  },

  async addComment(taskId: string, message: string, userId: string) {
    const task = await Task.findById(taskId);
    
    if (!task) {
      throw new Error('Task not found');
    }

    // Check if user has access to the project
    const project = await Project.findOne({
      _id: task.project,
      $or: [
        { owner: userId },
        { 'members.user': userId }
      ]
    });

    if (!project) {
      throw new Error('Access denied');
    }

    // Fix the comment push issue
    task.comments.push({
      user: new Types.ObjectId(userId),  // Convert to ObjectId
      message,
      createdAt: new Date()
    } as any);  // Type assertion to avoid strict typing issues

    await task.save();

    return await Task.findById(task._id)
      .populate('assignee', 'firstName lastName email avatar')
      .populate('createdBy', 'firstName lastName email avatar')
      .populate('comments.user', 'firstName lastName email avatar');
  },

  async updateProjectTaskStats(projectId: string) {
    const stats = await Task.aggregate([
      { $match: { project: new Types.ObjectId(projectId) } },  // Convert to ObjectId
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const taskStats = {
      total: 0,
      todo: 0,
      inProgress: 0,
      review: 0,
      done: 0
    };

    stats.forEach(stat => {
      taskStats.total += stat.count;
      switch (stat._id) {
        case 'todo':
          taskStats.todo = stat.count;
          break;
        case 'in_progress':
          taskStats.inProgress = stat.count;
          break;
        case 'review':
          taskStats.review = stat.count;
          break;
        case 'done':
          taskStats.done = stat.count;
          break;
      }
    });

    await Project.findByIdAndUpdate(projectId, { taskStats });
  }
};
