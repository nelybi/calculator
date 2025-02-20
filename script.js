// Fonctions de calcul de base
function addition(num1, num2) {
  return num1 + num2;
}

function soustraction(num1, num2) {
  return num1 - num2;
}

function multiplication(num1, num2) {
  return num1 * num2;
}

function division(num1, num2) {
  return num2 !== 0 ? num1 / num2 : "Erreur : Division par zéro!";
}

// Fonction qui choisit l'opération selon l'opérateur
function calculate(num1, op, num2) {
  switch (op) {
    case "+":
      return addition(num1, num2);
    case "-":
      return soustraction(num1, num2);
    case "*":
      return multiplication(num1, num2);
    case "/":
      return division(num1, num2);
    default:
      return "Opérateur non valide !";
  }
}

// Fonction pour arrondir le résultat à 6 décimales
function roundResult(result) {
  if (typeof result === "number") {
    return Math.round(result * 1000000) / 1000000;
  }
  return result;
}

// Variables d'état
let firstOperand = null;
let currentOperator = null;
let secondOperand = null;
let screenContent = "";

// Sélections des éléments de l'interface
const screen = document.querySelector(".screen");
const numericButtons = document.querySelectorAll(".btn.number");
const operatorButtons = document.querySelectorAll(".btn.operator");
const equalButton = document.querySelector(".btn.equal");
const clearButton = document.querySelector(".btn.clear");
const decimalButton = document.querySelector(".btn.decimal");
const backspaceButton = document.querySelector(".btn.backspace");

// Met à jour l'affichage
function updateScreen(content) {
  screen.textContent = content;
}

// ✅ Boutons numériques
numericButtons.forEach((button) => {
  button.addEventListener("click", () => {
    screenContent += button.textContent;
    updateScreen(screenContent);
  });
});

// ✅ Bouton décimal
if (decimalButton) {
  decimalButton.addEventListener("click", () => {
    // N'ajoute un point que s'il n'y en a pas déjà dans le nombre en cours
    if (!screenContent.includes(".")) {
      screenContent = screenContent === "" ? "0." : screenContent + ".";
      updateScreen(screenContent);
    }
  });
}

// ✅ Boutons opérateurs
operatorButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Si aucun nombre n'est entré et qu'un opérateur existe déjà, on met à jour l'opérateur
    if (screenContent === "" && firstOperand !== null) {
      currentOperator = button.textContent;
    }
    // Si c'est la première opération, on stocke le premier nombre et l'opérateur
    else if (screenContent !== "" && firstOperand === null) {
      firstOperand = parseFloat(screenContent);
      currentOperator = button.textContent;
      screenContent = "";
    }
    // Si un premier nombre, un opérateur et un second nombre sont présents, on évalue et on prépare la suite
    else if (
      screenContent !== "" &&
      firstOperand !== null &&
      currentOperator !== null
    ) {
      secondOperand = parseFloat(screenContent);
      let result = calculate(firstOperand, currentOperator, secondOperand);
      // En cas d'erreur (ex. division par zéro), on affiche le message et on réinitialise
      if (typeof result === "string") {
        updateScreen(result);
        firstOperand = null;
        currentOperator = null;
        screenContent = "";
        return;
      }
      result = roundResult(result);
      updateScreen(result);
      firstOperand = result;
      currentOperator = button.textContent;
      screenContent = "";
    }
  });
});

// ✅ Bouton égal
equalButton.addEventListener("click", () => {
  if (
    screenContent !== "" &&
    firstOperand !== null &&
    currentOperator !== null
  ) {
    secondOperand = parseFloat(screenContent);
    let result = calculate(firstOperand, currentOperator, secondOperand);
    if (typeof result === "string") {
      updateScreen(result);
      firstOperand = null;
      currentOperator = null;
      screenContent = "";
      return;
    }
    result = roundResult(result);
    updateScreen(result);
    // Permet de chaîner les opérations en utilisant le résultat comme nouveau premier nombre
    firstOperand = result;
    currentOperator = null;
    screenContent = "";
  }
});

// ✅ Bouton Clear
clearButton.addEventListener("click", () => {
  firstOperand = null;
  currentOperator = null;
  secondOperand = null;
  screenContent = "";
  updateScreen("0");
});

// ✅ Bouton Backspace
backspaceButton.addEventListener("click", () => {
  screenContent = screenContent.slice(0, -1);
  updateScreen(screenContent || "0");
});

// ✅ Support clavier
document.addEventListener("keydown", (event) => {
  const key = event.key;

  // Chiffres
  if (/\d/.test(key)) {
    screenContent += key;
    updateScreen(screenContent);
  }

  // Point décimal
  if (key === ".") {
    if (!screenContent.includes(".")) {
      screenContent = screenContent === "" ? "0." : screenContent + ".";
      updateScreen(screenContent);
    }
  }

  // Opérateurs
  if (["+", "-", "*", "/"].includes(key)) {
    if (screenContent === "" && firstOperand !== null) {
      currentOperator = key;
    } else if (screenContent !== "" && firstOperand === null) {
      firstOperand = parseFloat(screenContent);
      currentOperator = key;
      screenContent = "";
    } else if (
      screenContent !== "" &&
      firstOperand !== null &&
      currentOperator !== null
    ) {
      secondOperand = parseFloat(screenContent);
      let result = calculate(firstOperand, currentOperator, secondOperand);
      if (typeof result === "string") {
        updateScreen(result);
        firstOperand = null;
        currentOperator = null;
        screenContent = "";
        return;
      }
      result = roundResult(result);
      updateScreen(result);
      firstOperand = result;
      currentOperator = key;
      screenContent = "";
    }
  }

  // Égal ou Entrée
  if (key === "Enter" || key === "=") {
    if (
      screenContent !== "" &&
      firstOperand !== null &&
      currentOperator !== null
    ) {
      secondOperand = parseFloat(screenContent);
      let result = calculate(firstOperand, currentOperator, secondOperand);
      if (typeof result === "string") {
        updateScreen(result);
        firstOperand = null;
        currentOperator = null;
        screenContent = "";
        return;
      }
      result = roundResult(result);
      updateScreen(result);
      firstOperand = result;
      currentOperator = null;
      screenContent = "";
    }
  }

  // Backspace
  if (key === "Backspace") {
    screenContent = screenContent.slice(0, -1);
    updateScreen(screenContent || "0");
  }

  // Escape pour effacer
  if (key === "Escape") {
    firstOperand = null;
    currentOperator = null;
    secondOperand = null;
    screenContent = "";
    updateScreen("0");
  }
});
