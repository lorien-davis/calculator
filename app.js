const screen = document.querySelector('.screen');
const buttons = document.querySelectorAll('button');
const calculator = {
  firstOperand: null,
  operator: null,
  operating: false,
  clear: false
}

buttons.forEach(button => {
  button.addEventListener('click', function () {
    switch (this.className) {
      case 'operand': {
        operandEntered(this.value);
        break;
      }
      case 'operator': {
        operatorEntered(this.value);
        break;
      }
      case 'decimal': {
        decimalEntered(this.value);
        break;
      }
      case 'all-clear': {
        allClear();
        break;
      }
      default:
        calculate(calculator.operator, calculator.firstOperand, Number(screen.value));
        break;
    }
    button.classList.add('clicked');
  });

  button.addEventListener('transitionend', function () {
    button.classList.remove('clicked');
  });
});

function add(x, y) {
  return x + y;
}

function subtract(x, y) {
  return x - y;
}

function multiply(x, y) {
  return x * y;
}

function divide(x, y) {
  return x / y;
}

function operandEntered(digit) {
  if (calculator.clear) {
    screen.value = null;
    calculator.clear = false;
  }
  screen.value += digit;
}

function decimalEntered(dot) {
  if (!screen.value.includes(dot)) {
    screen.value += dot;
  }
}

function operatorEntered(operator) {
  if (!calculator.operating) {
    calculator.firstOperand = Number(screen.value);
    calculator.operating = true;
    calculator.clear = true;
    calculator.operator = operator;
  } else if (calculator.operating) {
    calculate(operator, calculator.firstOperand, Number(screen.value));
    calculator.operating = false;
  }
}

function calculate(operator, digit1, digit2) {
  switch (operator) {
    case '+': {
      calculator.firstOperand = add(digit1, digit2);
      screen.value = calculator.firstOperand
      break;
    }
    case '-': {
      calculator.firstOperand = subtract(digit1, digit2);
      screen.value = calculator.firstOperand
      break;
    }
    case '*': {
      calculator.firstOperand = multiply(digit1, digit2);
      screen.value = calculator.firstOperand
      break;
    }
    case '/': {
      calculator.firstOperand = divide(digit1, digit2);
      screen.value = calculator.firstOperand
      break;
    }
    default: {
      break;
    }
  }
  calculator.clear = true;
  calculator.operating = false;
  calculator.operator = null;
}

function allClear() {
  calculator.firstOperand = null;
  calculator.operator = null;
  calculator.operating = false;
  screen.value = null;
}