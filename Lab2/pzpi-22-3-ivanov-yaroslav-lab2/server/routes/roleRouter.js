const Router = require("express");
const router = new Router();
const roleController = require("../controllers/roleController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

/**
 * @swagger
 * tags:
 *   name: Role
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Role:
 *       type: object
 *       required:
 *         - id
 *         - value
 *       properties:
 *         id:
 *           type: string
 *         value:
 *           type: string
 */

/**
 * @swagger
 * /api/roles:
 *   post:
 *     summary: Create a new role
 *     tags: [Role]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               value:
 *                 type: string
 *                 example: "USER"
 *     responses:
 *       200:
 *         description: Role successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 */

router.post("/", authMiddleware, roleMiddleware(["ADMIN"]), roleController.createRole);

/**
 * @swagger
 * /api/roles/{value}:
 *   get:
 *     summary: Get role by value
 *     tags: [Role]
 *     parameters:
 *       - in: path
 *         name: value
 *         schema:
 *           type: string
 *         required: true
 *         description: Role value
 *     responses:
 *       200:
 *         description: Role successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 */

router.get("/:value", authMiddleware, roleMiddleware(["ADMIN"]), roleController.getRoleByValue);

/**
 * @swagger
 * /api/roles/{id}:
 *   put:
 *     summary: Update role by ID
 *     tags: [Role]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Role ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               value:
 *                 type: string
 *     responses:
 *       200:
 *         description: Role successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 */

router.put("/:id", authMiddleware, roleMiddleware(["ADMIN"]), roleController.updateRoleById);

/**
 * @swagger
 * /api/roles/{id}:
 *   delete:
 *     summary: Delete role by ID
 *     tags: [Role]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Role ID
 *     responses:
 *       200:
 *         description: Role successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

router.delete("/:id", authMiddleware, roleMiddleware(["ADMIN"]), roleController.deleteRoleById);
/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: Get all roles
 *     tags: [Role]
 *     responses:
 *       200:
 *         description: Roles successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Role'
 */

router.get("/", authMiddleware, roleMiddleware(["ADMIN"]), roleController.getAllRoles);

module.exports = router;
