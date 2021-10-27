class Calculator {
  constructor() {
    this.operationScreen = document.querySelector(".previous-operation");
    this.numberScreen = document.querySelector(".current-number");
    this.operatorButtons = document.querySelectorAll(".operator");
    this.operandButtons = document.querySelectorAll('[data-type="operand"]');
    this.clearButton = document.querySelector('[data-type="clear"]');

    this.numA = 0;
    this.userInput = ["0"];
    this.operator = undefined;
    this.lastEquation = "";

    this._currentMode = undefined;

    this.bindOperandHandler();
    this.bindOperatorHandler();
    this.bindClearHandler();

    this.math = {
      _parent: this,

      add: function (x, y) {
        return x + y;
      },

      subtract: function (x, y) {
        return x - y;
      },

      multiply: function (x, y) {
        return x * y;
      },

      divide: function (x, y) {
        return x / y;
      },

      operate: function (x, y, callback) {
        this._parent.updateLastEquation([x, y, callback.name]);
        return callback(x, y);
      },
    };
  }

  get numB() {
    return Number(this.userInput.join(""));
  }

  set numB(value) {
    this.userInput = String(value).split("");
  }

  updateLastEquation(list) {
    const symbol = this.getMathSymbol(list[2]);
    this.lastEquation = `${list[0]} ${symbol} ${list[1]}`;
  }

  get currentMode() {
    return this._currentMode;
  }

  set currentMode(value) {
    this.clearButton.value = "clear";
    this.clearButton.textContent = "C";

    switch (value) {
      case "operand":
        if (this.currentMode === "operand") {
          return;
        }
        this._currentMode = "operand";
        this.userInput = [];
        break;

      case "operator":
        if (this.currentMode === "operator") {
          if (this.operator) {
            this.calculate();
          }

          this.numA = this.numB;
          return;
        }
        this._currentMode = "operator";
        if (this.operator) {
          this.calculate();
        }
        this.numA = this.numB;
        break;

      default:
        return "Not a valid mode";
    }
  }

  calculate() {
    const answer = this.math.operate(this.numA, this.numB, this.operator);
    const roundedAnswer = Math.round(answer * 1000000) / 1000000;

    this.numB = roundedAnswer;
    this.updateDisplay();
  }

  getMathSymbol(operatorName) {
    switch (operatorName) {
      case "add":
        return "+";

      case "subtract":
        return "−";

      case "multiply":
        return "×";

      case "divide":
        return "÷";
    }
  }

  updateDisplay() {
    this.numberScreen.value = this.userInput.join("");
    this.operationScreen.value = this.lastEquation;
  }

  storeOperand(value) {
    this.userInput.push(value);
  }

  storeOperator(value) {
    this.operator = this.math[value];
  }

  checkValidOperand(value) {
    // if value = "0" && no other numbers except 0 do not allow
    // if value = "." && already a . do not allow
    switch (value) {
      case "0":
        return !(
          new Set(this.userInput).size === 1 && this.userInput[0] === "0"
        );

      case ".":
        return !this.userInput.includes(".");

      default:
        return true;
    }
  }

  handleOperand(value) {
    this.currentMode = "operand";

    if (
      this.userInput.length < 2 &&
      this.userInput[0] === "0" &&
      value !== "."
    ) {
      this.userInput = [];
    }

    if (this.checkValidOperand(value)) {
      this.storeOperand(value);
      this.updateDisplay();
    }
  }

  handleOperator(value) {
    this.currentMode = "operator";

    if (value !== "calculate") {
      this.storeOperator(value);
    }
  }

  handleClear(value) {
    switch (value) {
      case "clear":
        this.numB = 0;
        this.operator = undefined;
        this.clearButton.value = "all-clear";
        this.clearButton.textContent = "AC";
        break;

      case "all-clear":
        this.numA = 0;
        this.numB = 0;
        this.operator = undefined;
        this.lastEquation = "";

        break;

      default:
        break;
    }

    this.updateDisplay();
  }

  bindOperandHandler() {
    this.operandButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => this.handleOperand(e.target.value));
    });
  }

  bindOperatorHandler() {
    this.operatorButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => this.handleOperator(e.target.value));
    });
  }

  bindClearHandler() {
    this.clearButton.addEventListener("click", (e) =>
      this.handleClear(e.target.value)
    );
  }
}

const app = new Calculator();
