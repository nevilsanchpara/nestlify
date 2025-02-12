/**
 * @swagger
 * tags:
 *   name: Cities
 *   description: API for managing cities
 */

/**
 * @swagger
 * /cities:
 *   post:
 *     summary: Create a new city
 *     tags: [Cities]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               city:
 *                 type: string
 *               province:
 *                 type: string
 *               country:
 *                 type: string
 *     responses:
 *       201:
 *         description: City created successfully
 *       500:
 *         description: Server error
 */
router.post("/", protect, createCity);
