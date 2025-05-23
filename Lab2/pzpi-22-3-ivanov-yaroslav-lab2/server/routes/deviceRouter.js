const Router = require("express");
const router = new Router();
const deviceController = require("../controllers/deviceController");
const authMiddleware = require("../middlewares/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Device
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Device:
 *       type: object
 *       required:
 *         - id
 *         - status
 *         - sendDataFrequency
 *         - user
 *       properties:
 *         id:
 *           type: string
 *         status:
 *           type: string
 *         sendDataFrequency:
 *           type: number
 *         user:
 *           type: string
 *         trainings:
 *           type: array
 *           items:
 *             type: string
 */

/**
 * @swagger
 * /api/devices:
 *   post:
 *     summary: Create a new device
 *     tags: [Device]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *               sendDataFrequency:
 *                 type: number
 *               user:
 *                 type: string
 *     responses:
 *       200:
 *         description: Device successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Device'
 */

router.post("/", authMiddleware, deviceController.createDevice);

/**
 * @swagger
 * /api/devices/{id}:
 *   get:
 *     summary: Get device by ID
 *     tags: [Device]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Device ID
 *     responses:
 *       200:
 *         description: Device successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Device'
 */

router.get("/:id", deviceController.getDeviceById);

/**
 * @swagger
 * /api/devices/{id}:
 *   put:
 *     summary: Update device by ID
 *     tags: [Device]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Device ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *               sendDataFrequency:
 *                 type: number
 *     responses:
 *       200:
 *         description: Device successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Device'
 */

router.put("/:id", deviceController.updateDeviceById);

/**
 * @swagger
 * /api/devices/{id}:
 *   delete:
 *     summary: Delete device by ID
 *     tags: [Device]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Device ID
 *     responses:
 *       200:
 *         description: Device successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

router.delete("/:id", authMiddleware, deviceController.deleteDeviceById);

/**
 * @swagger
 * /api/devices:
 *   get:
 *     summary: Get all devices
 *     tags: [Device]
 *     responses:
 *       200:
 *         description: Devices successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Device'
 */

router.get("/", authMiddleware, deviceController.getAllDevices);

module.exports = router;
