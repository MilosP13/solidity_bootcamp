import React, { useState } from 'react'
import ABI from '../../contracts/ExpenseTracker.json';
import "./AddExpenseForm.css"

const AddExpenseForm = ({ onClose, web3, account, factoryAddress}) => {

  const [expenseData, setExpenseData] = useState({
    userAdress:'',
    price:'',
    date:'', 
    category:'',
    description:''
   // cancelled:''
  });

  //za ostalo
  const handleChange = (e) => {
    setExpenseData({ ...expenseData, [e.target.name]: e.target.value });
  };


  //HENDLAMO SUBMIT
  const handleSubmit = async () => {
    if (typeof window.ethereum === 'undefined' || !window.ethereum.isMetaMask) {
      console.log('MetaMask is not installed or not connected!');
      return;
    }
    if (!web3 || !account) {
      alert("Web3 instance or account is not available.");
      return;
    }
    try {
      const expense = new web3.eth.Contract(ABI.abi, factoryAddress);
  
      const transactionParameters = {
        to: factoryAddress,
        from: account,
        data: expense.methods.addExpense(
          expenseData.price,
          expenseData.category,
          expenseData.description
        ).encodeABI() // call to contract method
      };

      // txHash is a hex string
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });
  
      console.log("Transaction Hash:", txHash);
      onClose();
    } catch (error) {
      console.error("Error sending transaction:", error);
    }
  };



  return (
    <div className="add-expense-form">
  <div className="modal-content">
    <input className="modal-input" name="userAdress" placeholder="User Address" onChange={handleChange} />
    <input className="modal-input" name="price" type="number" placeholder="Amount you've spent" onChange={handleChange} />
    <select className="modal-input" name="category" onChange={handleChange}>
      <option value="">Select category</option>
      <option value="Food">Food</option>
      <option value="Transportation">Transportation</option>
      <option value="Bills">Bills</option>
    </select>
    <input className="modal-input" name="description" placeholder="Short Description" onChange={handleChange} />
    <button className="modal-button" onClick={handleSubmit}>Add To Tracker</button>
    <button className="modal-button cancel-button" onClick={onClose}>Cancel</button>
  </div>
</div>
  )
}

export default AddExpenseForm


{/* <select className="modal-input" name="cetegory" value={expenseType} onChange={handleExpenseChange & handleChange}>
        <option value="">Select an Expense Type</option>
        <option value="Food">Food</option>
        <option value="Transportation">Transportation</option>
        <option value="Bills">Bills</option>
      </select> */}