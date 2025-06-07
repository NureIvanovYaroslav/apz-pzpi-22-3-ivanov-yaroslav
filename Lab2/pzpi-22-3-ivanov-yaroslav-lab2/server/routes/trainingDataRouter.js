const Router = require("express");
const router = new Router();
const trainingDataController = require("../controllers/trainingDataController");
const authMiddleware = require("../middlewares/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: TrainingData
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     TrainingData:
 *       type: object
 *       required:
 *         - id
 *         - sendingTime
 *         - heartRate
 *         - steps
 *         - training
 *       properties:
 *         id:
 *           type: string
 *         sendingTime:
 *           type: string
 *           format: date-time
 *         heartRate:
 *           type: number
 *         steps:
 *           type: number
 *         training:
 *           type: string
 */

/**
 * @swagger
 * /api/training-datas:
 *   post:
 *     summary: Create a new training data
 *     tags: [TrainingData]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sendingTime:
 *                 type: string
 *                 format: date-time
 *               heartRate:
 *                 type: number
 *               steps:
 *                 type: number
 *               training:
 *                 type: string
 *     responses:
 *       200:
 *         description: Training data successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TrainingData'
 */

router.post("/", trainingDataController.createTrainingData);

/**
 * @swagger
 * /api/training-datas/{id}:
 *   get:
 *     summary: Get training data by ID
 *     tags: [TrainingData]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Training data ID
 *     responses:
 *       200:
 *         description: Training data successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TrainingData'
 */

router.get("/:id", authMiddleware, trainingDataController.getTrainingDataById);

/**
 * @swagger
 * /api/training-datas/{id}:
 *   put:
 *     summary: Update training data by ID
 *     tags: [TrainingData]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Training data ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sendingTime:
 *                 type: string
 *                 format: date-time
 *               heartRate:
 *                 type: number
 *               steps:
 *                 type: number
 *               training:
 *                 type: string
 *     responses:
 *       200:
 *         description: Training data successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TrainingData'
 */

router.put(
  "/:id",
  authMiddleware,
  trainingDataController.updateTrainingDataById
);

/**
 * @swagger
 * /api/training-datas/{id}:
 *   delete:
 *     summary: Delete training data by ID
 *     tags: [TrainingData]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Training data ID
 *     responses:
 *       200:
 *         description: Training data successfully deleted
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
  trainingDataController.deleteTrainingDataById
);

/**
 * @swagger
 * /api/training-datas:
 *   get:
 *     summary: Get all training data
 *     tags: [TrainingData]
 *     responses:
 *       200:
 *         description: Training datas successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TrainingData'
 */

router.get("/", authMiddleware, trainingDataController.getAllTrainingData);

/**
 * @swagger
 * /api/training-datas/training/{trainingId}:
 *   get:
 *     summary: Get all training data for a specific training by training ID
 *     tags: [TrainingData]
 *     parameters:
 *       - in: path
 *         name: trainingId
 *         schema:
 *           type: string
 *         required: true
 *         description: Training ID
 *     responses:
 *       200:
 *         description: List of training datas for the training successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TrainingData'
 */

router.get(
  "/training/:trainingId",
  authMiddleware,
  trainingDataController.getTrainingDataByTrainingId
);

module.exports = router;
