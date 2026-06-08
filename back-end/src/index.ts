import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

// Routes
import projectRoutes from './routes/projectRoutes';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import teamRoutes from './routes/teamRoutes';
import rankRoutes from './routes/rankRoutes';
import assignmentRoutes from './routes/assignmentRoutes';
import equipmentRoutes from './routes/equipmentRoutes';
import leaveRoutes from './routes/leaveRoutes';
import skillRoutes from './routes/skillRoutes';
import taskRoutes from './routes/taskRoutes';
import projectCategoryRoutes from './routes/projectCategoryRoutes';
import projectRoleRoutes from './routes/projectRoleRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// --- Swagger Setup ---
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Project Management API',
      version: '1.0.0',
      description: '프로젝트 및 리소스 관리를 위한 모듈화된 API 시스템입니다.',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: '로컬 개발 서버',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/index.ts'], // 라우트 파일들의 JSDoc을 읽어오도록 수정
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', ...(swaggerUi.serve as any), swaggerUi.setup(swaggerSpec) as any);

// --- Route Mapping ---
app.use('/auth', authRoutes);
app.use('/projects', projectRoutes);
app.use('/users', userRoutes);
app.use('/teams', teamRoutes);
app.use('/ranks', rankRoutes);
app.use('/assignments', assignmentRoutes);
app.use('/equipments', equipmentRoutes);
app.use('/leave-requests', leaveRoutes);
app.use('/skill-sets', skillRoutes);
app.use('/tasks', taskRoutes);
app.use('/project-categories', projectCategoryRoutes);
app.use('/project-roles', projectRoleRoutes);

// --- Basic API ---

/**
 * @openapi
 * /:
 *   get:
 *     summary: API 서버 상태 확인
 *     responses:
 *       200:
 *         description: 서버가 정상 작동 중임을 알립니다.
 */
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Project Management API is running (Modularized)' });
});

/**
 * @openapi
 * /health:
 *   get:
 *     summary: 헬스체크 엔드포인트
 *     responses:
 *       200:
 *         description: 서버 상태 OK
 */
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📝 Swagger Docs available at http://localhost:${PORT}/api-docs`);
});
