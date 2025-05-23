const Router = require("express");
const router = new Router();
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

/**
 * @swagger
 * tags:
 *   name: Admin
 */

/**
 * @swagger
 * /api/admin/backup:
 *   post:
 *     summary: Create a backup of the database
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Backup created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */

router.post("/backup", authMiddleware, roleMiddleware(["ADMIN"]), adminController.backupDatabase);

/**
 * @swagger
 * /api/admin/restore:
 *   post:
 *     summary: Restore the database from a backup
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               backupName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Database restored successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */

router.post("/restore", authMiddleware, roleMiddleware(["ADMIN"]), adminController.restoreDatabase);

module.exports = router;
