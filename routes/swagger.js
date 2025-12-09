const express=require("express")
const router=express.Router()
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               mobile:
 *                 type: string
 *           example:
 *             email: "admin@procure.com"
 *             password: "123456"
 *             mobile: "9875899991"
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Invalid email or password
 */
// router.post('/auth/login', loginUser);
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               mobile:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: ['admin', 'procurement_manager', 'inspection_manager', 'client']
 *           example:
 *             name: Jenan
 *             email: jenan@gmail.com
 *             mobile: "1234567890"
 *             password: "123456"
 *             role: "client"
 *     responses:
 *       201:
 *         description: Created
 *       401:
 *         description: Unauthorized
 */
router.post('/register', protect, createUser);

