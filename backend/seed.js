const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

const dbPath = path.resolve(__dirname, 'database/database.sqlite');
const db = new sqlite3.Database(dbPath);

const seedDatabase = async () => {
    console.log('Starting seed process...');
    
    const hashedPassword = await bcrypt.hash('demo123', 10);
    
    db.serialize(() => {
        db.run(`INSERT INTO Users (name, email, password) VALUES (?, ?, ?)`, 
        ['Demo User', 'demo@example.com', hashedPassword], function(err) {
            if (err) {
                if (err.message.includes('UNIQUE')) {
                    console.log('Demo user already exists. Seed process aborted.');
                } else {
                    console.error('Error inserting demo user:', err.message);
                }
                return db.close();
            }
            
            const userId = this.lastID;
            console.log(`Demo user created with ID: ${userId}`);

            const papers = [
                {
                    title: 'Attention Is All You Need',
                    authors: 'Ashish Vaswani et al.',
                    year: 2017,
                    category: 'NLP',
                    status: 'Completed',
                    priority: 'High',
                    notes: 'Introduced the Transformer architecture.'
                },
                {
                    title: 'A Unified Approach to Interpreting Model Predictions',
                    authors: 'Scott Lundberg, Su-In Lee',
                    year: 2017,
                    category: 'Explainable AI',
                    status: 'Reading',
                    priority: 'High',
                    notes: 'Introduces SHAP values for model interpretability.'
                },
                {
                    title: 'Grad-CAM: Visual Explanations from Deep Networks',
                    authors: 'Ramprasaath Selvaraju et al.',
                    year: 2017,
                    category: 'Explainable AI',
                    status: 'To Read',
                    priority: 'Medium',
                    notes: 'Uses gradients flowing into the final convolutional layer.'
                }
            ];

            const stmt = db.prepare(`INSERT INTO Papers (user_id, title, authors, year, category, status, priority, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
            
            papers.forEach(paper => {
                stmt.run([userId, paper.title, paper.authors, paper.year, paper.category, paper.status, paper.priority, paper.notes]);
            });
            
            stmt.finalize(() => {
                console.log('Seed data inserted successfully.');
                db.close();
            });
        });
    });
};

seedDatabase();
