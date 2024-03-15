import React, { useState, useEffect } from 'react';
import ABI from '../../contracts/ExpenseTracker.json';
import './ExpenseReview.css';

const ExpenseReview = ({ web3, account, expenseId, onClose, factoryAddress }) => {
  const [expenseDetails, setExpenseDetails] = useState(null);
  
  const loadExpenseDetails = async () => {
    try {
      if (web3 && account && factoryAddress && expenseId!=null) {
        const expenseAdder = new web3.eth.Contract(ABI.abi, factoryAddress);
        
        // dobijam expense po idju
        const infoOfExpense = await expenseAdder.methods.getExpense(expenseId).call({ from: account });
  
  
        // ucitaj sve exp
        setExpenseDetails(infoOfExpense);
      }
    } catch (error) {
      console.error("Error while loading expense details:", error);
    }
  };

  const handleCancelExpense = async () => {
    try {
      if (web3 && account && factoryAddress && expenseId != null) {
        const expenseCanceler = new web3.eth.Contract(ABI.abi, factoryAddress);
  
        // proveri da li je cancelovana
        const infoOfExpense = await expenseCanceler.methods.getExpense(expenseId).call({ from: account });
  
        if (infoOfExpense.cancelled) {
          // izbaci alert da je calcelovano
          window.alert("This expense has already been cancelled.");
        } else {
          const transactionParameters = {
            to: factoryAddress,
            from: account,
            data: expenseCanceler.methods.cancelExpense(expenseId).encodeABI()
          };
  
          const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [transactionParameters],
          });
  
          console.log("Transaction Hash:", txHash);
          window.location.reload(); // Reload stranicu da se vidi da je cancel
        }
      }
    } catch (error) {
      console.error("Error while canceling expense:", error);
    }
  };
  
  useEffect(() => {
    loadExpenseDetails();
  }, [web3, account, factoryAddress, expenseId]);

  return (
    <div className="expense-review-modal">
      <h2 className="modal-title">Expense Review</h2>
      {expenseDetails && (
        <>
          <p className="expense-info">Expense Price: {expenseDetails.price.toString() + " RSD"}</p>
          <p className="expense-info">Date: {new Date(Number(expenseDetails.date) * 1000).toLocaleDateString()}</p>
          <p className="expense-info">Category: {expenseDetails.category}</p>
          <p className="expense-info">Description: {expenseDetails.description}</p>
          <p className="expense-info" style={{ color: expenseDetails.cancelled ? 'red' : 'black' }}>Valid: {expenseDetails.cancelled ? 'No' : 'Yes'}</p>
        </>
      )}

      <button className="delete-button" onClick={handleCancelExpense}>Delete Expense</button>
      <button className="close-button" onClick={onClose}>Close</button>
    </div>
  );
};

export default ExpenseReview;
