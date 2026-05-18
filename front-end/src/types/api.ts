export interface Rank {
  id: string;
  name: string;
  baseSalary: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  rankId: string;
  rank?: Rank;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  status: string;
  startDate: string;
  endDate: string;
  budget: number;
  assignments?: Assignment[];
  createdAt: string;
  updatedAt: string;
}

export interface Assignment {
  id: string;
  userId: string;
  user?: User;
  projectId: string;
  project?: Project;
  role: string;
  contributionPercentage: number;
  startDate: string;
  endDate: string;
}

export interface Equipment {
  id: string;
  type: string;
  modelName: string;
  serialNumber: string;
  status: string;
  userId?: string;
  user?: User;
}

export interface LeaveRequest {
  id: string;
  userId: string;
  user?: User;
  startDate: string;
  endDate: string;
  type: string;
  status: string;
  reason?: string;
}

export interface SkillSet {
  id: string;
  name: string;
  category: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: string; // 'TODO' | 'IN_PROGRESS' | 'DONE'
  dueDate: string;
  projectId: string;
  project?: Project;
  userId?: string;
  user?: User;
  createdAt: string;
  updatedAt: string;
}
