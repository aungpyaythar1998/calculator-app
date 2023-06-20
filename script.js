function handleFpSpecialCase(num1, num2, operation) {
    return operation(num1 * 10, num2 * 10) / 10;
}

function checkFpSpecialCase(num1, num2) {
    let val1 = Math.abs(num1);
    let val2 = Math.abs(num2);

    let condition1 = (val1 == 0.1 && val2 == 0.2) ||
                     (val1 == 0.2 && val2 == 0.1);
    let condition2 = (val1 == 0.3 && val2 == 0.1) ||
                     (val1 == 0.1 && val2 == 0.3);
    let condition3 = (val1 == 0.3 && val2 == 0.2) ||
                     (val1 == 0.2 && val2 == 0.3);
    let condition4 = (val1 == 0.4 && val2 == 0.1) ||
                     (val1 == 0.1 && val2 == 0.4);
    return condition1 || condition2 || condition3 || condition4;
}

function handleDivideByZero() {
    clearDisplay();
}

function add(num1, num2) {
    if (checkFpSpecialCase(num1, num2)){
        return handleFpSpecialCase(num1, num2, add);
    }
    return num1 + num2;
}

function subtract(num1, num2) {
    if (checkFpSpecialCase(num1, num2)){
        return handleFpSpecialCase(num1, num2, subtract);
    }
    return num1 - num2;
}

function multiply(num1, num2) {
    if (checkFpSpecialCase(num1, num2)){
        return handleFpSpecialCase(num1, num2, multiply);
    }
    return num1 * num2;
}

function divide(num1, num2) {
    if (num2 == 0) {
        return "You can't divide by zero, you dork";
    }
    if (checkFpSpecialCase(num1, num2)){
        return handleFpSpecialCase(num1, num2, divide);
    }
    return num1 / num2;
}

function addToDisplay(output) {
    display.textContent += output;
}

function clearDisplay() {
    display.textContent = "";
}

function updateDisplay(output) {
    clearDisplay();
    addToDisplay(output);
}

function approxDecimalPlace(num, decimalPlaces) {
    let numStr = num.toString();
    let numParts = numStr.split(".");
    if (numParts[1].length > decimalPlaces ) {
        numStr = numParts[0] + "." + numParts[1].slice(0, decimalPlaces);
        num = +numStr;
    }
    return num;
}

function checkIfFp(num) {
    return num.toString().includes(".");
}

function operate(op, num1, num2) {
    let result;

    clearDisplay();
    calculate = operators[op];
    result = calculate(num1, num2);
    if(checkIfFp(result)) {
        return approxDecimalPlace(result, 5);
    }
    return result;
}

function checkIfDefined(...inputVars) {
    return inputVars.every(eachVar => eachVar != undefined);
}

function checkIfUndefined(...inputVars) {
    return inputVars.every(eachVar => eachVar === undefined);
}

function eraseLastChar(inputStr) {
    return inputStr.slice(0, -1);
}

function checkRepeatedDecimal(numField, inputText) {
    return numField.includes(".") && inputText == ".";
}

function updateSecondNum(inputText) {
    if (checkRepeatedDecimal(secondNum, inputText)) {
        return;
    }

    if (inputText == backKey) {
        secondNum = eraseLastChar(secondNum);
        display.textContent = eraseLastChar(display.textContent);
    } else {
        secondNum += inputText;
        addToDisplay(inputText);
    }
}

function updateFirstNum(inputText) {
    if (checkRepeatedDecimal(firstNum, inputText)) {
        return;
    }

    if (inputText == backKey) {
        firstNum = eraseLastChar(firstNum);
        display.textContent = eraseLastChar(display.textContent);
    } else {
        firstNum += inputText;
        addToDisplay(inputText);
    }
}

/*
 * Don't need to handle backspace erasing
 * in set(First|Second)Num functions below
 * because them being called imply their
 * respective global variables are undefined
 * and we cannot chop off the last character
 * of the variable if it isn't a string.
 */

function setSecondNum(inputText) {
    if (inputText != backKey) {
        secondNum = inputText;
        updateDisplay(inputText);
    }
}

function setFirstNum(inputText) {
    if (inputText != backKey) {
        firstNum = inputText;
        updateDisplay(inputText);
    }
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
            }
            prevOperator = undefined;
            secondNum = undefined;
            updateDisplay(result);
        } else {
            if (typeof result != "string") {
                firstNum = result.toString();
                prevOperator = currentOperator;
            } else if (result.includes("divide by zero")) {
                prevOperator = undefined;
            }
            secondNum = undefined;
            updateDisplay(result);
        }
    } 

}

function prepareMathExp(e) {
    let calcButtonText = e.target.textContent;
    let num = Number(calcButtonText);
    if (isNaN(num) && calcButtonText != "." && calcButtonText != backKey) {
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
        setFirstNum(calcButtonText);
    } else if (checkIfDefined(firstNum) ) {
        if (display.textContent.includes("divide by zero")) {
            handleDivideByZero();
        }

        if (checkIfUndefined(prevOperator)) {
            updateFirstNum(calcButtonText);
        } else { 
            if (checkIfDefined(secondNum)) {
               updateSecondNum(calcButtonText);
               return;
            }
            setSecondNum(calcButtonText);
        }
    }
}


const operators = {
    "+": add,
    "–": subtract,
    "⨯": multiply,
    "÷": divide,
}
const backKey = "↵";

let firstNum;
let secondNum;
let prevOperator;

const buttons = document.querySelectorAll(".calc-row > button");
buttons.forEach(eachButton => {
    eachButton.addEventListener("click", prepareMathExp);
});

const display = document.querySelector("#display > p");


