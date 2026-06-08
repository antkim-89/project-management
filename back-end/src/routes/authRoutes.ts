import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-project-management';

// 비밀번호 규칙 검증 정규식: 8~16자, 영문 대소문자, 숫자, 특수문자 !@#$%^&* 조합
const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,16}$/;

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: 사용자 로그인
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: 로그인 성공 및 토큰 반환
 *       401:
 *         description: 이메일 또는 비밀번호가 일치하지 않음
 */
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: '이메일과 비밀번호를 입력해주세요.' });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(401).json({ error: '이메일 또는 비밀번호가 일치하지 않습니다.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ error: '이메일 또는 비밀번호가 일치하지 않습니다.' });
      return;
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        mustChangePassword: user.mustChangePassword,
      },
    });
  } catch (error) {
    console.error('로그인 에러:', error);
    res.status(500).json({ error: '로그인 처리 중 에러가 발생했습니다.' });
  }
});

/**
 * @openapi
 * /auth/change-password:
 *   post:
 *     summary: 비밀번호 변경
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, currentPassword, newPassword]
 *             properties:
 *               email: { type: string }
 *               currentPassword: { type: string }
 *               newPassword: { type: string }
 *     responses:
 *       200:
 *         description: 비밀번호 변경 성공
 *       400:
 *         description: 입력 규칙에 맞지 않거나 비밀번호 불일치
 */
router.post('/change-password', async (req: Request, res: Response) => {
  const { email, currentPassword, newPassword } = req.body;

  if (!email || !currentPassword || !newPassword) {
    res.status(400).json({ error: '모든 필드를 입력해 주세요.' });
    return;
  }

  // 비밀번호 규칙 검증
  if (!PASSWORD_REGEX.test(newPassword)) {
    res.status(400).json({
      error: '비밀번호는 8~16자 이내의 영문 대소문자, 숫자, 특수문자(!@#$%^&*) 조합이어야 합니다.',
    });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(400).json({ error: '해당 이메일의 사용자를 찾을 수 없습니다.' });
      return;
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      res.status(400).json({ error: '현재 비밀번호가 일치하지 않습니다.' });
      return;
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email },
      data: {
        password: hashedNewPassword,
        mustChangePassword: false,
      },
    });

    res.json({ message: '비밀번호가 성공적으로 변경되었습니다.' });
  } catch (error) {
    console.error('비밀번호 변경 에러:', error);
    res.status(500).json({ error: '비밀번호 변경 처리 중 에러가 발생했습니다.' });
  }
});

export default router;
