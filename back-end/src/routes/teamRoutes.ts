import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = Router();

/**
 * @openapi
 * /teams:
 *   get:
 *     summary: 전체 조직(팀) 목록 및 소속 임직원 조회
 *     tags: [Teams]
 *     responses:
 *       200:
 *         description: 조직 목록 반환
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const teams = await prisma.team.findMany({
      include: {
        users: {
          include: {
            rank: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
    res.json(teams);
  } catch (error) {
    console.error('Failed to fetch teams:', error);
    res.status(500).json({ error: '조직 목록을 가져오는 데 실패했습니다.' });
  }
});

/**
 * @openapi
 * /teams:
 *   post:
 *     summary: 신규 조직(팀) 생성
 *     tags: [Teams]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *     responses:
 *       201:
 *         description: 생성 성공
 */
router.post('/', async (req: Request, res: Response) => {
  const { name, description } = req.body;

  if (!name) {
    res.status(400).json({ error: '조직 이름은 필수 항목입니다.' });
    return;
  }

  try {
    const newTeam = await prisma.team.create({
      data: {
        name,
        description,
      },
    });
    res.status(201).json(newTeam);
  } catch (error: any) {
    console.error('Failed to create team:', error);
    if (error.code === 'P2002') {
      res.status(400).json({ error: '이미 존재하는 조직 이름입니다.' });
      return;
    }
    res.status(500).json({ error: '조직을 생성하는 데 실패했습니다.' });
  }
});

/**
 * @openapi
 * /teams/{id}:
 *   delete:
 *     summary: 조직(팀) 삭제
 *     tags: [Teams]
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
    // 삭제 전 존재 여부 검사
    const team = await prisma.team.findUnique({ where: { id } });
    if (!team) {
      res.status(404).json({ error: '해당 조직을 찾을 수 없습니다.' });
      return;
    }

    await prisma.team.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error('Failed to delete team:', error);
    res.status(500).json({ error: '조직을 삭제하는 데 실패했습니다.' });
  }
});

/**
 * @openapi
 * /teams/{id}/members:
 *   post:
 *     summary: 조직 구성원 일괄 변경
 *     tags: [Teams]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userIds]
 *             properties:
 *               userIds:
 *                 type: array
 *                 items: { type: string }
 *     responses:
 *       200:
 *         description: 변경 성공
 */
router.post('/:id/members', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userIds } = req.body;

  if (!Array.isArray(userIds)) {
    res.status(400).json({ error: 'userIds는 배열 형식이어야 합니다.' });
    return;
  }

  try {
    const team = await prisma.team.findUnique({ where: { id } });
    if (!team) {
      res.status(404).json({ error: '해당 조직을 찾을 수 없습니다.' });
      return;
    }

    // 트랜잭션을 이용한 일괄 변경
    await prisma.$transaction([
      // 1) 기존 해당 팀 소속 유저들 해제
      prisma.user.updateMany({
        where: { teamId: id },
        data: { teamId: null },
      }),
      // 2) 새로 전달받은 유저들을 이 팀에 할당
      prisma.user.updateMany({
        where: {
          id: { in: userIds },
        },
        data: { teamId: id },
      }),
    ]);

    res.json({ message: '조직 인원 구성이 성공적으로 업데이트되었습니다.' });
  } catch (error) {
    console.error('Failed to update team members:', error);
    res.status(500).json({ error: '조직 인원 구성을 업데이트하는 데 실패했습니다.' });
  }
});

export default router;
