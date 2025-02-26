import { Router } from 'express';
import { AppDataSource } from '../database';
import { ProductRepository } from '../repositories/product.repository';

const router = Router();

// Get list of all tables
router.get('/tables', async (req, res) => {
  try {
    const tables = await AppDataSource.query(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
    `);
    res.json(tables);
  } catch (error) {
    console.error('Error fetching tables:', error);
    res.status(500).json({ error: 'Failed to fetch tables' });
  }
});

// Get table structure and sample data
router.get('/tables/:name', async (req, res) => {
  try {
    const tableName = req.params.name;
    
    // Get table structure (columns)
    const columns = await AppDataSource.query(`PRAGMA table_info(${tableName})`);
    
    // Get sample data (first 10 rows)
    const rows = await AppDataSource.query(`SELECT * FROM ${tableName} LIMIT 10`);
    
    res.json({ 
      tableName,
      columns,
      sampleData: rows
    });
  } catch (error) {
    console.error(`Error fetching table ${req.params.name}:`, error);
    res.status(500).json({ error: 'Failed to fetch table details' });
  }
});

// Execute custom SQL query (be careful with this in production!)
router.post('/query', async (req, res) => {
  try {
    // In a real app, add authentication and authorization here
    const query = req.body.query;
    
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Invalid query' });
    }
    
    // Only allow SELECT queries for safety
    if (!query.trim().toLowerCase().startsWith('select')) {
      return res.status(403).json({ error: 'Only SELECT queries are allowed' });
    }
    
    const results = await AppDataSource.query(query);
    res.json(results);
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Failed to execute query' });
  }
});

router.get('/debug', async (req, res) => {
  try {
    const dbStatus = {
      isConnected: AppDataSource.isInitialized,
      dbPath: AppDataSource.options.database,
      productCount: await ProductRepository.count(),
      products: await ProductRepository.find()
    };
    res.json(dbStatus);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Debug info failed', details: errorMessage });
  }
});

export default router;