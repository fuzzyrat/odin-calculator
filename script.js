// Calculator state
let firstNumber = null;
let secondNumber = null;
let currentOperator = null;
let resetDisplay = false;
let calculationPerformed = false;

// DOM elements
const display = document.getElementById('display-content');
const errorMessage = document.getElementById('error-message');
const numberButtons = document.querySelectorAll('.number');
const operatorButtons = document.querySelectorAll('.operator');
const clearButton = document.getElementById('clear');
const backspaceButton = document.getElementById('backspace');
const equalsButton = document.getElementById('equals');
const decimalButton = document.getElementById('decimal');

// Basic math operations
function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (b === 0) {
        errorMessage.textContent = "Nice try, but you can't divide by zero!";
        return null;
    }
    return a / b;
}

// Perform calculation based on operator
function operate(operator, a, b) {
    errorMessage.textContent = '';
    
    switch (operator) {
        case '+':
            return add(a, b);
        case '-':
            return subtract(a, b);
        case '×':
            return multiply(a, b);
        case '÷':
            return divide(a, b);
        default:
            return null;
    }
}

// Update display
function updateDisplay(value) {
    // Limit to 10 characters to prevent overflow
    let displayValue = String(value);
    
    if (displayValue.length > 10) {
        // If it's a decimal number, round it
        if (displayValue.includes('.')) {
            const decimalPlaces = 10 - displayValue.split('.')[0].length - 1;
            if (decimalPlaces > 0) {
                displayValue = parseFloat(value).toFixed(decimalPlaces);
            } else {
                // If even integer part is too long, use scientific notation
                displayValue = parseFloat(value).toExponential(5);
            }
        } else if (displayValue.length > 10) {
            // For large integers, use scientific notation
            displayValue = parseFloat(value).toExponential(5);
        }
    }
    
    display.textContent = displayValue;
}

// Handle number button clicks
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        const number = button.textContent;
        
        if (resetDisplay || display.textContent === '0' || calculationPerformed) {
            display.textContent = number;
            resetDisplay = false;
            calculationPerformed = false;
        } else {
            display.textContent += number;
        }
        
        // Disable decimal button if display already has a decimal point
        decimalButton.disabled = display.textContent.includes('.');
    });
});

// Handle operator button clicks
operatorButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (currentOperator && !resetDisplay) {
            // If there's already an operator and we're not resetting, perform calculation
            secondNumber = parseFloat(display.textContent);
            const result = operate(currentOperator, firstNumber, secondNumber);
            
            if (result !== null) {
                updateDisplay(result);
                firstNumber = result;
            }
        } else {
            firstNumber = parseFloat(display.textContent);
        }
        
        currentOperator = button.textContent;
        resetDisplay = true;
        calculationPerformed = false;
    });
});

// Handle equals button click - MODIFIED TO FIX THE "8 + =" ISSUE
equalsButton.addEventListener('click', () => {
    // Only perform calculation if we have both numbers and an operator
    // and we're not in reset state (meaning a second number was entered)
    if (currentOperator && firstNumber !== null && !resetDisplay) {
        secondNumber = parseFloat(display.textContent);
        const result = operate(currentOperator, firstNumber, secondNumber);
        
        if (result !== null) {
            updateDisplay(result);
            firstNumber = result;
            currentOperator = null;
            calculationPerformed = true;
        }
    }
    // If in reset state (like after "8 +"), just keep showing the first number
});

// Handle clear button click
clearButton.addEventListener('click', () => {
    display.textContent = '0';
    errorMessage.textContent = '';
    firstNumber = null;
    secondNumber = null;
    currentOperator = null;
    resetDisplay = false;
    calculationPerformed = false;
    decimalButton.disabled = false;
});

// Handle backspace button click
backspaceButton.addEventListener('click', () => {
    if (calculationPerformed) {
        display.textContent = '0';
        calculationPerformed = false;
    } else if (display.textContent.length === 1) {
        display.textContent = '0';
    } else {
        display.textContent = display.textContent.slice(0, -1);
    }
    
    // Enable decimal button if decimal point was removed
    decimalButton.disabled = display.textContent.includes('.');
});

// Handle decimal button click
decimalButton.addEventListener('click', () => {
    if (resetDisplay || calculationPerformed) {
        display.textContent = '0.';
        resetDisplay = false;
        calculationPerformed = false;
    } else if (!display.textContent.includes('.')) {
        display.textContent += '.';
    }
    
    decimalButton.disabled = true;
});

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') {
        document.getElementById(
            ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'][parseInt(e.key)]
        ).click();
    } else if (e.key === '.') {
        decimalButton.click();
    } else if (e.key === '+') {
        document.getElementById('add').click();
    } else if (e.key === '-') {
        document.getElementById('subtract').click();
    } else if (e.key === '*') {
        document.getElementById('multiply').click();
    } else if (e.key === '/') {
        document.getElementById('divide').click();
    } else if (e.key === 'Enter' || e.key === '=') {
        equalsButton.click();
    } else if (e.key === 'Escape') {
        clearButton.click();
    } else if (e.key === 'Backspace') {
        backspaceButton.click();
    }
});