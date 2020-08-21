//total balance
let balance = document.querySelector('.balance__amount');

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
db.collection('transactions').orderBy("created_at", "desc").onSnapshot(snapshot => {
  snapshot.docChanges().forEach(change => {
    const doc = change.doc;
    if (change.type === 'added') {
      //push transactions to array
      transactions.push(doc.data());
      //add transactions to DOM 
      addTransactionDOM(doc.data(), doc.id);
      //update values
      updateValues();
    } else if (change.type === 'removed') {
      //remove transacton from the DOM
      deleteTransactionDOM(doc.id);
      //update values
      updateValues();
    }
  });
});

//add transaction form
function addTransaction(e) {
  e.preventDefault();

  const isChecked = toggler.checked;

  if (isChecked) {
    form.amount.value = -Math.abs(form.amount.value)
  } else if (!isChecked) {
    form.amount.value = Math.abs(form.amount.value)
  }

  //check to see if form fields are empty, then submit form
  if (!form.name.value.trim() || !form.amount.value.trim()) {
    alert('Please enter a transaction name and amount.')
  } else {
    const now = new Date();
    const transaction = {
      name: form.name.value,
      amount: +form.amount.value,
      created_at: firebase.firestore.Timestamp.fromDate(now)
    }

    //add transaction to database
    db.collection('transactions').add(transaction)
      .then(() => console.log('transaction added!'))
      .catch(err => console.log(err));

    form.reset();
  }
}

//delete transaction from the database
list.addEventListener('click', e => {
  if (e.target.tagName === 'BUTTON') {
    const id = e.target.parentElement.getAttribute('id')
    db.collection('transactions').doc(id).delete().then(() => {
      console.log('transaction deleted from db!');
    });
  }
});

//add transaction to DOM
function addTransactionDOM(transaction, id) {

  //create list item
  const item = document.createElement('li');

  //add class based on value
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

  //set unique id for element
  item.setAttribute('id', `${id}`)

  //html template
  item.innerHTML = `
    <p>${transaction.name}</p>
    <p>${transaction.amount}</p>
    <button class="delete__btn">x</button>
  `

  //add item to list of transactions
  list.appendChild(item);
}

//delete transaction from the DOM
function deleteTransactionDOM(id) {
  const transactions = document.querySelectorAll('li');

  transactions.forEach(transaction => {
    if (transaction.getAttribute('id') === id) {
      transaction.remove();
    }
  });
}

//update balance, income and expenses
function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount);

  const total = amounts
    .reduce((acc, transaction) => (acc += transaction), 0)
    .toFixed(2);

  const income = amounts
    .filter(transaction => transaction > 0)
    .reduce((acc, transaction) => (acc += transaction), 0)
    .toFixed(2);

  const expense = amounts
    .filter(transaction => transaction < 0)
    .reduce((acc, transaction) => (acc -= transaction), 0)
    .toFixed(2);

  balance.innerText = `$${total}`;
  incomeAmt.innerText = `$${income}`;
  expenseAmt.innerText = `$${expense}`;
}


//event listener
form.addEventListener('submit', addTransaction);