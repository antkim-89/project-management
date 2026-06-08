import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * tags:
 *   name: ProjectRoles
 *   description: Project Role management
 */

/**
 * @swagger
 * /api/project-roles:
 *   get:
 *     summary: Retrieve a list of project roles
 *     tags: [ProjectRoles]
 *     responses:
 *       200:
 *         description: A list of project roles.
 */
router.get('/', async (req, res) => {
  try {
    const roles = await prisma.projectRole.findMany();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch project roles' });
  }
});

/**
 * @swagger
 * /api/project-roles:
 *   post:
 *     summary: Create a new project role
 *     tags: [ProjectRoles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Role name is required' });
    }
    const role = await prisma.projectRole.create({
      data: { name: name.trim() },
    });
    res.status(201).json(role);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Role name already exists' });
    }
    res.status(500).json({ error: 'Failed to create project role' });
  }
});

/**
 * @swagger
 * /api/project-roles/{id}:
 *   delete:
 *     summary: Delete a project role
 *     tags: [ProjectRoles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Deleted
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.projectRole.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project role' });
  }
});

export default router;
