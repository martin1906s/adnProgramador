// Configuración de la cuadrícula
const GRID_SIZE = 10; // Tamaño de la cuadrícula (10x10)
const CELL_SIZE = 50; // Tamaño de cada celda en píxeles
const POINT_SIZE = 12; // Tamaño de los puntos

// Colores disponibles para los puntos
const POINT_COLORS = [
    { id: 1, color: '#ff0080', name: 'Rosa' },      // neon-pink
    { id: 2, color: '#ffff00', name: 'Amarillo' },      // neon-yellow
    { id: 3, color: '#00ff88', name: 'Verde' },     // neon-green
    { id: 4, color: '#ff00ff', name: 'Magenta' },   // neon-magenta
    { id: 5, color: '#a855f7', name: 'Púrpura' },   // neon-purple
    { id: 6, color: '#0080ff', name: 'Azul' }       // neon-blue
];

const COLOR_MAP = new Map(POINT_COLORS.map((entry) => [entry.id, entry]));

const POINT_DEFINITIONS = [
    {
        colorId: 1,
        digit: '7',
        absolute: { x: 5, y: 6 },
        customHint: 'Punto Rosa base: coordenada fija (x:5, y:6).'
    },
    {
        colorId: 6,
        digit: '3',
        relativeTo: 1,
        dx: 2,
        dy: 2
    },
    {
        colorId: 3,
        digit: '9',
        relativeTo: 6,
        dx: -3,
        dy: 1
    },
    {
        colorId: 2,
        digit: '4',
        relativeTo: 3,
        dx: 2,
        dy: -4
    },
    {
        colorId: 5,
        digit: '6',
        relativeTo: 2,
        dx: -3,
        dy: 2
    },
    {
        colorId: 4,
        digit: '8',
        relativeTo: 5,
        dx: 5,
        dy: -3
    }
];

function describeOffset(dx, dy) {
    const parts = [];

    if (dx > 0) {
        parts.push(`avanza ${dx} unidad${dx === 1 ? '' : 'es'} a la derecha`);
    } else if (dx < 0) {
        const step = Math.abs(dx);
        parts.push(`retrocede ${step} unidad${step === 1 ? '' : 'es'} a la izquierda`);
    }

    if (dy > 0) {
        parts.push(`sube ${dy} unidad${dy === 1 ? '' : 'es'}`);
    } else if (dy < 0) {
        const step = Math.abs(dy);
        parts.push(`baja ${step} unidad${step === 1 ? '' : 'es'}`);
    }

    if (parts.length === 0) {
        return 'mantente en la misma posición.';
    }

    if (parts.length === 1) {
        return `${parts[0]}.`;
    }

    return `${parts.slice(0, -1).join(' ')} y ${parts[parts.length - 1]}.`;
}

function shuffleArray(items) {
    const array = [...items];
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const computedPoints = new Map();

const PUZZLE_POINTS = POINT_DEFINITIONS.map((definition) => {
    let x;
    let y;
    let hint;

    if (definition.absolute) {
        x = definition.absolute.x;
        y = definition.absolute.y;
        hint = definition.customHint || `Punto ${COLOR_MAP.get(definition.colorId)?.name || ''}: coordenada fija (x:${x}, y:${y}).`;
    } else {
        const referencePoint = computedPoints.get(definition.relativeTo);
        if (!referencePoint) {
            throw new Error(`No se encontró el punto de referencia para el colorId ${definition.colorId}`);
        }
        x = referencePoint.x + definition.dx;
        y = referencePoint.y + definition.dy;
        const fromColor = COLOR_MAP.get(definition.relativeTo)?.name || 'referencia';
        const offsetDescription = describeOffset(definition.dx, definition.dy);
        hint = `Desde el punto ${fromColor} ${offsetDescription}`;
    }

    const point = {
        colorId: definition.colorId,
        x,
        y,
        digit: definition.digit,
        hint,
        reference: definition.relativeTo ?? null,
        dx: definition.dx ?? 0,
        dy: definition.dy ?? 0
    };

    computedPoints.set(definition.colorId, point);
    return point;
});

const ACTIVE_COLOR_IDS = Array.from(new Set(PUZZLE_POINTS.map((point) => point.colorId)));

const CODE_LENGTH = PUZZLE_POINTS.length;
const EXPECTED_CODE = PUZZLE_POINTS.map((point) => point.digit).join('');
const CODE_PLACEHOLDER = '•';
const MAX_INPUT_LENGTH = Math.max(8, CODE_LENGTH);

PUZZLE_POINTS.forEach((point) => {
    if (point.x < 0 || point.x > GRID_SIZE || point.y < 0 || point.y > GRID_SIZE) {
        console.warn('[Nivel 3] Punto fuera de rango detectado:', point);
    }
});

// Estado del juego
let placedPoints = {}; // { 'x-y': { colorId: 1, element: pointElement, corner: 'top-right' } }
let draggedPoint = null;
let draggedColorId = null;
let dragGhost = null; // Elemento fantasma que sigue al cursor
let dragOffset = { x: 0, y: 0 }; // Offset del cursor respecto al punto
let connectionLayer = null;

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    createGrid();
    loadPoints();
    displayCoordinates();
    updateCounts();
    
    setupLevelAccess();
    
    console.log('[Nivel 3] Código esperado:', EXPECTED_CODE);
});

// Crear la cuadrícula cartesiana
function createGrid() {
    const gridContainer = document.getElementById('grid-container');
    gridContainer.innerHTML = '';
    connectionLayer = null;
    
    // Crear contenedor de la cuadrícula con ejes
    // El grid tiene 11 líneas (0 a 10) en cada dirección
    // Las celdas están entre las líneas, así que hay 10x10 celdas
    const gridWrapper = document.createElement('div');
    gridWrapper.className = 'grid-wrapper';
    gridWrapper.style.cssText = `
        position: relative;
        width: ${(GRID_SIZE + 1) * CELL_SIZE}px;
        height: ${(GRID_SIZE + 1) * CELL_SIZE}px;
        margin: 0 auto;
    `;

    // Dibujar líneas verticales (x = 0, 1, 2, ..., 10)
    for (let x = 0; x <= GRID_SIZE; x++) {
        const line = document.createElement('div');
        line.className = 'grid-line-vertical';
        line.style.cssText = `
            position: absolute;
            left: ${x * CELL_SIZE}px;
            top: 0;
            width: 2px;
            height: ${GRID_SIZE * CELL_SIZE}px;
            background: var(--neon-cyan);
            box-shadow: var(--glow-cyan);
            z-index: 1;
        `;
        gridWrapper.appendChild(line);
    }

    // Dibujar líneas horizontales (y = 0, 1, 2, ..., 10)
    // y=0 está abajo, y=10 está arriba
    for (let y = 0; y <= GRID_SIZE; y++) {
        const line = document.createElement('div');
        line.className = 'grid-line-horizontal';
        line.style.cssText = `
            position: absolute;
            left: 0;
            top: ${(GRID_SIZE - y) * CELL_SIZE}px;
            width: ${GRID_SIZE * CELL_SIZE}px;
            height: 2px;
            background: var(--neon-cyan);
            box-shadow: var(--glow-cyan);
            z-index: 1;
        `;
        gridWrapper.appendChild(line);
    }

    // Eje Y (vertical) - línea x=0 (borde izquierdo)
    const yAxis = document.createElement('div');
    yAxis.className = 'axis-y';
    yAxis.style.cssText = `
        position: absolute;
        left: 0;
        top: 0;
        width: 2px;
        height: ${GRID_SIZE * CELL_SIZE}px;
        background: var(--neon-cyan);
        box-shadow: var(--glow-cyan);
        z-index: 2;
    `;

    // Eje X (horizontal) - línea y=0 (borde inferior)
    const xAxis = document.createElement('div');
    xAxis.className = 'axis-x';
    xAxis.style.cssText = `
        position: absolute;
        left: 0;
        top: ${GRID_SIZE * CELL_SIZE}px;
        width: ${GRID_SIZE * CELL_SIZE}px;
        height: 2px;
        background: var(--neon-cyan);
        box-shadow: var(--glow-cyan);
        z-index: 2;
    `;

    // Etiqueta "Y" para el eje Y (arriba del eje, centrada horizontalmente)
    const yAxisLabel = document.createElement('div');
    yAxisLabel.textContent = 'Y';
    yAxisLabel.style.cssText = `
        position: absolute;
        left: -${CELL_SIZE / 2 + 12}px;
        top: -35px;
        color: var(--neon-cyan);
        font-weight: 900;
        font-size: 22px;
        text-shadow: var(--glow-cyan);
        width: ${CELL_SIZE}px;
        text-align: center;
        letter-spacing: 2px;
    `;
    gridWrapper.appendChild(yAxisLabel);

    // Etiquetas del eje Y (de abajo hacia arriba: 0, 1, 2, ..., 9, 10)
    // Las etiquetas están exactamente sobre las líneas horizontales
    // y=0 está abajo, y=10 está arriba
    for (let y = 0; y <= GRID_SIZE; y++) {
        const label = document.createElement('div');
        label.className = 'axis-label-y';
        const yValue = y; // 0, 1, 2, ..., 9, 10 (y aumenta hacia arriba)
        label.textContent = yValue;
        // La línea horizontal y está en: (GRID_SIZE - y) * CELL_SIZE desde arriba
        // y=0 (abajo) -> top = GRID_SIZE * CELL_SIZE
        // y=10 (arriba) -> top = 0
        // Posición: centrar la etiqueta sobre la línea
        const labelPosition = (GRID_SIZE - y) * CELL_SIZE - 10;
        label.style.cssText = `
            position: absolute;
            left: -${CELL_SIZE}px;
            top: ${labelPosition}px;
            width: ${CELL_SIZE}px;
            text-align: center;
            color: var(--neon-cyan);
            font-weight: 700;
            font-size: 14px;
        `;
        label.dataset.yValue = yValue;
        gridWrapper.appendChild(label);
    }

    // Etiqueta "X" para el eje X (a la derecha del eje, centrada verticalmente con los números)
    const xAxisLabel = document.createElement('div');
    xAxisLabel.textContent = 'X';
    xAxisLabel.style.cssText = `
        position: absolute;
        left: ${GRID_SIZE * CELL_SIZE + 18}px;
        top: ${GRID_SIZE * CELL_SIZE - 8}px;
        color: var(--neon-cyan);
        font-weight: 900;
        font-size: 22px;
        text-shadow: var(--glow-cyan);
        line-height: 30px;
        letter-spacing: 2px;
    `;
    gridWrapper.appendChild(xAxisLabel);

    // Etiquetas del eje X (de izquierda a derecha: 0, 1, 2, 3, ..., 9, 10)
    // Las etiquetas están exactamente sobre las líneas verticales
    for (let x = 0; x <= GRID_SIZE; x++) {
        const label = document.createElement('div');
        label.className = 'axis-label-x';
        const xValue = x; // 0, 1, 2, 3, ..., 10
        label.textContent = xValue;
        // La línea vertical x está en: x * CELL_SIZE
        // Posición: centrar la etiqueta sobre la línea
        const labelPosition = x * CELL_SIZE - 10;
        label.style.cssText = `
            position: absolute;
            left: ${labelPosition}px;
            top: ${GRID_SIZE * CELL_SIZE}px;
            width: 20px;
            text-align: center;
            color: var(--neon-cyan);
            font-weight: 700;
            font-size: 14px;
            line-height: 30px;
        `;
        label.dataset.xValue = xValue;
        gridWrapper.appendChild(label);
    }

    // Crear celdas de la cuadrícula
    // Las celdas están entre las líneas, así que hay 10x10 celdas
    // La celda (row, col) está entre:
    // - Líneas verticales: x = col (izquierda) y x = col + 1 (derecha)
    // - Líneas horizontales: y = GRID_SIZE - row (arriba) y y = GRID_SIZE - row - 1 (abajo)
    // La esquina superior derecha de la celda está en la intersección (x=col+1, y=GRID_SIZE-row)
    const gridCells = document.createElement('div');
    gridCells.className = 'grid-cells';
    gridCells.style.cssText = `
        position: absolute;
        left: 0;
        top: 0;
        width: ${GRID_SIZE * CELL_SIZE}px;
        height: ${GRID_SIZE * CELL_SIZE}px;
        display: grid;
        grid-template-columns: repeat(${GRID_SIZE}, ${CELL_SIZE}px);
        grid-template-rows: repeat(${GRID_SIZE}, ${CELL_SIZE}px);
    `;
    
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            // La celda (row, col) tiene su esquina superior derecha en:
            // x = col + 1, y = GRID_SIZE - row
            // Pero ahora y aumenta hacia arriba (y=0 abajo, y=10 arriba)
            // row=0 es la fila superior, row=GRID_SIZE-1 es la fila inferior
            // La esquina superior derecha está en y = GRID_SIZE - row
            // Pero como y ahora aumenta hacia arriba, esto significa:
            // - row=0 (fila superior) -> y = GRID_SIZE (10, arriba)
            // - row=GRID_SIZE-1 (fila inferior) -> y = 1 (1, arriba de y=0)
            // Para las coordenadas objetivo (0-9), la intersección está en y = objY + 1
            // Entonces: GRID_SIZE - row = objY + 1 -> row = GRID_SIZE - objY - 1
            // Por lo tanto: objY = GRID_SIZE - row - 1
            const coordX = col + 1; // Coordenada X (1-10)
            const coordY = GRID_SIZE - row; // Coordenada Y en el grid (10 arriba, 1 abajo)
            // Para las coordenadas objetivo (0-9), donde objY=0 está abajo y objY=9 está arriba:
            // objY = GRID_SIZE - row - 1 = coordY - 1
            cell.dataset.objX = coordX - 1; // Coordenada objetivo X (0-9)
            cell.dataset.objY = coordY - 1; // Coordenada objetivo Y (0 abajo, 9 arriba)
            cell.dataset.x = coordX;
            cell.dataset.y = coordY;
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.style.cssText = `
                border: 1px solid rgba(0, 255, 255, 0.2);
                position: relative;
                cursor: pointer;
                transition: background 0.2s ease;
            `;
            
            // Ya no usamos las celdas para drop, solo para visualización
            // Los puntos se colocarán directamente en las intersecciones de las líneas
            gridCells.appendChild(cell);
        }
    }

    // Crear área de drop que cubre todo el grid para colocar puntos en intersecciones
    // Los puntos se colocarán directamente en las intersecciones de las líneas, no en celdas
    const gridDropArea = document.createElement('div');
    gridDropArea.className = 'grid-drop-area';
    gridDropArea.style.cssText = `
        position: absolute;
        left: 0;
        top: 0;
        width: ${(GRID_SIZE + 1) * CELL_SIZE}px;
        height: ${(GRID_SIZE + 1) * CELL_SIZE}px;
        z-index: 4;
    `;
    gridDropArea.addEventListener('dragover', handleDragOver);
    gridDropArea.addEventListener('drop', handleGridDrop);
    gridDropArea.addEventListener('dragenter', handleDragEnter);
    gridDropArea.addEventListener('dragleave', handleDragLeave);

    gridWrapper.appendChild(yAxis);
    gridWrapper.appendChild(xAxis);
    gridWrapper.appendChild(gridCells);
    gridWrapper.appendChild(gridDropArea);
    gridContainer.appendChild(gridWrapper);
}

// Cargar puntos de colores en el contenedor
function loadPoints() {
    const container = document.getElementById('points-container');
    container.innerHTML = '';
    
    const colorsToDisplay = shuffleArray(ACTIVE_COLOR_IDS.map((id) => COLOR_MAP.get(id)).filter(Boolean));

    colorsToDisplay.forEach((pointColor) => {
        const pointWrapper = document.createElement('div');
        pointWrapper.className = 'point-item';
        pointWrapper.draggable = true;
        pointWrapper.dataset.colorId = pointColor.id;
        
        const point = document.createElement('div');
        point.className = 'color-point';
        point.style.cssText = `
            width: ${POINT_SIZE * 2}px;
            height: ${POINT_SIZE * 2}px;
            background: ${pointColor.color};
            border-radius: 50%;
            border: 2px solid rgba(255, 255, 255, 0.3);
            box-shadow: 0 0 10px ${pointColor.color}, 0 0 20px ${pointColor.color};
            cursor: grab;
            transition: transform 0.2s ease;
        `;
        
        pointWrapper.appendChild(point);
        
        pointWrapper.addEventListener('dragstart', handleDragStart);
        pointWrapper.addEventListener('dragend', handleDragEnd);
        pointWrapper.addEventListener('mouseenter', () => {
            point.style.transform = 'scale(1.2)';
        });
        pointWrapper.addEventListener('mouseleave', () => {
            point.style.transform = 'scale(1)';
        });
        
        container.appendChild(pointWrapper);
    });
}

// Mostrar coordenadas objetivo
function displayCoordinates() {
    const coordsList = document.getElementById('coordinates-list');
    coordsList.innerHTML = '';

    const shuffledPoints = shuffleArray(PUZZLE_POINTS);

    shuffledPoints.forEach((coord) => {
        const pointColor = COLOR_MAP.get(coord.colorId);
        if (!pointColor) return;

        const isSolved = isCoordinatePlaced(coord.x, coord.y, coord.colorId);
        
        const coordItem = document.createElement('div');
        coordItem.className = 'coord-item';
        coordItem.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            text-align: center;
        `;
        
        const colorPoint = document.createElement('div');
        colorPoint.className = 'color-point';
        colorPoint.style.cssText = `
            width: ${POINT_SIZE * 2}px;
            height: ${POINT_SIZE * 2}px;
            background: ${pointColor.color};
            border-radius: 50%;
            border: 2px solid rgba(255, 255, 255, 0.3);
            box-shadow: 0 0 10px ${pointColor.color}, 0 0 20px ${pointColor.color};
            opacity: ${isSolved ? '0.5' : '1'};
            transition: opacity 0.3s ease;
        `;
 
        const coordText = document.createElement('div');
        coordText.textContent = coord.reference === null
            ? `(x:${coord.x}, y:${coord.y})`
            : coord.hint;
        coordText.style.cssText = `
            color: var(--neon-purple);
            font-weight: 600;
            font-size: 0.85rem;
            letter-spacing: 0.5px;
        `;
        
        coordItem.appendChild(colorPoint);
        coordItem.appendChild(coordText);
        coordsList.appendChild(coordItem);
    });
}

// Verificar si una coordenada está colocada correctamente
function isCoordinatePlaced(x, y, colorId) {
    // Las coordenadas objetivo se almacenan en PUZZLE_POINTS con valores 0-9
    // Cuando el usuario coloca un punto, se guarda con objX y objY que van de 0 a 10
    // La clave se forma como `${x}-${y}` directamente
    const key = `${x}-${y}`;
    const placed = placedPoints[key];
    
    if (!placed) {
        return false;
    }
    
    if (placed.colorId !== colorId) {
        return false;
    }
    
    // El punto está correctamente colocado
    return true;
}

// Actualizar contadores
function updateCounts() {
    const placedCount = Object.keys(placedPoints).length;
    const correctCount = PUZZLE_POINTS.filter(coord => 
        isCoordinatePlaced(coord.x, coord.y, coord.colorId)
    ).length;
    const totalTargets = PUZZLE_POINTS.length;
    const allCorrect = correctCount === totalTargets;
    
    const coordsCount = document.getElementById('coords-count');
    if (coordsCount) {
        coordsCount.textContent = `${correctCount}/${totalTargets}`;
    }
    
    const imagesCount = document.getElementById('images-count');
    if (imagesCount) {
        const remaining = Math.max(ACTIVE_COLOR_IDS.length - placedCount, 0);
        imagesCount.textContent = `${remaining}`;
    }

    updateCodeDisplay();
    updateConnectionLines(allCorrect);
}

function updateCodeDisplay() {
    const codeSlots = document.getElementById('code-slots');
    if (!codeSlots) return;

    const digits = PUZZLE_POINTS.map((point) =>
        isCoordinatePlaced(point.x, point.y, point.colorId) ? point.digit : CODE_PLACEHOLDER
    );

    codeSlots.dataset.code = digits.join('');
    codeSlots.textContent = digits.join(' ');
}

function ensureConnectionLayer() {
    const gridWrapper = document.querySelector('.grid-wrapper');
    if (!gridWrapper) {
        connectionLayer = null;
        return null;
    }

    if (connectionLayer && connectionLayer.isConnected) {
        return connectionLayer;
    }

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('connection-layer');
    svg.setAttribute('width', (GRID_SIZE + 1) * CELL_SIZE);
    svg.setAttribute('height', (GRID_SIZE + 1) * CELL_SIZE);
    svg.style.position = 'absolute';
    svg.style.left = '0';
    svg.style.top = '0';
    svg.style.pointerEvents = 'none';
    svg.style.zIndex = '3';

    gridWrapper.appendChild(svg);
    connectionLayer = svg;
    return connectionLayer;
}

function updateConnectionLines(allCorrect) {
    const layer = ensureConnectionLayer();
    if (!layer) return;

    layer.innerHTML = '';
    if (!allCorrect) {
        return;
    }

    const points = [];

    for (const coord of PUZZLE_POINTS) {
        const key = `${coord.x}-${coord.y}`;
        const placed = placedPoints[key];
        if (!placed) {
            return;
        }

        const xPx = coord.x * CELL_SIZE;
        const yPx = (GRID_SIZE - coord.y) * CELL_SIZE;
        points.push(`${xPx},${yPx}`);
    }

    if (points.length !== PUZZLE_POINTS.length) {
        return;
    }

    const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    polyline.setAttribute('points', points.join(' '));
    polyline.setAttribute('fill', 'none');
    polyline.setAttribute('stroke', '#00ff88');
    polyline.setAttribute('stroke-width', '3');
    polyline.setAttribute('stroke-linecap', 'round');
    polyline.setAttribute('stroke-linejoin', 'round');
    polyline.style.filter = 'drop-shadow(0 0 8px rgba(0, 255, 136, 0.6))';

    layer.appendChild(polyline);
}

function setupLevelAccess() {
    levelModalElement = document.getElementById('level-modal');
    keyboardInputField = document.getElementById('keyboard-input');
    const openBtn = document.getElementById('next-level-btn');
    const closeBtn = document.getElementById('level-modal-close');

    if (openBtn) {
        openBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openLevelModal();
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            closeLevelModal();
        });
    }

    if (levelModalElement) {
        levelModalElement.addEventListener('click', (e) => {
            if (e.target === levelModalElement) {
                closeLevelModal();
            }
        });
    }

    document.querySelectorAll('.keyboard-btn').forEach((btn) => {
        const number = btn.dataset.number;
        const action = btn.dataset.action;

        if (number !== undefined) {
            btn.addEventListener('click', () => pressNumber(number));
        } else if (action === 'delete') {
            btn.addEventListener('click', () => pressDelete());
        } else if (action === 'confirm') {
            btn.addEventListener('click', () => pressConfirm());
        }
    });

    updateKeyboardDisplay();
}

let keyboardInput = '';
let levelModalElement = null;
let keyboardInputField = null;

function openLevelModal() {
    if (!levelModalElement) return;
    keyboardInput = '';
    updateKeyboardDisplay();
    levelModalElement.classList.add('show');
    levelModalElement.setAttribute('aria-hidden', 'false');
}

function closeLevelModal() {
    if (!levelModalElement) return;
    levelModalElement.classList.remove('show');
    levelModalElement.setAttribute('aria-hidden', 'true');
    keyboardInput = '';
    updateKeyboardDisplay();
}

function updateKeyboardDisplay() {
    if (!keyboardInputField) return;
    keyboardInputField.value = keyboardInput;
    if (!keyboardInput) {
        keyboardInputField.placeholder = '0';
    }
}

function pressNumber(value) {
    if (keyboardInput.length >= MAX_INPUT_LENGTH) return;
    keyboardInput += value.toString();
    updateKeyboardDisplay();
}

function pressDelete() {
    keyboardInput = keyboardInput.slice(0, -1);
    updateKeyboardDisplay();
}

function areAllPointsCorrect() {
    return PUZZLE_POINTS.every((point) =>
        isCoordinatePlaced(point.x, point.y, point.colorId)
    );
}

function pressConfirm() {
    if (!areAllPointsCorrect()) {
        showMessage('Primero coloca correctamente los 6 puntos.', 'error');
        closeLevelModal();
        return;
    }

    if (keyboardInput.length !== CODE_LENGTH) {
        showMessage(`Ingresa los ${CODE_LENGTH} dígitos del código.`, 'error');
        return;
    }

    if (keyboardInput === EXPECTED_CODE) {
        closeLevelModal();
        showMessage('Código correcto. Avanzando al nivel 5...', 'success');
        setTimeout(() => {
            window.location.href = '../lvl5/index.html';
        }, 900);
    } else {
        showMessage('Código incorrecto. Revisa las pistas e inténtalo de nuevo.', 'error');
        keyboardInput = '';
        updateKeyboardDisplay();
    }
}

// Calcular posición de la esquina según coordenada
function getCornerPosition(x, y) {
    // El punto se coloca en la esquina superior derecha de la celda
    // que corresponde a la intersección de las líneas x e y
    return {
        top: '0px',
        right: '0px'
    };
}

// Manejar inicio de arrastre
function handleDragStart(e) {
    draggedPoint = e.target.closest('.point-item');
    if (!draggedPoint) {
        // Puede ser un punto ya colocado
        draggedPoint = e.target.closest('.grid-placed-point');
        if (draggedPoint) {
            draggedColorId = parseInt(draggedPoint.dataset.colorId);
            draggedPoint.dataset.isMoving = 'true';
            draggedPoint.style.opacity = '0.5';
        }
    } else {
        draggedColorId = parseInt(draggedPoint.dataset.colorId);
        draggedPoint.style.opacity = '0.5';
    }
    
    if (!draggedColorId) return;
    
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', draggedColorId.toString());
    
    // Crear elemento fantasma que sigue al cursor
    createDragGhost(e);
    
    // Agregar listener para mover el fantasma (usar dragover global)
    document.addEventListener('dragover', moveDragGhost, false);
}

// Crear elemento fantasma que sigue al cursor
function createDragGhost(e) {
    const pointColor = COLOR_MAP.get(draggedColorId);
    if (!pointColor) return;
    
    // Obtener el elemento del punto (puede ser .color-point dentro de .point-item o .grid-placed-point directamente)
    let pointElement = draggedPoint.querySelector('.color-point');
    if (!pointElement) {
        pointElement = draggedPoint;
    }
    const rect = pointElement.getBoundingClientRect();
    
    // Crear elemento fantasma del mismo tamaño que el punto final
    dragGhost = document.createElement('div');
    dragGhost.className = 'drag-ghost';
    dragGhost.style.cssText = `
        position: fixed;
        width: ${POINT_SIZE}px;
        height: ${POINT_SIZE}px;
        background: ${pointColor.color};
        border-radius: 50%;
        border: 2px solid rgba(255, 255, 255, 0.5);
        box-shadow: 0 0 8px ${pointColor.color}, 0 0 16px ${pointColor.color};
        pointer-events: none;
        z-index: 10000;
        opacity: 0.8;
        transition: transform 0.1s ease-out;
    `;
    
    // Calcular offset del cursor respecto al centro del punto
    const mouseX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    const mouseY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
    
    // El offset es la mitad del tamaño del punto para centrarlo en el cursor
    dragOffset.x = POINT_SIZE / 2;
    dragOffset.y = POINT_SIZE / 2;
    
    // Posicionar el fantasma centrado en el cursor
    dragGhost.style.left = `${mouseX - dragOffset.x}px`;
    dragGhost.style.top = `${mouseY - dragOffset.y}px`;
    
    document.body.appendChild(dragGhost);
}

// Mover el elemento fantasma siguiendo el cursor
function moveDragGhost(e) {
    if (dragGhost && draggedColorId) {
        const mouseX = e.clientX || 0;
        const mouseY = e.clientY || 0;
        
        if (mouseX > 0 && mouseY > 0) {
            requestAnimationFrame(() => {
                if (dragGhost) {
                    // Centrar el punto en el cursor
                    dragGhost.style.left = `${mouseX - dragOffset.x}px`;
                    dragGhost.style.top = `${mouseY - dragOffset.y}px`;
                }
            });
        }
    }
}

// Manejar fin de arrastre
function handleDragEnd(e) {
    // Remover elemento fantasma inmediatamente (sin animación para que no se vea)
    if (dragGhost) {
        if (dragGhost.parentNode) {
            dragGhost.remove();
        }
        dragGhost = null;
    }
    
    // Remover listeners
    document.removeEventListener('dragover', moveDragGhost, false);
    
    if (draggedPoint) {
        draggedPoint.style.opacity = '1';
        if (draggedPoint.dataset.isMoving) {
            draggedPoint.dataset.isMoving = 'false';
        }
    }
    draggedPoint = null;
    draggedColorId = null;
    dragOffset = { x: 0, y: 0 };
    
    // Limpiar estilos de hover de las celdas
    document.querySelectorAll('.grid-cell').forEach(cell => {
        cell.style.background = '';
    });
}

// Manejar arrastre sobre celda
function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

// Manejar entrada al área de drop
function handleDragEnter(e) {
    e.preventDefault();
    const dropArea = e.target.closest('.grid-drop-area');
    if (dropArea) {
        dropArea.style.background = 'rgba(0, 255, 255, 0.05)';
    }
}

// Manejar salida del área de drop
function handleDragLeave(e) {
    const dropArea = e.target.closest('.grid-drop-area');
    if (dropArea) {
        dropArea.style.background = '';
    }
}

// Manejar soltar punto en el grid (calcula la intersección más cercana)
function handleGridDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const dropArea = e.target.closest('.grid-drop-area');
    if (!dropArea || !draggedColorId) return;
    
    // Obtener la posición del mouse relativa al grid
    const gridWrapper = dropArea.closest('.grid-wrapper');
    const rect = gridWrapper.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Calcular la intersección más cercana
    // Las intersecciones están directamente en las líneas del grid (0 a 10)
    // Todas las líneas son válidas para colocar puntos, incluyendo la línea 0
    // Cuando colocas en la línea 0, la coordenada es 0
    // Cuando colocas en la línea 1, la coordenada es 1
    // Cuando colocas en la línea 2, la coordenada es 2
    
    // Calcular qué línea vertical está más cerca del mouse
    // mouseX / CELL_SIZE nos da la línea (0 a GRID_SIZE)
    const lineX = Math.round(mouseX / CELL_SIZE);
    // Las intersecciones están en las líneas 0-10 directamente
    // Si lineX = 0, objX = 0 (línea x=0)
    // Si lineX = 1, objX = 1
    // Si lineX = 2, objX = 2
    // objX va de 0 a 10 (corresponde directamente a las líneas)
    const objX = Math.max(0, Math.min(GRID_SIZE, lineX));
    
    // Calcular qué línea horizontal está más cerca del mouse
    // mouseY aumenta hacia abajo (0 arriba, GRID_SIZE*CELL_SIZE abajo)
    // Las líneas y van de 0 (abajo) a 10 (arriba)
    // La línea y está en top = (GRID_SIZE - y) * CELL_SIZE
    // Si queremos encontrar la línea y más cercana a mouseY:
    // (GRID_SIZE - y) * CELL_SIZE ≈ mouseY
    // GRID_SIZE - y ≈ mouseY / CELL_SIZE
    // y ≈ GRID_SIZE - mouseY / CELL_SIZE
    // Las intersecciones están en las líneas 0-10 directamente
    // Si lineY = 0, objY = 0 (línea y=0)
    // Si lineY = 1, objY = 1
    // Si lineY = 2, objY = 2
    // objY va de 0 a 10 (corresponde directamente a las líneas, y aumenta hacia arriba)
    const lineY = Math.round(GRID_SIZE - mouseY / CELL_SIZE);
    const objY = Math.max(0, Math.min(GRID_SIZE, lineY));
    
    const key = `${objX}-${objY}`;
    
    // Verificar si estamos moviendo un punto ya colocado
    const movingPoint = document.querySelector('.grid-placed-point[data-is-moving="true"]');
    
    if (movingPoint) {
        // Es un punto ya colocado que se está moviendo
        const oldX = parseInt(movingPoint.dataset.cellX);
        const oldY = parseInt(movingPoint.dataset.cellY);
        const oldKey = `${oldX}-${oldY}`;
        
        if (oldKey === key) {
            movingPoint.dataset.isMoving = 'false';
            movingPoint.style.opacity = '1';
            dropArea.style.background = '';
            return;
        }
        
        // Remover punto de la posición anterior
        if (placedPoints[oldKey]) {
            delete placedPoints[oldKey];
        }
    } else {
        // Es un punto nuevo del panel lateral
        // Remover punto anterior si existe en esta posición
        if (placedPoints[key]) {
            placedPoints[key].element.remove();
            delete placedPoints[key];
        }
    }
    
    // Obtener el color del punto
    const pointColor = COLOR_MAP.get(draggedColorId);
    if (!pointColor) return;
    
    // Crear contenedor para el punto si no existe
    let pointContainer = gridWrapper.querySelector('.grid-points-container');
    if (!pointContainer) {
        pointContainer = document.createElement('div');
        pointContainer.className = 'grid-points-container';
        pointContainer.style.cssText = `
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 5;
        `;
        gridWrapper.appendChild(pointContainer);
    }
    
    // Calcular posición absoluta del punto en la intersección
    // objX y objY van de 0 a 10 directamente (corresponden a las líneas 0-10)
    // objX=0 está en la línea vertical x=0 (borde izquierdo)
    // objY=0 está en la línea horizontal y=0 (borde inferior)
    // La intersección está directamente en la línea x = objX, y = objY
    // Posición en píxeles:
    // - pointX = objX * CELL_SIZE
    // - pointY = (GRID_SIZE - objY) * CELL_SIZE
    const pointX = objX * CELL_SIZE;
    const pointY = (GRID_SIZE - objY) * CELL_SIZE;
    
    // Crear o actualizar el punto
    let pointElement;
    if (movingPoint) {
        pointElement = movingPoint;
        pointElement.dataset.isMoving = 'false';
        pointElement.style.opacity = '1';
    } else {
        pointElement = document.createElement('div');
        pointElement.className = 'grid-placed-point';
        pointElement.draggable = true;
        pointElement.dataset.colorId = draggedColorId;
        pointElement.addEventListener('dragstart', handleDragStart);
        pointElement.addEventListener('dragend', handleDragEnd);
    }
    
    pointElement.dataset.cellX = objX;
    pointElement.dataset.cellY = objY;
    pointElement.dataset.corner = 'intersection';
    
    pointElement.style.cssText = `
        width: ${POINT_SIZE}px;
        height: ${POINT_SIZE}px;
        background: ${pointColor.color};
        border-radius: 50%;
        border: 2px solid rgba(255, 255, 255, 0.5);
        box-shadow: 0 0 8px ${pointColor.color}, 0 0 16px ${pointColor.color};
        position: absolute;
        left: ${pointX}px;
        top: ${pointY}px;
        cursor: grab;
        transition: transform 0.2s ease;
        transform: translate(-50%, -50%);
        pointer-events: auto;
    `;
    
    // Guardar transform para el hover
    pointElement.dataset.transform = 'translate(-50%, -50%)';
    
    // Actualizar eventos de hover
    pointElement.removeEventListener('mouseenter', pointElement._hoverEnter);
    pointElement.removeEventListener('mouseleave', pointElement._hoverLeave);
    
    pointElement._hoverEnter = () => {
        pointElement.style.transform = 'translate(-50%, -50%) scale(1.3)';
    };
    pointElement._hoverLeave = () => {
        pointElement.style.transform = 'translate(-50%, -50%)';
    };
    
    pointElement.addEventListener('mouseenter', pointElement._hoverEnter);
    pointElement.addEventListener('mouseleave', pointElement._hoverLeave);
    
    if (!movingPoint) {
        pointContainer.appendChild(pointElement);
    }
    
    // Actualizar registro
    placedPoints[key] = {
        colorId: draggedColorId,
        element: pointElement,
        container: pointContainer,
        corner: 'intersection'
    };
    
    // Limpiar estilo de hover
    dropArea.style.background = '';
    
    // Actualizar interfaz
    displayCoordinates();
    updateCounts();
}

// Función obsoleta - mantener por compatibilidad pero no se usa
function handleLineDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const lineArea = e.target.closest('.grid-line-area');
    if (!lineArea || !draggedColorId) return;
    
    const lineType = lineArea.dataset.lineType; // 'x' o 'y'
    const lineValue = parseInt(lineArea.dataset.lineValue); // 0
    
    // Obtener la posición del mouse relativa al grid
    const gridWrapper = lineArea.closest('.grid-wrapper');
    const rect = gridWrapper.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    let x, y;
    
    if (lineType === 'y') {
        // Línea Y=0: calcular X basado en la posición del mouse
        // Las intersecciones en Y=0 van de x=0 a x=9 (objX de 0 a 9)
        // La intersección está en la línea x = objX + 1
        // mouseX / CELL_SIZE nos da aproximadamente la línea, pero necesitamos objX
        // Si mouseX está cerca de la línea x, entonces objX = x - 1
        const lineX = Math.round(mouseX / CELL_SIZE);
        x = Math.max(0, Math.min(GRID_SIZE - 1, lineX - 1)); // objX entre 0 y 9
        y = 0; // objY = 0 (línea y=0, abajo)
    } else if (lineType === 'x') {
        // Línea X=0: calcular Y basado en la posición del mouse
        // mouseY aumenta hacia abajo, pero objY aumenta hacia arriba
        // mouseY=0 (arriba del grid) -> objY debería ser máximo (9, arriba)
        // mouseY=GRID_SIZE*CELL_SIZE (abajo del grid) -> objY debería ser 0 (abajo)
        // La línea horizontal y está en top = (GRID_SIZE - y) * CELL_SIZE
        // Si queremos encontrar objY tal que la línea y = objY + 1 está cerca de mouseY:
        // (GRID_SIZE - (objY + 1)) * CELL_SIZE ≈ mouseY
        // objY + 1 ≈ GRID_SIZE - mouseY / CELL_SIZE
        // objY ≈ GRID_SIZE - 1 - mouseY / CELL_SIZE
        const calculatedY = GRID_SIZE - 1 - Math.round(mouseY / CELL_SIZE);
        y = Math.max(0, Math.min(GRID_SIZE - 1, calculatedY)); // objY entre 0 y 9
        x = 0; // objX = 0 (línea x=0, izquierda)
    }
    
    const key = `${x}-${y}`;
    
    // Verificar si estamos moviendo un punto ya colocado
    const movingPoint = document.querySelector('.grid-placed-point[data-is-moving="true"]');
    
    if (movingPoint) {
        // Es un punto ya colocado que se está moviendo
        const oldX = parseInt(movingPoint.dataset.cellX);
        const oldY = parseInt(movingPoint.dataset.cellY);
        const oldKey = `${oldX}-${oldY}`;
        
        if (oldKey === key) {
            movingPoint.dataset.isMoving = 'false';
            movingPoint.style.opacity = '1';
            return;
        }
        
        // Remover punto de la posición anterior
        if (placedPoints[oldKey]) {
            delete placedPoints[oldKey];
        }
    } else {
        // Es un punto nuevo del panel lateral
        // Remover punto anterior si existe en esta posición
        if (placedPoints[key]) {
            placedPoints[key].element.remove();
            delete placedPoints[key];
        }
    }
    
    // Obtener el color del punto
    const pointColor = COLOR_MAP.get(draggedColorId);
    if (!pointColor) return;
    
    // Crear contenedor para el punto si no existe
    let pointContainer = gridWrapper.querySelector('.grid-points-container');
    if (!pointContainer) {
        pointContainer = document.createElement('div');
        pointContainer.className = 'grid-points-container';
        pointContainer.style.cssText = `
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 5;
        `;
        gridWrapper.appendChild(pointContainer);
    }
    
    // Calcular posición absoluta del punto en la intersección
    // x y y son las coordenadas objetivo (objX, objY)
    // objX=0 está a la izquierda, objX aumenta hacia la derecha
    // objY=0 está abajo, objY aumenta hacia arriba
    // La intersección está en la línea x = objX + 1, y = objY + 1
    // Posición en píxeles:
    // - pointX = (objX + 1) * CELL_SIZE
    // - pointY = (GRID_SIZE - (objY + 1)) * CELL_SIZE
    const pointX = (x + 1) * CELL_SIZE;
    const pointY = (GRID_SIZE - y - 1) * CELL_SIZE;
    
    // Crear o actualizar el punto
    let pointElement;
    if (movingPoint) {
        pointElement = movingPoint;
        pointElement.dataset.isMoving = 'false';
        pointElement.style.opacity = '1';
    } else {
        pointElement = document.createElement('div');
        pointElement.className = 'grid-placed-point';
        pointElement.draggable = true;
        pointElement.dataset.colorId = draggedColorId;
        pointElement.addEventListener('dragstart', handleDragStart);
        pointElement.addEventListener('dragend', handleDragEnd);
    }
    
    pointElement.dataset.cellX = x;
    pointElement.dataset.cellY = y;
    pointElement.dataset.corner = 'intersection';
    
    pointElement.style.cssText = `
        width: ${POINT_SIZE}px;
        height: ${POINT_SIZE}px;
        background: ${pointColor.color};
        border-radius: 50%;
        border: 2px solid rgba(255, 255, 255, 0.5);
        box-shadow: 0 0 8px ${pointColor.color}, 0 0 16px ${pointColor.color};
        position: absolute;
        left: ${pointX}px;
        top: ${pointY}px;
        cursor: grab;
        transition: transform 0.2s ease;
        transform: translate(-50%, -50%);
        pointer-events: auto;
    `;
    
    // Guardar transform para el hover
    pointElement.dataset.transform = 'translate(-50%, -50%)';
    
    // Actualizar eventos de hover
    pointElement.removeEventListener('mouseenter', pointElement._hoverEnter);
    pointElement.removeEventListener('mouseleave', pointElement._hoverLeave);
    
    pointElement._hoverEnter = () => {
        pointElement.style.transform = 'translate(-50%, -50%) scale(1.3)';
    };
    pointElement._hoverLeave = () => {
        pointElement.style.transform = 'translate(-50%, -50%)';
    };
    
    pointElement.addEventListener('mouseenter', pointElement._hoverEnter);
    pointElement.addEventListener('mouseleave', pointElement._hoverLeave);
    
    if (!movingPoint) {
        pointContainer.appendChild(pointElement);
    }
    
    // Actualizar registro
    placedPoints[key] = {
        colorId: draggedColorId,
        element: pointElement,
        container: pointContainer,
        corner: 'intersection'
    };
    
    // Limpiar estilo de hover
    lineArea.style.background = '';
    
    // Actualizar interfaz
    displayCoordinates();
    updateCounts();
}

// Manejar soltar punto en celda (maneja tanto puntos nuevos como colocados)
function handleCellDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const cell = e.target.closest('.grid-cell');
    if (!cell || !draggedColorId) return;
    
    // Verificar si estamos moviendo un punto ya colocado
    const movingPoint = document.querySelector('.grid-placed-point[data-is-moving="true"]');
    
    if (movingPoint) {
        // Es un punto ya colocado que se está moviendo
        handlePlacedPointDrop(e);
        return;
    }
    
    // Es un punto nuevo del panel lateral
    // La celda (row, col) tiene su esquina superior derecha en la intersección (x=col+1, y=GRID_SIZE-row)
    // Pero las coordenadas objetivo van de 0 a 9, así que usamos objX y objY
    const objX = parseInt(cell.dataset.objX); // Coordenada objetivo X (0-9)
    const objY = parseInt(cell.dataset.objY); // Coordenada objetivo Y (9-0)
    const key = `${objX}-${objY}`; // Usar coordenadas objetivo para el key
    
    // Remover punto anterior si existe en esta posición
    if (placedPoints[key]) {
        placedPoints[key].element.remove();
        delete placedPoints[key];
    }
    
    // Obtener el color del punto
    const pointColor = COLOR_MAP.get(draggedColorId);
    if (!pointColor) return;
    
    // Obtener el grid wrapper para crear el contenedor de puntos
    const gridWrapper = cell.closest('.grid-wrapper');
    let pointContainer = gridWrapper.querySelector('.grid-points-container');
    if (!pointContainer) {
        pointContainer = document.createElement('div');
        pointContainer.className = 'grid-points-container';
        pointContainer.style.cssText = `
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 5;
        `;
        gridWrapper.appendChild(pointContainer);
    }
    
    // Calcular posición absoluta del punto en la intersección
    // Las coordenadas objetivo: objX y objY van de 0 a 9
    // objY=0 está abajo, objY=9 está arriba
    // La intersección está en la línea y = objY + 1 (porque las líneas van de 0 a 10)
    // La posición Y en píxeles:
    // - objY=0 (línea y=1) -> pointY = (GRID_SIZE - 1) * CELL_SIZE
    // - objY=9 (línea y=10) -> pointY = (GRID_SIZE - 10) * CELL_SIZE = 0
    // Fórmula: pointY = (GRID_SIZE - (objY + 1)) * CELL_SIZE
    const pointX = (objX + 1) * CELL_SIZE;
    const pointY = (GRID_SIZE - objY - 1) * CELL_SIZE;
    
    // Colocar nuevo punto en la intersección
    const pointElement = document.createElement('div');
    pointElement.className = 'grid-placed-point';
    pointElement.draggable = true;
    pointElement.dataset.colorId = draggedColorId;
    pointElement.dataset.cellX = objX;
    pointElement.dataset.cellY = objY;
    pointElement.dataset.corner = 'intersection';
    
    pointElement.style.cssText = `
        width: ${POINT_SIZE}px;
        height: ${POINT_SIZE}px;
        background: ${pointColor.color};
        border-radius: 50%;
        border: 2px solid rgba(255, 255, 255, 0.5);
        box-shadow: 0 0 8px ${pointColor.color}, 0 0 16px ${pointColor.color};
        position: absolute;
        left: ${pointX}px;
        top: ${pointY}px;
        cursor: grab;
        transition: transform 0.2s ease;
        transform: translate(-50%, -50%);
        pointer-events: auto;
    `;
    
    // Guardar transform para el hover
    pointElement.dataset.transform = 'translate(-50%, -50%)';
    
    // Agregar eventos de arrastre al punto colocado
    pointElement.addEventListener('dragstart', handleDragStart);
    pointElement.addEventListener('dragend', handleDragEnd);
    
    // Crear funciones de hover que usen el transform guardado
    pointElement._hoverEnter = () => {
        pointElement.style.transform = 'translate(-50%, -50%) scale(1.3)';
    };
    pointElement._hoverLeave = () => {
        pointElement.style.transform = 'translate(-50%, -50%)';
    };
    
    pointElement.addEventListener('mouseenter', pointElement._hoverEnter);
    pointElement.addEventListener('mouseleave', pointElement._hoverLeave);
    
    pointContainer.appendChild(pointElement);
    placedPoints[key] = {
        colorId: draggedColorId,
        element: pointElement,
        container: pointContainer,
        corner: 'intersection'
    };
    
    // Limpiar estilo de hover
    cell.style.background = '';
    
    // Actualizar interfaz
    displayCoordinates();
    updateCounts();
}

// Función obsoleta - redirigir al nuevo sistema
function handlePlacedPointDrop(e) {
    // Redirigir al nuevo sistema que usa intersecciones directamente
    handleGridDrop(e);
}

// Mostrar mensaje temporal
function showMessage(text, type = 'success') {
    const message = document.createElement('div');
    message.className = `mensaje-temp ${type}`;
    message.textContent = text;
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.style.animation = 'slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1) reverse';
        setTimeout(() => {
            message.remove();
        }, 400);
    }, 3000);
}

