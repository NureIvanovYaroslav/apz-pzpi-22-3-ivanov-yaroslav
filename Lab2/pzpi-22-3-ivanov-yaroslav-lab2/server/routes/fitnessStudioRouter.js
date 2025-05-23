const Router = require("express");
const router = new Router();
const fitnessStudioController = require("../controllers/fitnessStudioController");
const authMiddleware = require("../middlewares/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: FitnessStudio
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     FitnessStudio:
 *       type: object
 *       required:
 *         - id
 *         - studioName
 *         - address
 *         - email
 *       properties:
 *         id:
 *           type: string
 *         studioName:
 *           type: string
 *         address:
 *           type: string
 *         email:
 *           type: string
 *         userFitnessStudios:
 *           type: array
 *           items:
 *             type: string
 */

/**
 * @swagger
 * /api/fitness-studios:
 *   post:
 *     summary: Create a new fitness studio
 *     tags: [FitnessStudio]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               studioName:
 *                 type: string
 *               address:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Fitness studio successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FitnessStudio'
 */

router.post("/", authMiddleware, fitnessStudioController.createFitnessStudio);

/**
 * @swagger
 * /api/fitness-studios/{id}:
 *   get:
 *     summary: Get fitness studio by ID
 *     tags: [FitnessStudio]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Fitness studio ID
 *     responses:
 *       200:
 *         description: Fitness studio successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FitnessStudio'
 */
router.get(
  "/:id",
  authMiddleware,
  fitnessStudioController.getFitnessStudioById
);

/**
 * @swagger
 * /api/fitness-studios/{id}:
 *   put:
 *     summary: Update fitness studio by ID
 *     tags: [FitnessStudio]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Fitness studio ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               studioName:
 *                 type: string
 *               address:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Fitness studio successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FitnessStudio'
 */
router.put(
  "/:id",
  authMiddleware,
  fitnessStudioController.updateFitnessStudioById
);

/**
 * @swagger
 * /api/fitness-studios/{id}:
 *   delete:
 *     summary: Delete fitness studio by ID
 *     tags: [FitnessStudio]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Fitness studio ID
 *     responses:
 *       200:
 *         description: Fitness studio successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.delete(
  "/:id",
  authMiddleware,
  fitnessStudioController.deleteFitnessStudioById
);

/**
 * @swagger
 * /api/fitness-studios:
 *   get:
 *     summary: Get all fitness studios
 *     tags: [FitnessStudio]
 *     responses:
 *       200:
 *         description: Fitness studios successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FitnessStudio'
 */
router.get("/", authMiddleware, fitnessStudioController.getAllFitnessStudios);

module.exports = router;
