import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = Router();

/**
 * @openapi
 * /skill-sets:
 *   get:
 *     summary: 전체 기술 스택 목록 조회
 *     tags: [SkillSets]
 *     responses:
 *       200:
 *         description: 기술 스택 목록 반환
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const skillSets = await prisma.skillSet.findMany();
    res.json(skillSets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch skill sets' });
  }
});

export default router;
