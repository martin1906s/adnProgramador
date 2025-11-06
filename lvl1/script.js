let currentProblem = null;
let cards = [];
let dropZones = [];

const problems = [
  {
    name: "Problema 1",
    text: "María es mayor que Ana, Juan es mayor que María, Pedro es mayor que Juan, Ana es la más joven",
    people: [
      { id: "card-ana", name: "Ana", age: 18 },
      { id: "card-maria", name: "María", age: 20 },
      { id: "card-juan", name: "Juan", age: 25 },
      { id: "card-pedro", name: "Pedro", age: 30 }
    ],
    correctOrder: ["card-ana", "card-maria", "card-juan", "card-pedro"],
    code: "0816"
  },
  {
    name: "Problema 2",
    text: "Carlos es mayor que Laura, David es mayor que Carlos, Sofía es menor que Laura, David es el mayor",
    people: [
      { id: "card-sofia", name: "Sofía", age: 16 },
      { id: "card-laura", name: "Laura", age: 22 },
      { id: "card-carlos", name: "Carlos", age: 28 },
      { id: "card-david", name: "David", age: 35 }
    ],
    correctOrder: ["card-sofia", "card-laura", "card-carlos", "card-david"],
    code: "2847"
  },
  {
    name: "Problema 3",
    text: "Luis es menor que Elena, Elena es menor que Roberto, Roberto es menor que Carmen, Carmen es la mayor",
    people: [
      { id: "card-luis", name: "Luis", age: 20 },
      { id: "card-elena", name: "Elena", age: 24 },
      { id: "card-roberto", name: "Roberto", age: 29 },
      { id: "card-carmen", name: "Carmen", age: 33 }
    ],
    correctOrder: ["card-luis", "card-elena", "card-roberto", "card-carmen"],
    code: "5291"
  },
  {
    name: "Problema 4",
    text: "Andrés es mayor que Patricia, Patricia es menor que Miguel, Miguel es menor que Isabel, Isabel es la mayor",
    people: [
      { id: "card-patricia", name: "Patricia", age: 17 },
      { id: "card-andres", name: "Andrés", age: 21 },
      { id: "card-miguel", name: "Miguel", age: 26 },
      { id: "card-isabel", name: "Isabel", age: 32 }
    ],
    correctOrder: ["card-patricia", "card-andres", "card-miguel", "card-isabel"],
    code: "7364"
  },
  {
    name: "Problema 5",
    text: "Diego es la más joven, Diego es menor que Andrea, Andrea es menor que Fernando, Fernando es menor que Valeria",
    people: [
      { id: "card-diego", name: "Diego", age: 15 },
      { id: "card-andrea", name: "Andrea", age: 23 },
      { id: "card-fernando", name: "Fernando", age: 27 },
      { id: "card-valeria", name: "Valeria", age: 31 }
    ],
    correctOrder: ["card-diego", "card-andrea", "card-fernando", "card-valeria"],
    code: "4192"
  }
];

function initGame() {
  const randomIndex = Math.floor(Math.random() * problems.length);
  currentProblem = problems[randomIndex];
  
  document.getElementById('problem-text').textContent = currentProblem.text;
  document.getElementById('instruction-text').innerHTML = `Arrastra las cards desde el pool de datos hacia las zonas de orden en la parte superior. Debes ordenarlas de <strong>menor a mayor edad</strong> según las pistas proporcionadas.`;
  document.getElementById('result').textContent = '';
  
  const cardsContainer = document.getElementById('cards-container');
  cardsContainer.innerHTML = '';
  
  dropZones = document.querySelectorAll('.drop-zone');
  dropZones.forEach(zone => {
    if (zone.firstElementChild) {
      const existingCard = zone.firstElementChild;
      cardsContainer.appendChild(existingCard);
      existingCard.setAttribute('draggable', 'true');
    }
  });
  
  const shuffledPeople = [...currentProblem.people].sort(() => Math.random() - 0.5);
  
  shuffledPeople.forEach(person => {
    const card = document.createElement('div');
    card.className = 'card';
    card.id = person.id;
    card.draggable = true;
    card.textContent = person.name;
    cardsContainer.appendChild(card);
  });
  
  cards = document.querySelectorAll('.card');
  
  setupDragAndDrop();
}

function setupDragAndDrop() {
  cards.forEach(card => {
    card.addEventListener('dragstart', dragStart);
    card.addEventListener('dragend', dragEnd);
  });

  dropZones.forEach(dropZone => {
    dropZone.addEventListener('dragover', dragOver);
    dropZone.addEventListener('dragleave', dragLeave);
    dropZone.addEventListener('drop', dropCard);
  });
}

function dragStart(e) {
  e.dataTransfer.setData('text', e.target.id);
  setTimeout(() => {
    e.target.style.display = 'none';
  }, 0);
}

function dragEnd(e) {
  e.target.style.display = 'block';
}

function dragOver(e) {
  e.preventDefault();
  e.currentTarget.classList.add('drag-over');
}

function dragLeave(e) {
  e.currentTarget.classList.remove('drag-over');
}

function dropCard(e) {
  e.preventDefault();
  e.currentTarget.classList.remove('drag-over');
  
  const cardId = e.dataTransfer.getData('text');
  const card = document.getElementById(cardId);
  
  if (e.currentTarget.children.length > 0) {
    const existingCard = e.currentTarget.firstElementChild;
    document.getElementById('cards-container').appendChild(existingCard);
    existingCard.setAttribute('draggable', 'true');
  }

  e.currentTarget.appendChild(card);
  card.setAttribute('draggable', 'false');
}

function checkOrder() {
  if (!currentProblem) return;
  
  const dropZonesArray = Array.from(dropZones);
  const cardOrder = dropZonesArray.map(zone => {
    const card = zone.firstElementChild;
    return card ? card.id : null;
  });
  
  let resultText = '';
  let isCorrect = true;

  if (cardOrder.includes(null)) {
    resultText = '¡Incompleto! Debes colocar todas las cards en los lugares.';
    isCorrect = false;
  } else {
    cardOrder.forEach((cardId, index) => {
      if (cardId !== currentProblem.correctOrder[index]) {
        resultText = '¡Incorrecto! El orden no es correcto. Intenta nuevamente.';
        isCorrect = false;
      }
    });
  }

  if (isCorrect) {
    resultText = '¡Correcto! El orden es el adecuado.';
    showModal();
  } else {
    resultText = resultText || '¡Incorrecto! El orden no es correcto. Intenta nuevamente.';
  }

  document.getElementById('result').textContent = resultText;
}

function showModal() {
  document.querySelector('.neon-code').textContent = '0816';
  document.getElementById('modal').style.display = 'block';
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
}

window.onclick = function(event) {
  const modal = document.getElementById('modal');
  if (event.target == modal) {
    closeModal();
  }
  const levelModal = document.getElementById('level-modal');
  if (event.target == levelModal) {
    closeLevelModal();
  }
}

let keyboardInput = '';

function closeLevelModal() {
  document.getElementById('level-modal').style.display = 'none';
}

function pressNumber(number) {
  keyboardInput += number.toString();
  updateKeyboardDisplay();
}

function pressDelete() {
  keyboardInput = keyboardInput.slice(0, -1);
  updateKeyboardDisplay();
}

function pressConfirm() {
  if (keyboardInput === '') {
    alert('Por favor, ingresa un número primero.');
    return;
  }
  
  alert(`Número ingresado: ${keyboardInput}`);
  keyboardInput = '';
  updateKeyboardDisplay();
}

function updateKeyboardDisplay() {
  const input = document.getElementById('keyboard-input');
  if (input) {
    input.value = keyboardInput || '';
    if (keyboardInput === '') {
      input.placeholder = '0';
    }
  }
}

// Limpiar el teclado cuando se abre el modal
function showLevelModal() {
  keyboardInput = '';
  updateKeyboardDisplay();
  document.getElementById('level-modal').style.display = 'block';
}

window.addEventListener('DOMContentLoaded', initGame);
