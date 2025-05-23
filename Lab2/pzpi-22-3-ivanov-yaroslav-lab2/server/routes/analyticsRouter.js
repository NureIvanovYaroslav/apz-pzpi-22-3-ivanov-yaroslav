const Router = require("express");
const router = new Router();
const analyticsController = require("../controllers/analyticsController");
const authMiddleware = require("../middlewares/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Analytics
 */

/**
 * @swagger
 * /api/analytics/recommendations/steps/{id}:
 *   get:
 *     summary: Get step recommendations by training ID
 *     tags: [Analytics]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Training ID
 *     responses:
 *       200:
 *         description: Get step recommendations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 formula:
 *                   type: string
 *                 indicators:
 *                   type: object
 */

router.get(
  "/recommendations/steps/:id",
  authMiddleware,
  analyticsController.getStepRecommendations
);

/**
 * @swagger
 * /api/analytics/recommendations/calories/{id}:
 *   get:
 *     summary: Get calories recommendations by training ID
 *     tags: [Analytics]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Training ID
 *     responses:
 *       200:
 *         description: Get calories recommendations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 formula:
 *                   type: string
 *                 indicators:
 *                   type: object
 */

router.get(
  "/recommendations/calories/:id",
  authMiddleware,
  analyticsController.getCaloriesRecommendations
);

/**
 * @swagger
 * /api/analytics/recommendations/heart-rate/{id}:
 *   get:
 *     summary: Get heart rate recommendations by training ID
 *     tags: [Analytics]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Training ID
 *     responses:
 *       200:
 *         description: Get heart rate recommendations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 formula:
 *                   type: string
 *                 indicators:
 *                   type: object
 */

router.get(
  "/recommendations/heart-rate/:id",
  authMiddleware,
  analyticsController.getHeartRateRecommendations
);

module.exports = router;
