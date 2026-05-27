import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = Router();

/**
 * @openapi
 * /leave-requests:
 *   get:
 *     summary: 전체 휴가 신청 내역 조회
 *     tags: [LeaveRequests]
 *     responses:
 *       200:
 *         description: 신청 내역 반환
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const requests = await prisma.leaveRequest.findMany({
      include: { user: { include: { rank: true } } }
    });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leave requests' });
  }
});

/**
 * @openapi
 * /leave-requests:
 *   post:
 *     summary: 휴가 신청 생성
 *     tags: [LeaveRequests]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, startDate, endDate, type]
 *             properties:
 *               userId: { type: string }
 *               startDate: { type: string, format: date }
 *               endDate: { type: string, format: date }
 *               type: { type: string }
 *               reason: { type: string }
 *     responses:
 *       201:
 *         description: 신청 성공
 */
router.post('/', async (req: Request, res: Response) => {
  const { userId, startDate, endDate, type, reason } = req.body;
  try {
    const newRequest = await prisma.leaveRequest.create({
      data: {
        userId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        type,
        reason
      }
    });
    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create leave request' });
  }
});

/**
 * @openapi
 * /leave-requests/{id}:
 *   put:
 *     summary: 휴가 신청 상태 업데이트
 *     tags: [LeaveRequests]
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
 *             required: [status]
 *             properties:
 *               status: { type: string }
 *     responses:
 *       200:
 *         description: 업데이트 성공
 */
router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const updatedRequest = await prisma.leaveRequest.update({
      where: { id },
      data: { status },
      include: { user: { include: { rank: true } } }
    });
    res.json(updatedRequest);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update leave request' });
  }
});

/**
 * @openapi
 * /leave-requests/{id}:
 *   delete:
 *     summary: 휴가 신청 삭제
 *     tags: [LeaveRequests]
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
    await prisma.leaveRequest.delete({
      where: { id }
    });
    res.json({ message: 'Leave request deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete leave request' });
  }
});

export default router;
