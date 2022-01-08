
class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '';
        this.previousOperand = '';
        this.operation = undefined;
        this.clearAlerts();
    }

    clearAlerts() {
        document.querySelector('[data-error]').innerText = "";
        document.querySelector('[data-error]').style.opacity = 0;
    }

    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0,-1);
        this.clearAlerts();
    }

    appendNumber(number) {
        if(number === '.' && this.currentOperand.includes('.')) return;
        this.currentOperand = this.currentOperand.toString() + number.toString();
        if(this.equalPressed) {
            this.currentOperand = number.toString();
            this.equalPressed = false;
        }
    }

    chooseOperation(operation) {
        if(this.currentOperand === '') return;
        if(this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    changeSign() {
        this.currentOperand = (-1)*this.currentOperand;
        this.clearAlerts();
    }

    getSqrt() {
        if(this.currentOperand<0) {
            document.querySelector('[data-error]').innerText = "ОШИБКА!\nПопытка извлечь корень из отрицательного числа!";
            document.querySelector('[data-error]').style.opacity = 1;
            return;
        } else {
            this.clearAlerts();
            this.currentOperand =  Math.sqrt(this.currentOperand);
        }
    }

    getPercent(){
        this.currentOperand =  this.currentOperand/100;
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return
        switch (this.operation) {
            case '+':
                computation = parseFloat((prev + current).toFixed(16));
                break;

            case '-':
                computation = parseFloat((prev - current).toFixed(16));
                break;

            case '×':
                computation = parseFloat((prev * current).toFixed(16));
                break;

            case '÷':
                computation = parseFloat((prev / current).toFixed(16));
                break;
            
            case 'pow':
                computation = parseFloat((Math.pow(prev, current)).toFixed(16));
                break;

            default:
                return
        }

        this.currentOperand = computation;
        this.operation = undefined;
        this.previousOperand = '';
    }

    getDisplayNumber(number){
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];

        let integerDisplay;

        if(isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }

        if(decimalDigits != null){
            return `${integerDisplay}.${decimalDigits}`
        } else {
            return integerDisplay;
        }

    }

    updateDisplay() {
        this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);

        if(this.operation != null){
            this.previousOperandTextElement.innerText = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandTextElement.innerText = '';
        } 
    }
    
}


const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.querySelector('[data-equals]');
const deleteButton = document.querySelector('[data-delete]');
const allClearButton = document.querySelector('[data-all-clear]');
const previousOperandTextElement = document.querySelector('[data-previous-operand]');
const currentOperandTextElement = document.querySelector('[data-current-operand]');
const signButton = document.querySelector('[data-sign]');
const sqrtButton = document.querySelector('[data-sqrt]');
const percentButton = document.querySelector('[data-percent]');

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText);
        calculator.updateDisplay();
    })
})

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.dataset.operation);
        calculator.updateDisplay();
    })
})

equalsButton.addEventListener('click', () => {
    calculator.equalPressed = true;
    calculator.compute();
    calculator.updateDisplay();
})


allClearButton.addEventListener('click', () => {
    calculator.clear();
    calculator.updateDisplay();
})

deleteButton.addEventListener('click', () => {
    calculator.delete();
    calculator.updateDisplay();
})

signButton.addEventListener('click', () => {
    calculator.changeSign();
    calculator.updateDisplay();
})

sqrtButton.addEventListener('click', () => {
    calculator.getSqrt();
    calculator.updateDisplay();
})

percentButton.addEventListener('click', () => {
    calculator.getPercent();
    calculator.updateDisplay();
})