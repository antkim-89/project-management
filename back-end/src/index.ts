import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// --- Project API ---

// 1. 전체 프로젝트 조회 (GET /projects)
app.get('/projects', async (req: Request, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        assignments: {
          include: {
            user: true
          }
        }
      }
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// 2. 특정 프로젝트 조회 (GET /projects/:id)
app.get('/projects/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        assignments: {
          include: {
            user: true
          }
        }
      }
    });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// 3. 새 프로젝트 생성 (POST /projects)
app.post('/projects', async (req: Request, res: Response) => {
  const { title, description, startDate, endDate, budget } = req.body;
  try {
    const newProject = await prisma.project.create({
      data: {
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        budget: parseFloat(budget)
      }
    });
    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// 4. 프로젝트 수정 (PUT /projects/:id)
app.put('/projects/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, status, startDate, endDate, budget } = req.body;
  try {
    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        title,
        description,
        status,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        budget: budget ? parseFloat(budget) : undefined
      }
    });
    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// 5. 프로젝트 삭제 (DELETE /projects/:id)
app.delete('/projects/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.project.delete({
      where: { id }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// --- Other API ---

// Basic Route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Project Management API is running' });
});

// Health Check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT} 🛠️  Mode: ${process.env.NODE_ENV || 'development'}`);
});
