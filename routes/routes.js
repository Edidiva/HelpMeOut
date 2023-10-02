// routes.js

const express = require('express');
const multer = require('multer');
const { uploadVideoChunk } = require('../controllers/video');

const router = express.Router();
const upload = multer();
/**
 /**
 * @swagger
 * openapi: 3.0.0
 * info:
 *   title: Vidrec API
 *   version: 1.0.0
 * paths:
 *   /api/video/upload-blob:
 *     post:
 *       summary: Upload a video Blob.
 *       description: Upload a video Blob for further processing.
 *       tags:
 *         - Video Blob
 *       requestBody:
 *         required: true
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               properties:
 *                 videoBlob:
 *                   type: string
 *                   format: binary
 *                   description: The video Blob file to be uploaded.
 *       responses:
 *         '200':
 *           description: Video Blob received successfully.
 *           content:
 *             application/json:
 *               example:
 *                 message: Video Blob received successfully.
 *         '400':
 *           description: Bad request. Blob field is missing in the request.
 *           content:
 *             application/json:
 *               example:
 *                 error: Blob field is missing in the request.
 *         '500':
 *           description: Internal Server Error.
 */


// Define routes
router.post('/upload-blob', upload.single('blob'), uploadVideoChunk);

module.exports = router;
