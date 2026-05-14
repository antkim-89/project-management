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
      include: { user: true }
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

export default router;
