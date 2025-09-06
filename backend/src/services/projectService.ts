import Project from '../models/Project';
import User from '../models/User';
import Task from '../models/Task';

export const projectService = {
  getUserProjects: async (userId: string) => {
    return await Project.find({
      $or: [
        { owner: userId },
        { 'members.user': userId }
      ]
    })
    .populate('owner', 'firstName lastName email avatar')
    .populate('members.user', 'firstName lastName email avatar')
    .sort({ createdAt: -1 });
  },

  getProject: async (projectId: string, userId: string) => {
    const project = await Project.findOne({
      _id: projectId,
      $or: [
        { owner: userId },
        { 'members.user': userId }
      ]
    })
    .populate('owner', 'firstName lastName email avatar')
    .populate('members.user', 'firstName lastName email avatar');

    if (!project) {
      throw new Error('Project not found or access denied');
    }

    return project;
  },

  createProject: async (projectData: any) => {
    const project = new Project({
      ...projectData,
      members: [{ user: projectData.owner, role: 'owner'}]
    });

    await project.save();
    
    return await Project.findById(project._id)
      .populate('owner', 'firstName lastName email avatar')
      .populate('members.user', 'firstName lastName email avatar');
  },

  updateProject: async (projectId: string, updateData: any, userId: string) => {
    const project = await Project.findOne({
      _id: projectId,
      $or: [
        { owner: userId },
        { 'members.user': userId, 'members.role': { $in: ['owner', 'admin'] } }
      ]
    });

    if (!project) {
      throw new Error('Project not found or insufficient permissions');
    }

    Object.assign(project, updateData);
    await project.save();

    return await Project.findById(project._id)
      .populate('owner', 'firstName lastName email avatar')
      .populate('members.user', 'firstName lastName email avatar');
  },

  deleteProject: async (projectId: string, userId: string) => {
    const project = await Project.findOne({
      _id: projectId,
      owner: userId
    });

    if (!project) {
      throw new Error('Project not found or only owner can delete');
    }

    // Delete all tasks in the project
    await Task.deleteMany({ project: projectId });
    
    // Delete the project
    await Project.findByIdAndDelete(projectId);
  },

  addMember: async (projectId: string, email: string, userId: string) => {
    const project = await Project.findOne({
      _id: projectId,
      $or: [
        { owner: userId },
        { 'members.user': userId, 'members.role': { $in: ['owner', 'admin'] } }
      ]
    });

    if (!project) {
      throw new Error('Project not found or insufficient permissions');
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }

    // Check if user is already a member
    const existingMember = project.members.find(
      member => member.user.toString() === user._id.toString()
    );

    if (existingMember) {
      throw new Error('User is already a member of this project');
    }

    project.members.push({ user: user._id, role: 'member', joinedAt: new Date()});
    await project.save();

    return await Project.findById(project._id)
      .populate('owner', 'firstName lastName email avatar')
      .populate('members.user', 'firstName lastName email avatar');
  }
};
