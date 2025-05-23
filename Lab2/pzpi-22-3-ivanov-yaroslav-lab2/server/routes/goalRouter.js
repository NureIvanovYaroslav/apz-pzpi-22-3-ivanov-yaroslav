const Router = require("express");
const router = new Router();
const goalController = require("../controllers/goalController");
const authMiddleware = require("../middlewares/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Goal
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Goal:
 *       type: object
 *       required:
 *         - id
 *         - status
 *         - content
 *         - startDate
 *         - finishDate
 *         - user
 *       properties:
 *         id:
 *           type: string
 *         status:
 *           type: string
 *         content:
 *           type: string
 *         startDate:
 *           type: string
 *           format: date
 *         finishDate:
 *           type: string
 *           format: date
 *         user:
 *           type: string
 */

/**
 * @swagger
 * /api/goals:
 *   post:
 *     summary: Create a new goal
 *     tags: [Goal]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *               content:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               finishDate:
 *                 type: string
 *                 format: date
 *               user:
 *                 type: string
 *     responses:
 *       200:
 *         description: Goal successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Goal'
 */

router.post("/", authMiddleware, goalController.createGoal);

/**
 * @swagger
 * /api/goals/{id}:
 *   get:
 *     summary: Get goal by ID
 *     tags: [Goal]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Goal ID
 *     responses:
 *       200:
 *         description: Goal successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Goal'
 */

router.get("/:id", authMiddleware, goalController.getGoalById);

/**
 * @swagger
 * /api/goals/{id}:
 *   put:
 *     summary: Update goal by ID
 *     tags: [Goal]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Goal ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *               content:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               finishDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Goal successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Goal'
 */

router.put("/:id", authMiddleware, goalController.updateGoalById);

/**
 * @swagger
 * /api/goals/{id}:
 *   delete:
 *     summary: Delete goal by ID
 *     tags: [Goal]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Goal ID
 *     responses:
 *       200:
 *         description: Goal successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

router.delete("/:id", authMiddleware, goalController.deleteGoalById);

/**
 * @swagger
 * /api/goals:
 *   get:
 *     summary: Get all goals
 *     tags: [Goal]
 *     responses:
 *       200:
 *         description: Goals successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Goal'
 */

router.get("/", authMiddleware, goalController.getAllGoals);

/**
 * @swagger
 * /api/goals/user/{userId}:
 *   get:
 *     summary: Get all goals for a specific user by user ID
 *     tags: [Goal]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of goals for the user successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Goal'
 */

router.get("/user/:userId", authMiddleware, goalController.getGoalsByUserId);

module.exports = router;
