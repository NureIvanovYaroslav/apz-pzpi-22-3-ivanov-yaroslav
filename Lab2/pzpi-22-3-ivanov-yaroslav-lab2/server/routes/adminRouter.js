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

router.post(
  "/backup",
  authMiddleware,
  roleMiddleware(["DB_ADMIN"]),
  adminController.backupDatabase
);

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

router.post(
  "/restore",
  authMiddleware,
  roleMiddleware(["DB_ADMIN"]),
  adminController.restoreDatabase
);

/**
 * @swagger
 * /api/admin/database-status:
 *   get:
 *     summary: Get database connection status
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Database status information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 state:
 *                   type: integer
 *                 host:
 *                   type: string
 *                 name:
 *                   type: string
 */

router.get(
  "/database-status",
  authMiddleware,
  roleMiddleware(["DB_ADMIN"]),
  adminController.getDatabaseStatus
);

/**
 * @swagger
 * /api/admin/server-status:
 *   get:
 *     summary: Get server status
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Server status information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 uptime:
 *                   type: number
 *                 memoryUsage:
 *                   type: object
 *                 timestamp:
 *                   type: string
 */

router.get(
  "/server-status",
  authMiddleware,
  roleMiddleware(["SERVER_ADMIN"]),
  adminController.getServerStatus
);

/**
 * @swagger
 * /api/admin/server-config:
 *   get:
 *     summary: Get server configuration
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current server configuration
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 JWT_ACCESS_SECRET:
 *                   type: string
 *                   description: Secret for access tokens
 *                 JWT_REFRESH_SECRET:
 *                   type: string
 *                   description: Secret for refresh tokens
 *                 TOKEN_REFRESH_INTERVAL:
 *                   type: integer
 *                   description: Token refresh interval in seconds
 *                 # other config fields
 */

router.get(
  "/server-config",
  authMiddleware,
  roleMiddleware(["SERVER_ADMIN"]),
  adminController.getServerConfig
);

/**
 * @swagger
 * /api/admin/server-config:
 *   post:
 *     summary: Update server configuration
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               JWT_ACCESS_SECRET:
 *                 type: string
 *                 description: New access token secret
 *               JWT_REFRESH_SECRET:
 *                 type: string
 *                 description: New refresh token secret
 *               TOKEN_REFRESH_INTERVAL:
 *                 type: integer
 *                 description: Token refresh interval in seconds
 *               # other config fields
 *     responses:
 *       200:
 *         description: Server configuration updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 config:
 *                   type: object
 */

router.post(
  "/server-config",
  authMiddleware,
  roleMiddleware(["SERVER_ADMIN"]),
  adminController.setServerConfig
);

/**
 * @swagger
 * /api/admin/logs:
 *   get:
 *     summary: Get all server logs
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of log entries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   date:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   description:
 *                     type: string
 *                   success:
 *                     type: boolean
 */

router.get(
  "/logs",
  authMiddleware,
  roleMiddleware(["SERVER_ADMIN"]),
  adminController.getLogs
);

/**
 * @swagger
 * /api/admin/logs:
 *   delete:
 *     summary: Delete all server logs
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Number of deleted log files
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deleted:
 *                   type: integer
 */

router.delete(
  "/logs",
  authMiddleware,
  roleMiddleware(["SERVER_ADMIN"]),
  adminController.deleteAllLogs
);

/**
 * @swagger
 * /api/admin/logs/by-date:
 *   delete:
 *     summary: Delete server logs for a specific date
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *         required: true
 *         description: Date string to match log filenames (e.g. 2024-06-01)
 *     responses:
 *       200:
 *         description: Number of deleted log files for the specified date
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deleted:
 *                   type: integer
 */

router.delete(
  "/logs/by-date",
  authMiddleware,
  roleMiddleware(["SERVER_ADMIN"]),
  adminController.deleteLogsByDate
);

module.exports = router;
