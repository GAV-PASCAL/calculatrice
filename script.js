class calculatrice {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '';
        this.previousOperand = '';
        this.operation = undefined;
    }

    delete() {
        // On convertit en string pour pouvoir couper le dernier caractère
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
    }

    // aJOUTER UN CHIFFRE à l'écran
    appendNumber(Number) {
        // Limitation : on ne peut avoir qu'un seul point décimal

        if (Number === '.' && this.currentOperand.includes('.')) return;

        this.currentOperand = this.currentOperand.toString() + Number.toString();
    }

    // Mettre à jour l\'écran HTML
    updateDisplay() {
        this.currentOperandTextElement.innerText = this.currentOperand;
        this.previousOperandTextElement.innerText = this.previousOperand;
    }
};

// Sélection des élements HTML

const numberButtons = document.querySelectorAll('[data-num]');
const operationButtons = document.querySelectorAll('[data-op]');
const equalsButton = document.querySelectorAll('[data-action="compute"]');
const deleteButton  = document.querySelectorAll('[data-action="delete"]');
const allClearButton  = document.querySelectorAll('[data-action="clear"]');
const previousOperandTextElement = document.getElementById('previous-operand');
const currentOperandTextElement = document.querySelectorAll('current-operand');

// création e l'instance 

const calculatrice = new calculatrice(previousOperandTextElement, currentOperandTextElement);

// Gestion des chiffres 
numberButtons.forEach((button) => {
    button.addEventListener('click', () => {
        // On récupère le chiffre du dataset (data-num)
        calculatrice.appendNumber(button.dataset.num);
        calculatrice.updateDisplay();
    });
});

allClearButton.addEventListener('click', () => {
    calculatrice.clear();
    calculatrice.updateDisplay();
});

deleteButton.addEventListener('click', () => {
    calculatrice.delete();
    calculatrice.updateDisplay();
});


chooseOperation(operation) {
    // Si l'écran est vide, on ne fait rien
    if(this.currentOperand === '') return;

    // Si on avait déjà un calcul en attente, on l'exécute d'abord
    if (this.previousOperand !== '') {
        this.compute();
    }

    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = ''; // On vide l'écran principal pour taper le 2ème nombre
}

compute() {
    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);

    // Si ce n'est pas des nombres, on arrête 
    if (isNaN(prev) || isNaN(current)) return;

    switch (this.operation) {
        case '+':
        computation = prev + current;
        break;
        case '-':
        computation = prev - current;
        break;
        case '*':
        computation = prev * current;
        break;
        case '/':
        computation = prev / current;
        break;
        default:
            return;
    }

    this.currentOperand = computation;
    this.operation = undefined;
    this.previousOperand = '';
}


updateDisplay() {
    this.currentOperandTextElement.innerText = this.currentOperand;
    if(this.operation != null) {
        // Affiche "12 + " en haut
        this.previousOperandTextElement.innerText = `${this.previousOperand} ${this.operation}`
    } else {
        this.previousOperandTextElement.innerText = '';
    };
}

operationButtons.forEach((button) => {
    button.addEventListener('click', () => {
        calculatrice.chooseOperation(button.dataset.op);
        calculatrice.updateDisplay();
    });
});
