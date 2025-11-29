const express = require('express');
const Transaction = require('../models/Transaction');
const router = express.Router();
/*



idddddddddddd daloooooooooo user kiiiiiiiiiiiiii aisai kaisaiiiiiii daiii daii





*/









// In backend/routes/transactions.js - GET route
router.get('/', async (req, res) => {
  try {
    console.log('🔍 Fetching transactions from database...');
    const transactions = await Transaction.find().sort({ date: -1 });
    console.log(`✅ Found ${transactions.length} transactions`);
    console.log('Sample transaction:', transactions[0]);
    res.json(transactions);
  } catch (error) {
    console.error('❌ Error fetching transactions:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      stack: error.stack 
    });
  }
});

// POST route with better logging
router.post('/', async (req, res) => {
  try {
    console.log('📨 Received transaction data:', req.body);
    
    const transaction = new Transaction(req.body);
    const savedTransaction = await transaction.save();
    
    console.log('✅ Transaction saved:', savedTransaction);
    res.status(201).json(savedTransaction);
  } catch (error) {
    console.error('❌ Error creating transaction:', error);
    res.status(400).json({ 
      message: 'Error creating transaction', 
      error: error.message,
      details: error.errors 
    });
  }
});




// Update transaction
router.put('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(transaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete transaction
router.delete('/:id', async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: 'Transaction deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;