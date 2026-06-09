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
  assignments?: Assignment[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectCategory {
  id: string;
  name: string;
}

export interface ProjectSkill {
  id: string;
  projectId: string;
  skillSetId: string;
  skillSet: SkillSet;
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  status: string;
  startDate: string;
  endDate: string;
  totalManMonths?: number;
  price?: number;
  categoryId?: string;
  category?: ProjectCategory;
  requiredSkills?: string[] | ProjectSkill[];
  assignments?: Assignment[];
  tasks?: Task[];
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
  health: number;
  purchaseDate: string;
  userId?: string;
  user?: User;
}

export interface EquipmentSetting {
  id: string;
  type: string;
  usefulLife: number;
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
