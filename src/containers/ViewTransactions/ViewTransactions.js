import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from '../../axios-instance';

import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import Modal from '../../components/UI/Modal/Modal';
import Input from '../../components/UI/Input/Input';
import NewTransactionForm from '../NewTransactionForm/NewTransactionForm';
import Transaction from '../../components/Transaction/Transaction';
import classes from './ViewTransactions.module.css';

class ViewTransactions extends Component {
  state = {
    accountData: null,
    transactions: null,
    showNewTransactionForm: false,
    period: 'month'
  }

  componentDidMount() {
    this.getAccountData();
  }

  getAccountData = () => {
    axios.get('/accounts/' + this.props.match.params.id)
      .then(response => {
        this.setState({
          accountData: response.data.account,
          transactions: response.data.transactions
        });
      })
      .catch(error => {
        let err = error.response ? error.response.data.error : "Problem contacting server. Please try again.";
        this.setState({ error: err });
      })
  }

  toggleShowNewTransactionForm = () => {
    this.setState(prevState => {
      return { showNewTransactionForm: !prevState.showNewTransactionForm };
    });
  }

  periodChangeHandler = (event) => {
    const newPeriod = event.target.value;
    this.setState({
      period: newPeriod
    });
  }

  render() {
    let accountDetails = <Spinner />;
    let transactions = null;
    let transactionsSent = null;
    let transactionsReceived = null;
    let newTransaction = null;

    //create time period selector
    let selectConfig = {
      options: [
        { value: "month", displayValue: "Month" },
        { value: "quarter", displayValue: "Quarter" },
        { value: "year", displayValue: "Year" },
      ]
    }

    let timePeriod = <div className={classes.SelectInput}>
      <Input
        elementType="select"
        value={this.state.period}
        changed={(event) => this.periodChangeHandler(event)}
        elementConfig={selectConfig} />
    </div>

    if (this.state.error) {
      accountDetails = <p className="error">{this.state.error}</p>;
    }
    if (this.state.accountData) {
      accountDetails = <div>
        <h3>Account Information</h3>
        <p>Account Number: {this.state.accountData.accountNumber}</p>
        <p>Current Balance: £{this.state.accountData.currentBalance.toFixed(2)}</p>
      </div>

      //create new transaction form
      const newTransactionForm = <Modal
        show={this.state.showNewTransactionForm}
        modalClosed={this.toggleShowNewTransactionForm}>
        <NewTransactionForm
          sourceAccountId={this.state.accountData._id}
          toggleForm={this.toggleShowNewTransactionForm}
          updateData={this.getAccountData} />
      </Modal>
      newTransaction = this.state.showNewTransactionForm ? newTransactionForm : null;
    }

    if (this.state.transactions) {
      //sort transactions by date
      transactions = this.state.transactions.sort((a, b) => {
        let aDate = new Date(a.date);
        let bDate = new Date(b.date);
        return bDate - aDate;
      });

      transactions = transactions.map(transaction => {
        return <Transaction
          key={transaction._id}
          id={transaction._id}
          sender={transaction.sourceAccountId._id === this.state.accountData._id}
          targetAccountNumber={transaction.targetAccountId.accountNumber}
          sourceAccountNumber={transaction.sourceAccountId.accountNumber}
          amount={transaction.amount}
          date={transaction.date} />
      });

      switch (this.state.period) {
        case "year":
          transactions = transactions.filter(transaction => {
            let transactionDate = new Date(transaction.props.date);
            let cutOffDate = new Date();
            cutOffDate.setFullYear(cutOffDate.getFullYear() - 1);
            return transactionDate > cutOffDate;
          });
          break;
        case "quarter":
          transactions = transactions.filter(transaction => {
            let transactionDate = new Date(transaction.props.date);
            let cutOffDate = new Date();
            cutOffDate.setMonth(cutOffDate.getMonth() - 3);
            return transactionDate > cutOffDate;
          });
          break;
        case "month":
          transactions = transactions.filter(transaction => {
            let transactionDate = new Date(transaction.props.date);
            let cutOffDate = new Date();
            cutOffDate.setMonth(cutOffDate.getMonth() - 1);
            return transactionDate > cutOffDate;
          });
          break;
        default:
          break;
      }

      transactionsSent = transactions.filter(transaction => transaction.props.sender);
      transactionsReceived = transactions.filter(transaction => !transaction.props.sender);
    }



    return <div>
      {accountDetails}
      <Button btnType="Success" clicked={this.toggleShowNewTransactionForm}>New Transaction</Button>
      {newTransaction}
      <p className={classes.SelectCaption}>Show transactions for last:</p>
      {timePeriod}
      <h3>Outgoing Transfers</h3>
      {transactionsSent}
      <h3>Incoming Transfers</h3>
      {transactionsReceived}
    </div>
  }
}

const mapStateToProps = (state) => {
  return {
    userId: state.auth.userId
  }
}

export default connect(mapStateToProps)(ViewTransactions);