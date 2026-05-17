import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = Router();

/**
 * @openapi
 * /assignments:
 *   get:
 *     summary: 전체 프로젝트 할당 내역 조회
 *     tags: [Assignments]
 *     responses:
 *       200:
 *         description: 할당 내역 반환
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const assignments = await prisma.assignment.findMany({
      include: { user: true, project: true }
    });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
});

/**
 * @openapi
 * /assignments:
 *   post:
 *     summary: 프로젝트에 인력 할당
 *     tags: [Assignments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, projectId, role, contributionPercentage, startDate, endDate]
 *             properties:
 *               userId: { type: string }
 *               projectId: { type: string }
 *               role: { type: string }
 *               contributionPercentage: { type: integer }
 *               startDate: { type: string, format: date }
 *               endDate: { type: string, format: date }
 *     responses:
 *       201:
 *         description: 할당 성공
 */
router.post('/', async (req: Request, res: Response) => {
  const { userId, projectId, role, contributionPercentage, startDate, endDate } = req.body;
  try {
    const newAssignment = await prisma.assignment.create({
      data: {
        userId,
        projectId,
        role,
        contributionPercentage: parseInt(contributionPercentage),
        startDate: new Date(startDate),
        endDate: new Date(endDate)
      }
    });
    res.status(201).json(newAssignment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create assignment' });
  }
});

/**
 * @openapi
 * /assignments/{id}:
 *   delete:
 *     summary: 할당 정보 삭제
 *     tags: [Assignments]
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
    await prisma.assignment.delete({
      where: { id }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete assignment' });
  }
});

/**
 * @openapi
 * /assignments/project/{projectId}/user/{userId}:
 *   delete:
 *     summary: 특정 프로젝트의 특정 유저 할당 삭제
 *     tags: [Assignments]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: 삭제 성공
 */
router.delete('/project/:projectId/user/:userId', async (req: Request, res: Response) => {
  const { projectId, userId } = req.params;
  try {
    await prisma.assignment.deleteMany({
      where: { projectId, userId }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete assignment' });
  }
});

export default router;

