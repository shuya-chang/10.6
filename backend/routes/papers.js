const express = require('express');
const router = express.Router();
const db = require('../database/db');

// GET all papers for logged in user
router.get('/', (req, res) => {
    const userId = req.user.id;
    db.all(`SELECT * FROM Papers WHERE user_id = ? ORDER BY created_at DESC`, [userId], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Server error' });
        res.json(rows);
    });
});

// GET a single paper
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    db.get(`SELECT * FROM Papers WHERE id = ? AND user_id = ?`, [id, userId], (err, row) => {
        if (err) return res.status(500).json({ error: 'Server error' });
        if (!row) return res.status(404).json({ error: 'Paper not found' });
        res.json(row);
    });
});

// POST a new paper
router.post('/', (req, res) => {
    const userId = req.user.id;
    const { title, authors, year, category, status, priority, notes } = req.body;
    
    if (!title) return res.status(400).json({ error: 'Title is required' });

    const sql = `INSERT INTO Papers (user_id, title, authors, year, category, status, priority, notes)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [userId, title, authors, year, category, status, priority, notes];

    db.run(sql, params, function (err) {
        if (err) return res.status(500).json({ error: 'Server error' });
        res.status(201).json({ id: this.lastID, message: 'Paper added successfully' });
    });
});

// PUT update a paper
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const { title, authors, year, category, status, priority, notes } = req.body;

    if (!title) return res.status(400).json({ error: 'Title is required' });

    const sql = `UPDATE Papers SET 
                 title = ?, authors = ?, year = ?, category = ?, status = ?, priority = ?, notes = ?
                 WHERE id = ? AND user_id = ?`;
    const params = [title, authors, year, category, status, priority, notes, id, userId];

    db.run(sql, params, function (err) {
        if (err) return res.status(500).json({ error: 'Server error' });
        if (this.changes === 0) return res.status(404).json({ error: 'Paper not found or unauthorized' });
        res.json({ message: 'Paper updated successfully' });
    });
});

// DELETE a paper
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    db.run(`DELETE FROM Papers WHERE id = ? AND user_id = ?`, [id, userId], function (err) {
        if (err) return res.status(500).json({ error: 'Server error' });
        if (this.changes === 0) return res.status(404).json({ error: 'Paper not found or unauthorized' });
        res.json({ message: 'Paper deleted successfully' });
    });
});

module.exports = router;
