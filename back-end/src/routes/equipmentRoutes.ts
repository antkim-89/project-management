import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = Router();

/**
 * @openapi
 * /equipments:
 *   get:
 *     summary: 전체 장비 목록 조회
 *     tags: [Equipments]
 *     responses:
 *       200:
 *         description: 장비 목록 반환
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const equipments = await prisma.equipment.findMany({
      include: { user: true }
    });
    res.json(equipments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch equipments' });
  }
});

/**
 * @openapi
 * /equipments:
 *   post:
 *     summary: 새 장비 등록
 *     tags: [Equipments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [type, modelName, serialNumber]
 *             properties:
 *               type: { type: string }
 *               modelName: { type: string }
 *               serialNumber: { type: string }
 *               userId: { type: string }
 *     responses:
 *       201:
 *         description: 등록 성공
 */
router.post('/', async (req: Request, res: Response) => {
  const { type, modelName, serialNumber, userId } = req.body;
  try {
    const newEquipment = await prisma.equipment.create({
      data: { type, modelName, serialNumber, userId }
    });
    res.status(201).json(newEquipment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create equipment' });
  }
});

export default router;
