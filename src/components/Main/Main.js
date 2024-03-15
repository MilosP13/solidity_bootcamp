import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import './Main.css';
import AddExpenseForm from "../AddExpenseForm/AddExpenseForm.js";
import ExpenseList from "../ExpenseList/ExpenseList.js";
import ExpenseAnalysisModal from "../AnalyseExpense/ExpenseAnalysisModal.js"; // Modal

const factoryAddress = "0x08229ce4BB27d626e0EfE80a3Fa719acdB0d29B2";
const sepoliaRPCUrl = "https://sepolia.infura.io/v3/c0d531f5e8474b20b7e66cffe0640b32";

const Main = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false); // Kontrolisem modal
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        console.log("Connected to Ethereum account: ", accounts[0]);
        window.ethereum.on('accountsChanged', (newAccounts) => {
          setAccount(newAccounts[0]);
          console.log("Switched to account: ", newAccounts[0]);
        });
      } else {
        console.log("MetaMask is not installed.");
      }
    } catch (error) {
      console.error("Error connecting to MetaMask: ", error);
    }
  };

  useEffect(() => {
    const web3Instance = new Web3(sepoliaRPCUrl);
    setWeb3(web3Instance);
    connectWallet();
  }, []);

  return (
    <div className="main-container">
      {!account && (
        <button className="connect-wallet-button" onClick={connectWallet}>
          Connect with MetaMask
        </button>
      )}
      
      <ExpenseList className="expense-list" web3={web3} account={account} factoryAddress={factoryAddress}/>
      
      <button className="create-expense-button" onClick={() => setShowCreateModal(true)}>
        Add New Item
      </button>
      
      <button className="expense-analysis-button" onClick={() => setShowAnalysisModal(true)}>Expense Analysis</button> 

      {showCreateModal && (
        <AddExpenseForm className="create-expense-form" web3={web3} account={account} onClose={() => setShowCreateModal(false)} factoryAddress={factoryAddress}/>
      )}

      {showAnalysisModal && ( // modal se prikazuje samo kad je kliknuto dugme
        <ExpenseAnalysisModal web3={web3} account={account} onClose={() => setShowAnalysisModal(false)} factoryAddress={factoryAddress}/>
      )}
    </div>
  )
}

export default Main;
