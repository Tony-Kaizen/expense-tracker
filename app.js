const balance = document.querySelector('.balance__amount');

const incomeAmt = document.querySelector('.income__number');
const expenseAmt = document.querySelector('.expense__number');

const incomeBtn = document.querySelector('#income__btn');
const expenseBtn = document.querySelector('#expense__btn');

const form = document.querySelector('form');

const list = document.querySelector('#list');

form.addEventListener('submit', e => {
  //prevent page from reloading
  e.preventDefault();


});