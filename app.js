//total balance
const balance = document.querySelector('.balance__amount');

//current income & expenses
let incomeAmt = document.querySelector('.income__number');
let expenseAmt = document.querySelector('.expense__number');

//income & expense toggler
const toggler = document.querySelector('#transac__toggler');

//new transaction form
const form = document.querySelector('form');

//list of income & expense items
const list = document.querySelector('#list');

let transactions = [];

// get transactions (real-time listener)
db.collection('transactions').onSnapshot(snapshot => {
  snapshot.docChanges().forEach(change => {
    const doc = change.doc;
    if (change.type === 'added') {
      //push transactions to array
      transactions.push(doc.data());

      //add transactions to DOM
      addTransactionDOM(doc.data(), doc.id);
    } else if (change.type === 'removed') {
      //do something
    }
  });
});

//add transaction to database
function addTransaction(e) {
  e.preventDefault();

  const isChecked = toggler.checked;

  if (isChecked) {
    form.amount.value = -Math.abs(form.amount.value)
  } else if (!isChecked) {
    form.amount.value = Math.abs(form.amount.value)
  }

  const transaction = {
    name: `${form.name.value}`,
    amount: `${form.amount.value}`
  }

  db.collection('transactions').add(transaction)
    .then(() => console.log('transaction added!'))
    .catch(err => console.log(err));

  form.reset();
}

//add transaction to DOM
function addTransactionDOM(transaction, id) {

  //create list item
  const item = document.createElement('li');

  //add class based on value
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

  //html template
  item.innerHTML = `
    <p>${transaction.name}</p>
    <p>${transaction.amount}</p>
    <button id="${id}" class="delete__btn">x</button>
  `

  //add item to list of transactions
  list.prepend(item);

}

//event listener
form.addEventListener('submit', addTransaction);