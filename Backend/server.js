require('dotenv').config();
const express = require('express');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs').promises; // Use Promises for async file handling
const cors = require('cors');
const sharp = require('sharp');

const app = express();
const upload = multer({ dest: 'uploads/' });

// CORS Configuration
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || ['http://localhost:3001', 'http://localhost:5500'].includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware to set a custom Referrer Policy (optional)
app.use((req, res, next) => {
    res.setHeader('Referrer-Policy', 'no-referrer-when-downgrade');
    next();
});

// Azure credentials from environment variables
const subscriptionKey = process.env.AZURE_SUBSCRIPTION_KEY;
const endpoint = process.env.AZURE_ENDPOINT;

// Helper function to validate Azure credentials
const validateAzureCredentials = () => {
    if (!subscriptionKey || !endpoint) {
        throw new Error("Azure credentials are missing. Please provide 'AZURE_SUBSCRIPTION_KEY' and 'AZURE_ENDPOINT' in the .env file.");
    }
};

// Endpoint for analyzing an image using OCR
app.post('/analyze', upload.single('file'), async (req, res) => {
    const imagePath = req.file ? req.file.path : null;

    try {
        validateAzureCredentials();

        if (!imagePath) {
            throw new Error('Image file is missing');
        }

        // Read the image buffer asynchronously
        const imageBuffer = await fs.readFile(imagePath);
        console.log('Making OCR API call...');

        // Make a request to Azure OCR API
        const response = await axios.post(
            `${endpoint}/vision/v3.2/ocr?language=unk&detectOrientation=true`,
            imageBuffer,
            {
                headers: {
                    'Ocp-Apim-Subscription-Key': subscriptionKey,
                    'Content-Type': 'application/octet-stream',
                },
            }
        );

        const ocrData = response.data;

        // Get image metadata for width and height
        const metadata = await sharp(imageBuffer).metadata();
        const { width, height } = metadata;

        // Create an SVG overlay for drawing bounding boxes
        let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;

        if (ocrData.regions) {
            ocrData.regions.forEach(region => {
                region.lines.forEach(line => {
                    line.words.forEach(word => {
                        const [x, y, boxWidth, boxHeight] = word.boundingBox.split(',').map(Number);
                        svg += `
                            <rect x="${x}" y="${y}" width="${boxWidth}" height="${boxHeight}" 
                                  style="fill: none; stroke: red; stroke-width: 2;" />
                            <text x="${x}" y="${y - 5}" font-family="Arial" font-size="16" fill="red">${word.text}</text>
                        `;
                    });
                });
            });
        }

        svg += `</svg>`;

        // Use sharp to composite the SVG overlay onto the original image
        const annotatedImageBuffer = await sharp(imageBuffer)
            .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
            .png()
            .toBuffer();

        // Prepare OCR text data to return along with the image
        let recognizedText = '';
        if (ocrData.regions) {
            ocrData.regions.forEach(region => {
                region.lines.forEach(line => {
                    const lineWords = line.words.map(word => word.text).join(' ');
                    recognizedText += lineWords + '\n';
                });
            });
        }

        // Return both the image and the text in a JSON response
        res.json({
            text: recognizedText,
            image: annotatedImageBuffer.toString('base64') // Encode image as base64
        });

    } catch (error) {
        console.error('Error during OCR analysis:', error.message);
        if (error.response) {
            console.error('Azure response:', error.response.data);
        }
        res.status(500).json({
            error: 'OCR analysis failed',
            details: error.message,
        });
    } finally {
        // Clean up the uploaded file asynchronously to avoid blocking the event loop
        if (imagePath) {
            try {
                await fs.unlink(imagePath);
                console.log(`Deleted file: ${imagePath}`);
            } catch (err) {
                console.error('Error deleting uploaded file:', err.message);
            }
        }
    }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
