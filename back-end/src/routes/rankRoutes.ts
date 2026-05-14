import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = Router();

/**
 * @openapi
 * /ranks:
 *   get:
 *     summary: 전체 직급 목록 조회
 *     tags: [Ranks]
 *     responses:
 *       200:
 *         description: 직급 목록 반환
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const ranks = await prisma.rank.findMany();
    res.json(ranks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ranks' });
  }
});

/**
 * @openapi
 * /ranks:
 *   post:
 *     summary: 새 직급 생성
 *     tags: [Ranks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, baseSalary]
 *             properties:
 *               name: { type: string }
 *               baseSalary: { type: integer }
 *     responses:
 *       201:
 *         description: 생성 성공
 */
router.post('/', async (req: Request, res: Response) => {
  const { name, baseSalary } = req.body;
  try {
    const newRank = await prisma.rank.create({
      data: { name, baseSalary: parseInt(baseSalary) }
    });
    res.status(201).json(newRank);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create rank' });
  }
});

export default router;
