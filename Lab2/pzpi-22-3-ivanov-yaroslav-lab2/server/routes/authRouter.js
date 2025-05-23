const Router = require("express");
const router = new Router();
const { check } = require("express-validator");
const authController = require("../controllers/authController");

/**
 * @swagger
 * tags:
 *   name: Auth
 */

/**
 *
 * @swagger
 * /api/auth/registration:
 *   post:
 *     summary: Registration of new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   $ref: '#/components/schemas/User'
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 */

const validateRegistration = () => {
  return [
    check("password", "Password should be 8-20 symbols long").isLength({
      min: 8,
      max: 20,
    }),
    check("email", "False email format").isEmail(),
  ];
};

router.post(
  "/registration",
  validateRegistration(),
  authController.registration
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in of user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: User successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 */

router.post("/login", authController.login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Log out of user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User successfully logged out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

router.post("/logout", authController.logout);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh of user token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Token successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 */

router.post("/refresh", authController.refresh);

module.exports = router;
