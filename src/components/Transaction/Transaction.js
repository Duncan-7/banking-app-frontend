import React from 'react';
import classes from './Transaction.module.css';

const Transaction = props => {
  let date = new Date(props.date);
  date = date.toLocaleDateString()
  return (
    <div className={classes.Container}>
      <p>Date: {date}</p>
      <p>{props.sender ? 'Recipient' : 'Sender'} Account Number: {props.sender ? props.targetAccountNumber : props.sourceAccountNumber}</p>
      <p>Amount: £{props.amount.toFixed(2)} </p>
    </div>
  )
}

export default Transaction;