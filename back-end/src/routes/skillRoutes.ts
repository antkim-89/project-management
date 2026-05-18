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

/**
 * @openapi
 * /skill-sets:
 *   post:
 *     summary: 새로운 기술 스택 추가
 *     tags: [SkillSets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: 생성 성공
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, category } = req.body;
    const skillSet = await prisma.skillSet.create({
      data: { name, category },
    });
    res.status(201).json(skillSet);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create skill set' });
  }
});

/**
 * @openapi
 * /skill-sets/{id}:
 *   delete:
 *     summary: 기술 스택 삭제
 *     tags: [SkillSets]
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
  try {
    const { id } = req.params;
    await prisma.skillSet.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete skill set' });
  }
});

export default router;
