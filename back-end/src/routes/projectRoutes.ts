import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = Router();

/**
 * @openapi
 * /projects:
 *   get:
 *     summary: 전체 프로젝트 목록 조회
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: 프로젝트 목록과 할당된 인원 정보를 반환합니다.
 */
router.get('/', async (req: Request, res: Response) => {
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

/**
 * @openapi
 * /projects/{id}:
 *   get:
 *     summary: 특정 프로젝트 상세 조회
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 프로젝트 ID
 *     responses:
 *       200:
 *         description: 프로젝트 상세 정보를 반환합니다.
 *       404:
 *         description: 프로젝트를 찾을 수 없습니다.
 */
router.get('/:id', async (req: Request, res: Response) => {
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

/**
 * @openapi
 * /projects:
 *   post:
 *     summary: 새 프로젝트 생성
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - startDate
 *               - endDate
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               startDate: { type: string, format: date }
 *               endDate: { type: string, format: date }
 *               budget: { type: number }
 *     responses:
 *       201:
 *         description: 프로젝트가 성공적으로 생성되었습니다.
 */
router.post('/', async (req: Request, res: Response) => {
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

/**
 * @openapi
 * /projects/{id}:
 *   put:
 *     summary: 프로젝트 정보 수정
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               status: { type: string }
 *               budget: { type: number }
 *     responses:
 *       200:
 *         description: 프로젝트 정보가 수정되었습니다.
 */
router.put('/:id', async (req: Request, res: Response) => {
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

/**
 * @openapi
 * /projects/{id}:
 *   delete:
 *     summary: 프로젝트 삭제
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: 삭제 성공
 */
router.delete('/:id', async (req: Request, res: Response) => {
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

export default router;
