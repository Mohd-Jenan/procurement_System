const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const userRoutes = require('./routes/auth');
const orderRoutes = require("./routes/order")
const checkRoutes = require("./routes/checklist")
const answerRouter=require("./routes/answer")
const trackRoutes = require("./routes/track")
const cnfmOrder = require("./routes/cnfmOrder")
const path = require("path")

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected Successfully'))
.catch((err) => {
  console.error('MongoDB Connection Error:', err.message);
  process.exit(1);
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/users', userRoutes);
app.use("/api/order",orderRoutes)
app.use("/api/checklist",checkRoutes)
app.use("/api/answer",answerRouter)
app.use("/api/track",trackRoutes)
app.use("/api/confirm/order",cnfmOrder)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
