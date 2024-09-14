const express = require('express');
const sharp = require('sharp');
const multer = require('multer');
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  const imageBuffer = req.file.buffer;
  res.status(200).json({ imageBuffer: imageBuffer.toString('base64') });
});

router.post('/process', async (req, res) => {
  const { brightness = 1, contrast = 1, rotation = 0, format = 'jpeg', image } = req.body;

  if (!image) {
    return res.status(400).json({ error: 'No image data provided.' });
  }

  try {
    const imageBuffer = Buffer.from(image, 'base64');
    let processedImage = sharp(imageBuffer);

    if (brightness) processedImage = processedImage.modulate({ brightness: parseFloat(brightness) });
    if (contrast) processedImage = processedImage.linear(parseFloat(contrast));
    if (rotation) processedImage = processedImage.rotate(parseInt(rotation));

    if (format === 'jpeg') processedImage = processedImage.jpeg();
    else if (format === 'png') processedImage = processedImage.png();

    const previewBuffer = await processedImage.toBuffer();
    res.status(200).send(previewBuffer);
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ error: 'Failed to process image.' });
  }
});


//for download
router.post("/download", async (req, res) => {
  const { image, format } = req.body;

  if (!image) {
    return res.status(400).json({ error: "No image data provided." });
  }

  try {
    // Check if the image is a data URL and strip the prefix
    const base64Data = image.replace(/^data:image\/\w+;base64,/, ""); // Remove the data URL prefix
    const imageBuffer = Buffer.from(base64Data, "base64"); // Convert base64 to buffer

    let processedImage = sharp(imageBuffer);

    if (format === "jpeg") {
      processedImage = processedImage.jpeg();
    } else if (format === "png") {
      processedImage = processedImage.png();
    }

    const previewBuffer = await processedImage.toBuffer();
    
    res.setHeader("Content-Disposition", `attachment; filename=processed-image.${format}`);
    res.setHeader("Content-Type", `image/${format}`);
    res.status(200).send(previewBuffer);

  } catch (error) {
    console.error("Error processing image for download:", error);
    res.status(500).json({ error: "Failed to process image for download." });
  }
});


module.exports = router;
