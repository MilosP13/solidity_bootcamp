import React, { useState } from 'react';
import ABI from '../../contracts/ExpenseTracker.json';
import './ExpenseAnalysisModal.css';

const ExpenseAnalysisModal = ({ web3, account, onClose, factoryAddress }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [totalExpense, setTotalExpense] = useState(0);

  const handleGetTotalExpense = async () => {
    try {
      const expenseAnalyzer = new web3.eth.Contract(ABI.abi, factoryAddress);
      const total = await expenseAnalyzer.methods.getTotalExpenseByCategory(selectedCategory).call({ from: account });
      setTotalExpense(total);
    } catch (error) {
      console.error("Error getting total expense:", error);
    }
  };

  return (
    <div className="expense-analysis-modal">
      <h2 className="modal-title">Expense Analysis</h2>
      <select className="category-select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
        <option value="">Choose category</option>
        <option value="Food">Food</option>
        <option value="Transportation">Transportation</option>
        <option value="Bills">Bills</option>
      </select>
      <button className="get-total-button" onClick={handleGetTotalExpense}>Get Total Expense</button>
      
      {Number(totalExpense) > 0 ? (
        <p className="total-expense-info">Total expense for {selectedCategory} is {Number(totalExpense)} RSD</p>
      ) : (
        <p className="total-expense-info">Total expense for {selectedCategory} is 0 RSD</p>
      )}
      <button className="close-button" onClick={onClose}>Close</button>
    </div>
  );
};

export default ExpenseAnalysisModal;
