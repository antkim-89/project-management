import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * tags:
 *   name: ProjectCategories
 *   description: Project Category management
 */

/**
 * @swagger
 * /api/project-categories:
 *   get:
 *     summary: Retrieve a list of project categories
 *     tags: [ProjectCategories]
 *     responses:
 *       200:
 *         description: A list of project categories.
 */
router.get('/', async (req, res) => {
  try {
    const categories = await prisma.projectCategory.findMany();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

/**
 * @swagger
 * /api/project-categories:
 *   post:
 *     summary: Create a new project category
 *     tags: [ProjectCategories]
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
    const category = await prisma.projectCategory.create({
      data: { name },
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create category' });
  }
});

/**
 * @swagger
 * /api/project-categories/{id}:
 *   delete:
 *     summary: Delete a project category
 *     tags: [ProjectCategories]
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
    await prisma.projectCategory.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

export default router;
