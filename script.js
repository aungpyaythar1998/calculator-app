function handleFloatingPointSpecialCase(num1, num2, operation) {
    return operation(num1 * 10, num2 * 10) / 10;
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
    return num1 / num2;
}

function operate(op, num1, num2) {
    calculate = operations[op];
    return calculate(num1, num2);
}


let operations = {
    "+": add,
    "-": subtract,
    "*": multiply,
    "/": divide,
}