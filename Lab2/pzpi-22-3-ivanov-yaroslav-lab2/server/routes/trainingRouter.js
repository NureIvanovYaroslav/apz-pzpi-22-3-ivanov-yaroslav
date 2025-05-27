const Router = require("express");
const router = new Router();
const trainingController = require("../controllers/trainingController");
const authMiddleware = require("../middlewares/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Training
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Training:
 *       type: object
 *       required:
 *         - id
 *         - type
 *         - startTime
 *         - endTime
 *         - device
 *         - userFitnessStudio
 *       properties:
 *         id:
 *           type: string
 *         type:
 *           type: string
 *         startTime:
 *           type: string
 *           format: date-time
 *         endTime:
 *           type: string
 *           format: date-time
 *         device:
 *           type: string
 *         userFitnessStudio:
 *           type: string
 *         trainingDatas:
 *           type: array
 *           items:
 *             type: string
 */

/**
 * @swagger
 * /api/trainings:
 *   post:
 *     summary: Create a new training
 *     tags: [Training]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               endTime:
 *                 type: string
 *                 format: date-time
 *               device:
 *                 type: string
 *               userFitnessStudio:
 *                 type: string
 *     responses:
 *       200:
 *         description: Training successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Training'
 */

router.post("/", authMiddleware, trainingController.createTraining);

/**
 * @swagger
 * /api/trainings/{id}:
 *   get:
 *     summary: Get training by ID
 *     tags: [Training]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Training ID
 *     responses:
 *       200:
 *         description: Training successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Training'
 */

router.get("/:id", authMiddleware, trainingController.getTrainingById);

/**
 * @swagger
 * /api/trainings/{id}:
 *   put:
 *     summary: Update training by ID
 *     tags: [Training]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Training ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               endTime:
 *                 type: string
 *                 format: date-time
 *               device:
 *                 type: string
 *               userFitnessStudio:
 *                 type: string
 *     responses:
 *       200:
 *         description: Training successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Training'
 */

router.put("/:id", authMiddleware, trainingController.updateTrainingById);

/**
 * @swagger
 * /api/trainings/{id}:
 *   delete:
 *     summary: Delete training by ID
 *     tags: [Training]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Training ID
 *     responses:
 *       200:
 *         description: Training successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

router.delete("/:id", authMiddleware, trainingController.deleteTrainingById);

/**
 * @swagger
 * /api/trainings:
 *   get:
 *     summary: Get all trainings
 *     tags: [Training]
 *     responses:
 *       200:
 *         description: Trainings successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Training'
 */

router.get("/", authMiddleware, trainingController.getAllTrainings);

/**
 * @swagger
 * /api/trainings/user-fitness-studio/{userFitnessStudioId}:
 *   get:
 *     summary: Get all trainings of a user in a fitness studio by UserFitnessStudio ID
 *     tags: [Training]
 *     parameters:
 *       - in: path
 *         name: userFitnessStudioId
 *         schema:
 *           type: string
 *         required: true
 *         description: UserFitnessStudio ID
 *     responses:
 *       200:
 *         description: List of trainings for the userFitnessStudio successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Training'
 */

router.get(
  "/user-fitness-studio/:userFitnessStudioId",
  authMiddleware,
  trainingController.getTrainingsByUserFitnessStudioId
);

/**
 * @swagger
 * /api/trainings/device/{deviceId}:
 *   get:
 *     summary: Get all trainings by device ID
 *     tags: [Training]
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         schema:
 *           type: string
 *         required: true
 *         description: Device ID
 *     responses:
 *       200:
 *         description: List of trainings for the device successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Training'
 */

router.get(
  "/device/:deviceId",
  authMiddleware,
  trainingController.getTrainingsByDeviceId
);

module.exports = router;
