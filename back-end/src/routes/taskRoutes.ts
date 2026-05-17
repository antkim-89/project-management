import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = Router();

/**
 * @openapi
 * /tasks:
 *   get:
 *     summary: 전체 할 일 목록 조회
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: 할 일 목록과 관련 프로젝트 및 담당자 정보를 반환합니다.
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        project: true,
        user: true,
      },
      orderBy: {
        dueDate: 'asc',
      },
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

/**
 * @openapi
 * /tasks/{id}:
 *   get:
 *     summary: 특정 할 일 상세 조회
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 할 일 상세 정보
 *       404:
 *         description: 할 일을 찾을 수 없음
 */
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        project: true,
        user: true,
      },
    });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

/**
 * @openapi
 * /tasks:
 *   post:
 *     summary: 새 할 일 생성
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - projectId
 *               - dueDate
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               status: { type: string }
 *               projectId: { type: string }
 *               userId: { type: string }
 *               dueDate: { type: string, format: date-time }
 *     responses:
 *       201:
 *         description: 생성 성공
 */
router.post('/', async (req: Request, res: Response) => {
  const { title, description, status, projectId, userId, dueDate } = req.body;
  try {
    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        status: status || 'TODO',
        dueDate: new Date(dueDate),
        project: { connect: { id: projectId } },
        user: userId ? { connect: { id: userId } } : undefined,
      },
      include: {
        project: true,
        user: true,
      },
    });
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

/**
 * @openapi
 * /tasks/{id}:
 *   put:
 *     summary: 할 일 정보 수정
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               status: { type: string }
 *               projectId: { type: string }
 *               userId: { type: string }
 *               dueDate: { type: string, format: date-time }
 *     responses:
 *       200:
 *         description: 수정 성공
 */
router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, status, projectId, userId, dueDate } = req.body;
  try {
    // Determine user relationship update
    // If userId is explicit null or empty, disconnect. Otherwise, connect.
    const userUpdate = userId 
      ? { connect: { id: userId } } 
      : userId === null 
        ? { disconnect: true } 
        : undefined;

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        status,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        project: projectId ? { connect: { id: projectId } } : undefined,
        user: userUpdate,
      },
      include: {
        project: true,
        user: true,
      },
    });
    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

/**
 * @openapi
 * /tasks/{id}:
 *   delete:
 *     summary: 할 일 삭제
 *     tags: [Tasks]
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
    await prisma.task.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

export default router;
