import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = Router();

const DEFAULT_LIFE: Record<string, number> = {
  Laptop: 36,
  Monitor: 60,
  Mobile: 24,
  Package: 36,
};

function calculateHealth(purchaseDate: Date, usefulLifeMonths: number): number {
  const diffMs = Date.now() - purchaseDate.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  const totalDays = usefulLifeMonths * 30.4375;
  const health = 100 - (diffDays / totalDays) * 100;
  return Math.max(0, Math.min(100, Math.round(health)));
}

/**
 * @openapi
 * /equipments/settings:
 *   get:
 *     summary: 장비 수명 설정 목록 조회
 *     tags: [Equipments]
 *     responses:
 *       200:
 *         description: 설정 목록 반환
 */
router.get('/settings', async (req: Request, res: Response) => {
  try {
    const settings = await prisma.equipmentSetting.findMany();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

/**
 * @openapi
 * /equipments/settings:
 *   put:
 *     summary: 장비 수명 설정 수정/생성
 *     tags: [Equipments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [type, usefulLife]
 *             properties:
 *               type: { type: string }
 *               usefulLife: { type: number }
 *     responses:
 *       200:
 *         description: 설정 성공
 */
router.put('/settings', async (req: Request, res: Response) => {
  const { type, usefulLife } = req.body;
  try {
    const setting = await prisma.equipmentSetting.upsert({
      where: { type },
      update: { usefulLife: Number(usefulLife) },
      create: { type, usefulLife: Number(usefulLife) },
    });
    res.json(setting);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update setting' });
  }
});

/**
 * @openapi
 * /equipments:
 *   get:
 *     summary: 전체 장비 목록 조회 (구입일 기준 건강도 동적 계산 반영)
 *     tags: [Equipments]
 *     responses:
 *       200:
 *         description: 장비 목록 반환
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const [equipments, settings] = await Promise.all([
      prisma.equipment.findMany({
        include: { user: true }
      }),
      prisma.equipmentSetting.findMany()
    ]);

    const settingsMap = new Map(settings.map(s => [s.type, s.usefulLife]));

    const mapped = equipments.map(eq => {
      const usefulLife = settingsMap.get(eq.type) ?? DEFAULT_LIFE[eq.type] ?? 36;
      const calculatedHealth = calculateHealth(new Date(eq.purchaseDate), usefulLife);
      return {
        ...eq,
        health: calculatedHealth
      };
    });

    res.json(mapped);
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
 *               purchaseDate: { type: string }
 *     responses:
 *       201:
 *         description: 등록 성공
 */
router.post('/', async (req: Request, res: Response) => {
  const { type, modelName, serialNumber, userId, purchaseDate } = req.body;
  const initialStatus = userId ? "Assigned" : "Available";
  const pDate = purchaseDate ? new Date(purchaseDate) : new Date();

  try {
    const settings = await prisma.equipmentSetting.findMany();
    const settingsMap = new Map(settings.map(s => [s.type, s.usefulLife]));
    const usefulLife = settingsMap.get(type) ?? DEFAULT_LIFE[type] ?? 36;
    const initialHealth = calculateHealth(pDate, usefulLife);

    const newEquipment = await prisma.equipment.create({
      data: {
        type,
        modelName,
        serialNumber,
        userId: userId || null,
        status: initialStatus,
        purchaseDate: pDate,
        health: initialHealth
      },
      include: { user: true }
    });
    res.status(201).json(newEquipment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create equipment' });
  }
});

/**
 * @openapi
 * /equipments/{id}:
 *   put:
 *     summary: 장비 정보 수정 및 상태/배정 업데이트
 *     tags: [Equipments]
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
 *               type: { type: string }
 *               modelName: { type: string }
 *               serialNumber: { type: string }
 *               userId: { type: string }
 *               status: { type: string }
 *               purchaseDate: { type: string }
 *     responses:
 *       200:
 *         description: 수정 성공
 */
router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { type, modelName, serialNumber, userId, status, purchaseDate } = req.body;
  try {
    const existing = await prisma.equipment.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Equipment not found' });
    }

    let finalStatus = status || existing.status;
    if (finalStatus !== "Maintenance" && finalStatus !== "Needs Repair") {
      if (userId !== undefined) {
        if (userId) {
          finalStatus = "Assigned";
        } else {
          finalStatus = "Available";
        }
      }
    }

    const updatedType = type !== undefined ? type : existing.type;
    const updatedPurchaseDate = purchaseDate !== undefined ? new Date(purchaseDate) : existing.purchaseDate;

    const settings = await prisma.equipmentSetting.findMany();
    const settingsMap = new Map(settings.map(s => [s.type, s.usefulLife]));
    const usefulLife = settingsMap.get(updatedType) ?? DEFAULT_LIFE[updatedType] ?? 36;
    const calculatedHealth = calculateHealth(new Date(updatedPurchaseDate), usefulLife);

    const updated = await prisma.equipment.update({
      where: { id },
      data: {
        type: updatedType,
        modelName: modelName !== undefined ? modelName : existing.modelName,
        serialNumber: serialNumber !== undefined ? serialNumber : existing.serialNumber,
        userId: userId !== undefined ? (userId || null) : existing.userId,
        status: finalStatus,
        purchaseDate: updatedPurchaseDate,
        health: calculatedHealth,
      },
      include: { user: true }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update equipment' });
  }
});

/**
 * @openapi
 * /equipments/{id}:
 *   delete:
 *     summary: 장비 삭제
 *     tags: [Equipments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 삭제 성공
 */
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.equipment.delete({ where: { id } });
    res.json({ message: 'Equipment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete equipment' });
  }
});

export default router;
