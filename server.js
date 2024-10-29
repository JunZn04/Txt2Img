const cors = require('cors');
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors())
app.use(express.json());

app.post('/', (req,res) => {
    const imagesPath = path.join(__dirname, 'public', 'image');
    const amount = req.body.batch_size;
    console.log(amount);
    console.log(imagesPath)

    const imageFiles = [];
    for (let i = 1; i <= amount; i++) {
        const imagePath = path.join(imagesPath, `${i}.jpg`);
        if (fs.existsSync(imagePath)) {
            imageFiles.push(imagePath);
        }
    }

    const images = imageFiles.map(filePath => {
        const imageBuffer = fs.readFileSync(filePath);
        return {
            filename: path.basename(filePath),
            content: imageBuffer.toString('base64')
        };
    });

    setTimeout(() => {
        res.json({ images: images });
    }, 3 * 1000); // 將秒轉換為毫秒


})

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Node listening on ${port}`);
});
  