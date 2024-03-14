import React, { useState, useEffect } from 'react';
import ExpenseReview from '../ExpenseReview/ExpenseReview.js';
import ABI from '../../contracts/ExpenseTracker.json';
import './ExpenseList.css';

const ExpenseList = ({ web3, account, factoryAddress }) => {
  const [expenses, setExpenses] = useState([]);
  const [selectedExpenseId, setSelectedExpenseId] = useState(null);
  const [sortAscending, setSortAscending] = useState(true); // State to track sorting order

  const loadExpenses = async () => {
    try {
      const expenseAdder = new web3.eth.Contract(
        ABI.abi,
        factoryAddress
      );

      // Fetch expenses from the contract for the current account
      const expensesFromContract = await expenseAdder.methods.getAllExpenses().call({ from: account });

      // Update the state with the fetched expenses
      setExpenses(expensesFromContract.map(expense => ({ ...expense, price: Number(expense.price) })));
    } catch (error) {
      console.error("Error while loading expense list:", error);
    }
  };

  useEffect(() => {
    // Load expenses when the component mounts or when web3 or account changes
    if (web3 && account) {
      loadExpenses();
    }
  }, [web3, account]);

  const openDetailsModal = (expenseId) => {
    setSelectedExpenseId(expenseId);
  };

  const toggleSortOrder = () => {
    setSortAscending(!sortAscending); // Toggle sorting order
    // Sort expenses based on price
    const sortedExpenses = [...expenses].sort((a, b) => {
      return sortAscending ? a.price - b.price : b.price - a.price;
    });
    setExpenses(sortedExpenses); // Update state with sorted expenses
  };

  return (
    <div className="expense-list">
      <h1 className="expense-list-title">Expense Cost Tracker Dapp</h1>
      <button className="sort-button" onClick={toggleSortOrder}>Sort by Price</button> {/* Button to toggle sorting order */}
      {expenses.length > 0 ? (
        expenses.map((expense) => (
          <div
            key={expense.id}
            className={`expense-item ${expense.cancelled ? 'cancelled' : ''}`} // Apply 'cancelled' class if expense is cancelled
            onClick={() => openDetailsModal(expense.id)}
          >
            Expense {Number(expense.id)+1}: {expense.price.toString()} RSD - {new Date(Number(expense.date) * 1000).toLocaleDateString()}
          </div>
        ))
      ) : (
        <p>No expenses found.</p>
      )}
      {selectedExpenseId !== null && <ExpenseReview web3={web3} account={account} expenseId={Number(selectedExpenseId)} onClose={() => setSelectedExpenseId(null)} factoryAddress={factoryAddress} />}
    </div>
  );
};

export default ExpenseList;
