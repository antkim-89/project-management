import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import bcrypt from 'bcryptjs';

const router = Router();

/**
 * @openapi
 * /users:
 *   get:
 *     summary: 전체 사용자 목록 조회
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: 사용자 목록 반환
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        rank: true,
        skills: { include: { skillSet: true } },
        assignments: {
          include: {
            project: true
          }
        }
      }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

/**
 * @openapi
 * /users:
 *   post:
 *     summary: 새 사용자 생성
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, name, rankId]
 *             properties:
 *               email: { type: string }
 *               name: { type: string }
 *               rankId: { type: string }
 *               avatarUrl: { type: string }
 *     responses:
 *       201:
 *         description: 생성 성공
 */
router.post('/', async (req: Request, res: Response) => {
  const { email, name, rankId, avatarUrl } = req.body;
  try {
    const hashedInitialPassword = await bcrypt.hash('itmsg4u!', 10);
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        rankId,
        avatarUrl,
        password: hashedInitialPassword,
        mustChangePassword: true
      }
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Failed to create user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

/**
 * @openapi
 * /users/{id}:
 *   put:
 *     summary: 사용자 정보 수정
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: 수정 성공
 */
router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, rankId, avatarUrl } = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { name, rankId, avatarUrl }
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     summary: 사용자 삭제
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: 삭제 성공
 */
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

export default router;
