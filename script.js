class calculatrice {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.history = JSON.parse(localStorage.getItem('calculHistory')) || [];
        this.clear();
    }

    clear() {
        this.currentOperand = '';
        this.previousOperand = '';
        this.operation = undefined;
    }

    delete() {
        // Si on a choisi une opération mais pas encore tapé le deuxième nombre, on supprime l'opération
        if (this.currentOperand === '' && this.operation !== undefined) {
            this.operation = undefined;
            this.currentOperand = this.previousOperand;
            this.previousOperand = '';
        } else {
            // Sinon, on supprime le dernier caractère du nombre actuel
            this.currentOperand = this.currentOperand.toString().slice(0, -1);
        }
    }

    // aJOUTER UN CHIFFRE à l'écran
    appendNumber(Number) {
        // Limitation : on ne peut avoir qu'un seul point décimal

        if (Number === '.' && this.currentOperand.includes('.')) return;

        this.currentOperand = this.currentOperand.toString() + Number.toString();
    }

    chooseOperation(operation) {
        // Si on a une opération déjà choisie mais pas encore de nombre saisi, on change juste l'opération
        if (this.currentOperand === '' && this.operation !== undefined) {
            this.operation = operation;
            return;
        }

        // Si l'écran est vide et pas d'opération en attente, on ne fait rien
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

        const calcString = `${this.previousOperand} ${this.operation} ${this.currentOperand} = ${computation}`;
        this.addToHistory(calcString);
        
        this.currentOperand = computation;
        this.operation = undefined;
        this.previousOperand = '';
    }

    addToHistory(calculation) {
        this.history.unshift(calculation);
        if (this.history.length > 50) {
            this.history.pop();
        }
        localStorage.setItem('calculHistory', JSON.stringify(this.history));
        updateHistoryDisplay();
    }

    clearHistory() {
        this.history = [];
        localStorage.removeItem('calculHistory');
        updateHistoryDisplay();
    }

    // Mettre à jour l\'écran HTML
    updateDisplay() {
        this.currentOperandTextElement.innerText = this.currentOperand || '0';
        if(this.operation != null) {
            // Affiche "12 + " en haut
            this.previousOperandTextElement.innerText = `${this.previousOperand} ${this.operation}`
        } else {
            this.previousOperandTextElement.innerText = '';
        }
    }
};

// Sélection des élements HTML

const numberButtons = document.querySelectorAll('[data-num]');
const operationButtons = document.querySelectorAll('[data-op]');
const equalsButton = document.querySelector('[data-action="compute"]');
const deleteButton  = document.querySelector('[data-action="delete"]');
const allClearButton  = document.querySelector('[data-action="clear"]');
const previousOperandTextElement = document.getElementById('previous-operand');
const currentOperandTextElement = document.getElementById('current-operand');
const themeToggle = document.getElementById('theme-toggle');
const historyToggle = document.getElementById('history-toggle');
const historyPanel = document.getElementById('history-panel');
const historyList = document.getElementById('history-list');
const historyClose = document.getElementById('history-close');
const clearHistoryBtn = document.getElementById('clear-history');

// création de l'instance 

const calculator = new calculatrice(previousOperandTextElement, currentOperandTextElement);

// ========== GESTION DU THÈME ==========

function toggleTheme() {
    document.body.classList.toggle('light-theme');
    const isDark = !document.body.classList.contains('light-theme');
    localStorage.setItem('calculatorTheme', isDark ? 'dark' : 'light');
    updateThemeIcon();
}

function updateThemeIcon() {
    const isDark = !document.body.classList.contains('light-theme');
    themeToggle.textContent = isDark ? '🌙' : '☀️';
}

// Charger le thème sauvegardé
const savedTheme = localStorage.getItem('calculatorTheme') || 'dark';
if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
}
updateThemeIcon();

// ========== GESTION DE L'HISTORIQUE ==========

function updateHistoryDisplay() {
    historyList.innerHTML = '';
    if (calculator.history.length === 0) {
        historyList.innerHTML = '<li style="padding: 20px; text-align: center; color: var(--text-secondary);">Aucun historique</li>';
        return;
    }
    
    calculator.history.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'history-item';
        li.textContent = item;
        li.addEventListener('click', () => {
            const result = item.split('=')[1].trim();
            calculator.currentOperand = result;
            calculator.updateDisplay();
            historyPanel.classList.remove('show');
        });
        historyList.appendChild(li);
    });
}

function toggleHistory() {
    historyPanel.classList.toggle('show');
}

// ========== EVENT LISTENERS ==========

themeToggle.addEventListener('click', toggleTheme);
historyToggle.addEventListener('click', toggleHistory);
historyClose.addEventListener('click', () => historyPanel.classList.remove('show'));
clearHistoryBtn.addEventListener('click', () => {
    calculator.clearHistory();
});

// Gestion des chiffres 
numberButtons.forEach((button) => {
    button.addEventListener('click', () => {
        // On récupère le chiffre du dataset (data-num)
        calculator.appendNumber(button.dataset.num);
        calculator.updateDisplay();
    });
});

allClearButton.addEventListener('click', () => {
    calculator.clear();
    calculator.updateDisplay();
});

deleteButton.addEventListener('click', () => {
    calculator.delete();
    calculator.updateDisplay();
});

operationButtons.forEach((button) => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.dataset.op);
        calculator.updateDisplay();
    });
});

equalsButton.addEventListener('click', () => {
    calculator.compute();
    calculator.updateDisplay();
});

// Initialiser l'affichage de l'historique au démarrage
updateHistoryDisplay();
