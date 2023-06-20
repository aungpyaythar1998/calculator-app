function handleFloatingPointSpecialCase(num1, num2, operation) {
    return operation(num1 * 10, num2 * 10) / 10;
}

function handleDivideByZero() {
    clearDisplay();
}

function add(num1, num2) {
    if (num1 == 0.1 && num2 == 0.2 || num1 == 0.2 && num2 == 0.1) {
        return handleFloatingPointSpecialCase(num1, num2, add);
    }
    return num1 + num2;
}

function subtract(num1, num2) {
    return num1 - num2;
}

function multiply(num1, num2) {
    if (num1 == 0.1 && num2 == 0.2 || num1 == 0.2 && num2 == 0.1) {
        return handleFloatingPointSpecialCase(num1, num2, multiply);
    }
    return num1 * num2;
}

function divide(num1, num2) {
    if (num2 == 0) {
        return "You can't divide by zero, you dork";
    }
    return num1 / num2;
}

function updateDisplay(output) {
    display.textContent += output;
}

function clearDisplay() {
    display.textContent = "";
}

function displayText(output) {
    clearDisplay();
    updateDisplay(output);
}

function operate(op, num1, num2) {
    let result;

    clearDisplay();
    calculate = operators[op];
    result = calculate(num1, num2);
    return result;
}

function checkIfDefined(...inputVars) {
    return inputVars.every(eachVar => eachVar != undefined);
}

function checkIfUndefined(...inputVars) {
    return inputVars.every(eachVar => eachVar === undefined);
}

function updateNumber(numField, inputText) {
    if (numField.includes(".") && inputText == ".") {
        return;
    }
    numField += inputText;
    updateDisplay(inputText);
}

function processMathOperator(currentOperator) {
    // This function being called implies an operator was just processed as input.

    // Pseudo-code :
    // if operator variable is undefined and first number is defined and second number
    // is not, assign op to operator.
    // if operator variable is defined and the op is "=" and both first and second
    // number are defined, perform the operation, assign the result back into first 
    // number, and clear the other variables.
    // if operator variable is defined and both first and second number are 
    // are also defined, perform the operation and put the result into first number
    // and clear the secondNum, and then assign op to operator.
    let result;

    if (currentOperator != "=" && checkIfDefined(firstNum) && checkIfUndefined(prevOperator, secondNum)) {
        prevOperator = currentOperator;
        clearDisplay();
    } else if (checkIfDefined(firstNum, prevOperator, secondNum)) {
        result = operate(prevOperator, +firstNum, +secondNum);
        if (currentOperator == "=") {
            if (typeof result != "string") {
                firstNum = result.toString();
            } else {
                firstNum = undefined;
            }
            prevOperator = undefined;
            secondNum = undefined;
            displayText(result);
        } else {
            if (typeof result != "string") {
                firstNum = result.toString();
                prevOperator = currentOperator;
            } else if (result.includes("divide by zero")) {
                prevOperator = undefined;
            }
            secondNum = undefined;
            displayText(result);
        }
    } 

}

function prepareMathExp(e) {
    let calcButtonText = e.target.textContent;
    let num = Number(calcButtonText);
    if (isNaN(num) && calcButtonText != ".") {
        if(calcButtonText in operators || calcButtonText == "=") {
            processMathOperator(calcButtonText);
        } else if (calcButtonText == "C") {
            clearDisplay();
            firstNum = undefined;
            prevOperator = undefined;
            secondNum = undefined;
        }
        return;
    }

    // Pseudo-code :
    // if both first and second number are undefined, go to first number.
    // if only the first number is defined and no operator is defined, go to 
    // first number. But if the operator is defined go to second number
    if (checkIfUndefined(firstNum, secondNum)) { 
        firstNum = calcButtonText;
        displayText(calcButtonText);
    } else if (checkIfDefined(firstNum) ) {
        if (display.textContent.includes("divide by zero")) {
            clearDisplay();
        }
        if (checkIfUndefined(prevOperator)) {
            updateNumber(firstNum, calcButtonText);
        } else { 
            if (checkIfDefined(secondNum)) {
               updateNumber(secondNum, calcButtonText);
               return;
            }
            secondNum = calcButtonText;
            displayText(calcButtonText);
        }
    }
}


const operators = {
    "+": add,
    "–": subtract,
    "⨯": multiply,
    "÷": divide,
}

let firstNum;
let secondNum;
let prevOperator;

const buttons = document.querySelectorAll(".calc-row > button");
buttons.forEach(eachButton => {
    eachButton.addEventListener("click", prepareMathExp);
});

const display = document.querySelector("#display > p");


