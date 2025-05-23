const Router = require("express");
const router = new Router();
const userFitnessStudioController = require("../controllers/userFitnessStudioController");
const authMiddleware = require("../middlewares/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: UserFitnessStudio
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserFitnessStudio:
 *       type: object
 *       required:
 *         - id
 *         - user
 *         - fitnessStudio
 *       properties:
 *         id:
 *           type: string
 *         user:
 *           type: string
 *         fitnessStudio:
 *           type: string
 *         trainings:
 *           type: array
 *           items:
 *             type: string
 */

/**
 * @swagger
 * /api/user-fitness-studios:
 *   post:
 *     summary: Create a new user-fitness studio association
 *     tags: [UserFitnessStudio]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               fitnessStudioId:
 *                 type: string
 *     responses:
 *       200:
 *         description: User-fitness studio association successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserFitnessStudio'
 */
router.post(
  "/",
  authMiddleware,
  userFitnessStudioController.createUserFitnessStudio
);

/**
 * @swagger
 * /api/user-fitness-studios:
 *   delete:
 *     summary: Remove user from fitness studio
 *     tags: [UserFitnessStudio]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               fitnessStudioId:
 *                 type: string
 *     responses:
 *       200:
 *         description: User successfully removed from fitness studio
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 userFitnessStudio:
 *                   $ref: '#/components/schemas/UserFitnessStudio'
 */
router.delete(
  "/",
  authMiddleware,
  userFitnessStudioController.deleteUserFitnessStudio
);

/**
 * @swagger
 * /api/user-fitness-studios/fitness-studio/{fitnessStudioId}/users:
 *   get:
 *     summary: Get all users for a specific fitness studio
 *     tags: [UserFitnessStudio]
 *     parameters:
 *       - in: path
 *         name: fitnessStudioId
 *         schema:
 *           type: string
 *         required: true
 *         description: Fitness studio ID
 *     responses:
 *       200:
 *         description: List of users for the fitness studio successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get(
  "/fitness-studio/:fitnessStudioId/users",
  authMiddleware,
  userFitnessStudioController.getUsersByFitnessStudioId
);

/**
 * @swagger
 * /api/user-fitness-studios/user/{userId}/fitness-studios:
 *   get:
 *     summary: Get all fitness studios for a specific user
 *     tags: [UserFitnessStudio]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of fitness studios for the user successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FitnessStudio'
 */
router.get(
  "/user/:userId/fitness-studios",
  authMiddleware,
  userFitnessStudioController.getFitnessStudiosByUserId
);

/**
 * @swagger
 * /api/user-fitness-studios:
 *   get:
 *     summary: Get all user-fitness studio associations
 *     tags: [UserFitnessStudio]
 *     responses:
 *       200:
 *         description: List of user-fitness studio associations successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserFitnessStudio'
 */
router.get(
  "/",
  authMiddleware,
  userFitnessStudioController.getAllUserFitnessStudios
);

module.exports = router;
