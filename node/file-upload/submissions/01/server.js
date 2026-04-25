// TODO: Build an Express server with a POST /analyze-inventory endpoint
// that accepts a CSV file upload and returns a JSON inventory analysis.
//
// Read README.md for the full requirements and expected output shape.
// Read COURSE.md for a step-by-step guide.
import express from 'express';
import router from './routes/router.js';

const PORT = 9000;

const app = express()

app.use(express.json());
app.use('/api', router);

app.listen(PORT, () => console.log("🚀 Listening to port:", PORT));