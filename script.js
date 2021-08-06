// global vars

let operatorApplied = false;
let leftOperand = '';
let rightOperand = '';
let operatorDisplay = '';
let currentOperation = null;

// helper function

String.prototype.splice = function(idx, text, rem=0) {
  return this.slice(0, idx) + text + this.slice(idx + Math.abs(rem)); 
};

// calculator functions

const add = (a, b) => {
  return a + b;
};

const substract = (a, b) => {
  return a - b;
};

const multiply = (a, b) => {
  return a * b;
};

const division = (a, b) => {
  return a / b;
};

const operate = (operator, first, second) => {
  const firstNum = Number(first);
  const secondNum = Number(second);

  switch (operator) {
    case '+':
      return add(firstNum, secondNum);
    case '-':
      return substract(firstNum, secondNum);
    case '*':
      return multiply(firstNum, secondNum);
    case '/':
      return division(firstNum, secondNum);
    default:
      return null;
  };
};

// Buttons

const numberButtons = document.querySelectorAll('[data-number]');
const operatorButtons = document.querySelectorAll('[data-operator]');
const negateButton = document.querySelector('.btn-negate');
const clearButton = document.querySelector('.btn-clear');
const deleteButton = document.querySelector('.btn-delete');
const equalButton = document.querySelector('.btn-eq');
const decimalButton = document.querySelector('.btn-dot');

// Displays

const operationDisplay = document.getElementById('operationDisplay');
const currentDisplay = document.getElementById('currentDisplay');

// Event handlers

const resetDisplay = () => {
  currentDisplay.textContent = '';
  operatorApplied = false;
};

const pushNumber = (number) => {
  if (currentDisplay.textContent.length > 9) return;
  if (currentDisplay.textContent === '0' || operatorApplied) resetDisplay();
  
  currentDisplay.textContent += number;
};

const clearDisplay = () => {
  currentDisplay.textContent = '0';
  operationDisplay.textContent = '';
  leftOperand = '';
  rightOperand = '';
  operatorDisplay = '';
  currentOperation = null;
};

const popNumber = () => {
  const regex = /^-[0-9]$/g;

  if (currentDisplay.textContent.length === 1 ||
      currentDisplay.textContent === '-0.' ||
      regex.test(currentDisplay.textContent)) {
    currentDisplay.textContent = 0;
    return;
  };

  currentDisplay.textContent = currentDisplay.textContent.slice(0, -1);
};

const addDecimal = () => {
  if (currentDisplay.textContent.includes('.')) return;
  currentDisplay.textContent += '.';
};

const negate = () => {
  if (currentDisplay.textContent === '0') return;

  if (currentDisplay.textContent.includes('-')) {
    currentDisplay.textContent = currentDisplay.textContent.slice(1);
    return;
  };

  currentDisplay.textContent = currentDisplay.textContent.splice(0, '-');
};

const setOperator = (e) => {
  if (currentOperation !== null) evaluate();

  operatorDisplay = e.textContent;
  console.log(e.textContent);
  leftOperand = currentDisplay.textContent;
  operationDisplay.textContent = `${leftOperand} ${operatorDisplay} `;
  currentOperation = e.getAttribute('data-operator');
  operatorApplied = true;
};

const evaluate = () => {
  if (currentOperation === null || operatorApplied) return;

  rightOperand = currentDisplay.textContent;
  const result = operate(currentOperation, leftOperand, rightOperand);

  if (result === Infinity) {
    alert('Can\'t divide by 0!');
    currentDisplay.textContent = '0';
    return;
  };

  currentDisplay.textContent = result;
  operationDisplay.textContent = `${leftOperand} ${operatorDisplay} ${rightOperand} =`;
  currentOperation = null;
};

const handleKeyboardInput = (e) => {
  const numberRegex = /^[0-9]$/g;
  const operatorRegex = /^[\+\-\/\*]$/g;

  if (numberRegex.test(e.key)) pushNumber(e.key);

  if (operatorRegex.test(e.key)) {
    const event = document.querySelector(`button[data-operator='${e.key}']`);
    setOperator(event);
  };

  if (e.key === '.') addDecimal();
  if (e.key === 'Backspace') popNumber();
  if (e.key === 'Enter') evaluate();
  if (e.key === 'Escape') clearDisplay();
};

// Events

numberButtons.forEach((button) => {
  button.addEventListener('click', () => pushNumber(button.textContent));
});

operatorButtons.forEach((button) => {
  button.addEventListener('click', () => setOperator(button));
});

clearButton.addEventListener('click', clearDisplay);
deleteButton.addEventListener('click', popNumber);
decimalButton.addEventListener('click', addDecimal);
negateButton.addEventListener('click', negate);
equalButton.addEventListener('click', evaluate);
window.addEventListener('keydown', handleKeyboardInput);
