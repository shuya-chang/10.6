const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const paperRoutes = require('./routes/papers');
const { authenticateToken } = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/papers', authenticateToken, paperRoutes);

app.get('/', (req, res) => {
    res.send('Research Paper Manager API is running.');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
