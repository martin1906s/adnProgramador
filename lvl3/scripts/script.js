// Configuración de la cuadrícula
const GRID_SIZE = 10; // Tamaño de la cuadrícula (10x10)
const CELL_SIZE = 50; // Tamaño de cada celda en píxeles
const GRID_MARGIN = 1; // margen en unidades alrededor del plano
const POINT_SIZE = 12; // Tamaño de los puntos

const GRID_TOTAL_SIZE = (GRID_SIZE + GRID_MARGIN + 1) * CELL_SIZE;

function coordToPixelX(x) {
    return (x + GRID_MARGIN) * CELL_SIZE;
}

function coordToPixelY(y) {
    return (GRID_SIZE - y + GRID_MARGIN) * CELL_SIZE;
}

function pixelToCoordX(pixel) {
    return Math.max(0, Math.min(GRID_SIZE, Math.round(pixel / CELL_SIZE - GRID_MARGIN)));
}

function pixelToCoordY(pixel) {
    return Math.max(0, Math.min(GRID_SIZE, Math.round(GRID_SIZE + GRID_MARGIN - pixel / CELL_SIZE)));
}

// Colores disponibles para los puntos
const POINT_COLORS = [
    { id: 1, color: '#ffff00', name: 'Amarillo' },
    { id: 2, color: '#0080ff', name: 'Azul' },
    { id: 3, color: '#ff8000', name: 'Naranja' },
    { id: 4, color: '#00ff88', name: 'Verde' },
    { id: 5, color: '#a855f7', name: 'Morado' },
    { id: 6, color: '#ffffff', name: 'Blanco' }
];

const COLOR_MAP = new Map(POINT_COLORS.map((entry) => [entry.id, entry]));

const PUZZLE_VARIANTS = [
    {
        id: 'heart',
        name: 'Corazón',
        pointDefinitions: [
            {
                colorId: 3,
                digit: '7',
                absolute: { x: 5, y: 9 },
                customHint: 'Punto Naranja base: coordenada fija (x:5, y:9).'
            },
            {
                colorId: 1,
                digit: '3',
                relativeTo: 3,
                dx: -3,
                dy: -2,
                customHint: 'Desde el punto Naranja retrocede 3 unidades a la izquierda y baja 2 unidades.'
            },
            {
                colorId: 2,
                digit: '9',
                relativeTo: 3,
                dx: -2,
                dy: 1,
                customHint: 'Desde el punto Naranja retrocede 2 unidades a la izquierda y sube 1 unidad.'
            },
            {
                colorId: 4,
                digit: '4',
                relativeTo: 3,
                dx: 2,
                dy: 1,
                customHint: 'Desde el punto Naranja avanza 2 unidades a la derecha y sube 1 unidad.'
            },
            {
                colorId: 5,
                digit: '6',
                relativeTo: 3,
                dx: 3,
                dy: -2,
                customHint: 'Desde el punto Naranja avanza 3 unidades a la derecha y baja 2 unidades.'
            },
            {
                colorId: 6,
                digit: '8',
                relativeTo: 1,
                dx: 3,
                dy: -3,
                customHint: 'Desde el punto Amarillo avanza 3 unidades a la derecha y baja 3 unidades.'
            }
        ],
        connectionPath: [1, 2, 3, 4, 5, 6, 1],
        coordinateOrder: [4, 2, 3, 1, 5, 6]
    },
    {
        id: 'house',
        name: 'Casa',
        pointDefinitions: [
            {
                colorId: 3,
                digit: '5',
                absolute: { x: 5, y: 9 },
                customHint: 'Punto Naranja base: coordenada fija (x:5, y:9).'
            },
            {
                colorId: 4,
                digit: '2',
                relativeTo: 3,
                dx: -2,
                dy: -3,
                customHint: 'Desde el punto Naranja retrocede 2 unidades a la izquierda y baja 3 unidades.'
            },
            {
                colorId: 5,
                digit: '6',
                relativeTo: 3,
                dx: 2,
                dy: -3,
                customHint: 'Desde el punto Naranja avanza 2 unidades a la derecha y baja 3 unidades.'
            },
            {
                colorId: 2,
                digit: '4',
                relativeTo: 3,
                dx: 2,
                dy: -7,
                customHint: 'Desde el punto Naranja avanza 2 unidades a la derecha y baja 7 unidades.'
            },
            {
                colorId: 1,
                digit: '8',
                relativeTo: 3,
                dx: -2,
                dy: -7,
                customHint: 'Desde el punto Naranja retrocede 2 unidades a la izquierda y baja 7 unidades.'
            },
            {
                colorId: 6,
                digit: '1',
                relativeTo: 3,
                dx: 0,
                dy: -7,
                customHint: 'Desde el punto Naranja baja 7 unidades.'
            }
        ],
        connectionPath: [1, 6, 2, 5, 3, 4, 1],
        coordinateOrder: [4, 2, 3, 1, 5, 6]
    },
    {
        id: 'polygon',
        name: 'Polígono',
        pointDefinitions: [
            {
                colorId: 3,
                digit: '4',
                absolute: { x: 5, y: 9 },
                customHint: 'Punto Naranja base: coordenada fija (x:5, y:9).'
            },
            {
                colorId: 4,
                digit: '8',
                relativeTo: 3,
                dx: 4,
                dy: 0,
                customHint: 'Desde el punto Naranja avanza 4 unidades a la derecha.'
            },
            {
                colorId: 5,
                digit: '2',
                relativeTo: 4,
                dx: -1,
                dy: -4,
                customHint: 'Desde el punto Verde retrocede 1 unidad a la izquierda y baja 4 unidades.'
            },
            {
                colorId: 2,
                digit: '6',
                relativeTo: 3,
                dx: 0,
                dy: -6,
                customHint: 'Desde el punto Naranja baja 6 unidades.'
            },
            {
                colorId: 1,
                digit: '1',
                relativeTo: 3,
                dx: -4,
                dy: 0,
                customHint: 'Desde el punto Naranja retrocede 4 unidades a la izquierda.'
            },
            {
                colorId: 6,
                digit: '5',
                relativeTo: 1,
                dx: 1,
                dy: -4,
                customHint: 'Desde el punto Amarillo avanza 1 unidad a la derecha y baja 4 unidades.'
            }
        ],
        connectionPath: [3, 4, 5, 2, 6, 1, 3],
        coordinateOrder: [3, 4, 5, 2, 6, 1]
    }
];

const CODE_PLACEHOLDER = '•';
const BASE_MAX_INPUT_LENGTH = 8;

let CURRENT_PUZZLE = null;
let PUZZLE_POINTS = [];
let ACTIVE_COLOR_IDS = [];
let CONNECTION_PATH = [];
let CODE_LENGTH = 0;
let EXPECTED_CODE = '';
let MAX_INPUT_LENGTH = BASE_MAX_INPUT_LENGTH;

function selectRandomPuzzle() {
    const index = Math.floor(Math.random() * PUZZLE_VARIANTS.length);
    return PUZZLE_VARIANTS[index];
}

function initializePuzzle() {
    CURRENT_PUZZLE = selectRandomPuzzle();

    const computedPoints = new Map();

    CURRENT_PUZZLE.pointDefinitions.forEach((definition) => {
        let x;
        let y;

        if (definition.absolute) {
            x = definition.absolute.x;
            y = definition.absolute.y;
        } else {
            const referencePoint = computedPoints.get(definition.relativeTo);
            if (!referencePoint) {
                throw new Error(`No se encontró el punto de referencia para el colorId ${definition.colorId} en el rompecabezas ${CURRENT_PUZZLE.id}`);
            }
            x = referencePoint.x + definition.dx;
            y = referencePoint.y + definition.dy;
        }

        computedPoints.set(definition.colorId, {
            colorId: definition.colorId,
            digit: definition.digit,
            x,
            y,
            hint: definition.customHint || describeOffset(definition.dx ?? 0, definition.dy ?? 0),
            reference: definition.relativeTo ?? null,
            dx: definition.dx ?? 0,
            dy: definition.dy ?? 0
        });
    });

    PUZZLE_POINTS = Array.from(computedPoints.values());
    ACTIVE_COLOR_IDS = Array.from(new Set(PUZZLE_POINTS.map((point) => point.colorId)));

    PUZZLE_POINTS.forEach((point) => {
        if (point.x < 0 || point.x > GRID_SIZE || point.y < 0 || point.y > GRID_SIZE) {
            console.warn('[Nivel 3] Punto fuera de rango detectado:', point, 'en el rompecabezas', CURRENT_PUZZLE.id);
        }
    });

    const pathSource = CURRENT_PUZZLE.connectionPath && CURRENT_PUZZLE.connectionPath.length
        ? CURRENT_PUZZLE.connectionPath
        : buildConnectionPath(PUZZLE_POINTS);
    CONNECTION_PATH = [...pathSource];

    CODE_LENGTH = PUZZLE_POINTS.length;
    EXPECTED_CODE = PUZZLE_POINTS.map((point) => point.digit).join('');
    MAX_INPUT_LENGTH = Math.max(BASE_MAX_INPUT_LENGTH, CODE_LENGTH);

    console.info(`[Nivel 3] Rompecabezas cargado: ${CURRENT_PUZZLE.name} (${CURRENT_PUZZLE.id}). Código esperado: ${EXPECTED_CODE}`);
}

initializePuzzle();

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

// Orden específico para trazar la figura del corazón (cierra en el primer punto)
function buildConnectionPath(points) {
    const centroid = points.reduce(
        (acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }),
        { x: 0, y: 0 }
    );
    centroid.x /= points.length;
    centroid.y /= points.length;

    const sorted = [...points].sort((a, b) => {
        const angleA = Math.atan2(a.y - centroid.y, a.x - centroid.x);
        const angleB = Math.atan2(b.y - centroid.y, b.x - centroid.x);
        return angleB - angleA; // horario
    });

    const startIndex = sorted.reduce((bestIndex, point, index) => {
        const bestPoint = sorted[bestIndex];
        if (point.y < bestPoint.y || (point.y === bestPoint.y && point.x < bestPoint.x)) {
            return index;
        }
        return bestIndex;
    }, 0);

    const ordered = sorted.slice(startIndex).concat(sorted.slice(0, startIndex));
    const path = ordered.map((point) => point.colorId);
    path.push(path[0]);
    return path;
}

// Estado del juego
let placedPoints = {}; // { 'x-y': { colorId: 1, element: pointElement, container: pointContainer } }
let draggedPoint = null;
let draggedColorId = null;
let dragGhost = null; // Elemento fantasma que sigue al cursor
let dragOffset = { x: 0, y: 0 }; // Offset del cursor respecto al punto
let connectionLayer = null;
let poolContainer = null;

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    poolContainer = document.getElementById('points-container');
    createGrid();
    loadPoints();
    displayCoordinates();
    updateCounts();
    
    setupLevelAccess();
    
    if (CURRENT_PUZZLE) {
        console.log(`[Nivel 3] Rompecabezas activo: ${CURRENT_PUZZLE.name} (${CURRENT_PUZZLE.id}). Código esperado:`, EXPECTED_CODE);
    }
});

// Crear la cuadrícula cartesiana
function createGrid() {
    const gridContainer = document.getElementById('grid-container');
    gridContainer.innerHTML = '';
    connectionLayer = null;

    if (poolContainer && !poolContainer.dataset.dropEnabled) {
        poolContainer.addEventListener('dragover', (e) => {
            if (draggedPoint && draggedPoint.classList.contains('grid-placed-point')) {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
            }
        });
        poolContainer.addEventListener('drop', handlePoolDrop);
        poolContainer.dataset.dropEnabled = 'true';
    }

    const gridWrapper = document.createElement('div');
    gridWrapper.className = 'grid-wrapper';
    gridWrapper.style.cssText = `
        position: relative;
        width: ${GRID_TOTAL_SIZE}px;
        height: ${GRID_TOTAL_SIZE}px;
        margin: 0 auto;
    `;

    // Dibujar líneas verticales (x = 0..GRID_SIZE)
    for (let x = 0; x <= GRID_SIZE; x++) {
        const line = document.createElement('div');
        line.className = 'grid-line-vertical';
        line.style.cssText = `
            position: absolute;
            left: ${coordToPixelX(x)}px;
            top: ${GRID_MARGIN * CELL_SIZE}px;
            width: 2px;
            height: ${GRID_SIZE * CELL_SIZE}px;
            background: var(--neon-cyan);
            box-shadow: var(--glow-cyan);
            z-index: 1;
        `;
        gridWrapper.appendChild(line);
    }

    // Dibujar líneas horizontales (y = 0..GRID_SIZE)
    for (let y = 0; y <= GRID_SIZE; y++) {
        const line = document.createElement('div');
        line.className = 'grid-line-horizontal';
        line.style.cssText = `
            position: absolute;
            left: ${GRID_MARGIN * CELL_SIZE}px;
            top: ${coordToPixelY(y)}px;
            width: ${GRID_SIZE * CELL_SIZE}px;
            height: 2px;
            background: var(--neon-cyan);
            box-shadow: var(--glow-cyan);
            z-index: 1;
        `;
        gridWrapper.appendChild(line);
    }

    // Eje Y (x=0)
    const yAxis = document.createElement('div');
    yAxis.className = 'axis-y';
    yAxis.style.cssText = `
        position: absolute;
        left: ${coordToPixelX(0)}px;
        top: ${GRID_MARGIN * CELL_SIZE}px;
        width: 2px;
        height: ${GRID_SIZE * CELL_SIZE}px;
        background: var(--neon-cyan);
        box-shadow: var(--glow-cyan);
        z-index: 2;
    `;

    // Eje X (y=0)
    const xAxis = document.createElement('div');
    xAxis.className = 'axis-x';
    xAxis.style.cssText = `
        position: absolute;
        left: ${GRID_MARGIN * CELL_SIZE}px;
        top: ${coordToPixelY(0)}px;
        width: ${GRID_SIZE * CELL_SIZE}px;
        height: 2px;
        background: var(--neon-cyan);
        box-shadow: var(--glow-cyan);
        z-index: 2;
    `;

    // Etiqueta Y
    const yAxisLabel = document.createElement('div');
    yAxisLabel.textContent = 'Y';
    yAxisLabel.style.cssText = `
        position: absolute;
        left: ${coordToPixelX(0) - CELL_SIZE * 0.9}px;
        top: ${(GRID_MARGIN * CELL_SIZE) - 35}px;
        color: var(--neon-cyan);
        font-weight: 900;
        font-size: 22px;
        text-shadow: var(--glow-cyan);
        width: ${CELL_SIZE}px;
        text-align: center;
        letter-spacing: 2px;
    `;
    gridWrapper.appendChild(yAxisLabel);

    // Etiquetas de eje Y
    for (let y = 0; y <= GRID_SIZE; y++) {
        const label = document.createElement('div');
        label.className = 'axis-label-y';
        label.textContent = y;
        const labelTop = coordToPixelY(y) - 10;
        label.style.cssText = `
            position: absolute;
            left: ${(coordToPixelX(0) - CELL_SIZE * 0.75)}px;
            top: ${labelTop}px;
            width: ${CELL_SIZE * 0.7}px;
            text-align: right;
            color: var(--neon-cyan);
            font-weight: 700;
            font-size: 14px;
        `;
        label.dataset.yValue = y;
        gridWrapper.appendChild(label);
    }

    // Etiqueta X
    const xAxisLabel = document.createElement('div');
    xAxisLabel.textContent = 'X';
    xAxisLabel.style.cssText = `
        position: absolute;
        left: ${coordToPixelX(GRID_SIZE) + CELL_SIZE * 0.35}px;
        top: ${coordToPixelY(0) + CELL_SIZE * 0.2}px;
        color: var(--neon-cyan);
        font-weight: 900;
        font-size: 22px;
        text-shadow: var(--glow-cyan);
        letter-spacing: 2px;
    `;
    gridWrapper.appendChild(xAxisLabel);

    // Etiquetas de eje X
    for (let x = 0; x <= GRID_SIZE; x++) {
        const label = document.createElement('div');
        label.className = 'axis-label-x';
        label.textContent = x;
        label.style.cssText = `
            position: absolute;
            left: ${coordToPixelX(x) - 10}px;
            top: ${coordToPixelY(0) + CELL_SIZE * 0.25}px;
            width: 20px;
            text-align: center;
            color: var(--neon-cyan);
            font-weight: 700;
            font-size: 14px;
            line-height: 14px;
        `;
        label.dataset.xValue = x;
        gridWrapper.appendChild(label);
    }

    // Crear celdas del grid
    const gridCells = document.createElement('div');
    gridCells.className = 'grid-cells';
    gridCells.style.cssText = `
        position: absolute;
        left: ${GRID_MARGIN * CELL_SIZE}px;
        top: ${GRID_MARGIN * CELL_SIZE}px;
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
            const coordX = col + 1;
            const coordY = GRID_SIZE - row;
            cell.dataset.objX = coordX - 1;
            cell.dataset.objY = coordY - 1;
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
            gridCells.appendChild(cell);
        }
    }

    // Área de drop que cubre todo el grid con margen
    const gridDropArea = document.createElement('div');
    gridDropArea.className = 'grid-drop-area';
    gridDropArea.style.cssText = `
        position: absolute;
        left: 0;
        top: 0;
        width: ${GRID_TOTAL_SIZE}px;
        height: ${GRID_TOTAL_SIZE}px;
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
    if (!poolContainer) return;
    poolContainer.innerHTML = '';
    
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
        
        poolContainer.appendChild(pointWrapper);
    });
}

// Mostrar coordenadas objetivo
function displayCoordinates() {
    const coordsList = document.getElementById('coordinates-list');
    coordsList.innerHTML = '';
    
    const pointsById = new Map(PUZZLE_POINTS.map((point) => [point.colorId, point]));
    const configuredOrder = CURRENT_PUZZLE?.coordinateOrder;
    const order = configuredOrder && configuredOrder.length
        ? configuredOrder
        : PUZZLE_POINTS.map((point) => point.colorId);
    const rendered = new Set();

    order.forEach((colorId) => {
        const coord = pointsById.get(colorId);
        if (!coord) return;
        const card = createSingleCard(coord);
        if (card) {
            coordsList.appendChild(card);
            rendered.add(colorId);
        }
    });

    PUZZLE_POINTS.forEach((coord) => {
        if (rendered.has(coord.colorId)) return;
        const card = createSingleCard(coord);
        if (card) {
            coordsList.appendChild(card);
            rendered.add(coord.colorId);
        }
    });
}

function createInstructionEntry(coord) {
    const pointColor = COLOR_MAP.get(coord.colorId);
    if (!pointColor) return null;

    const isSolved = isCoordinatePlaced(coord.x, coord.y, coord.colorId);

    const entry = document.createElement('div');
    entry.className = 'coord-entry';

        const colorPoint = document.createElement('div');
        colorPoint.className = 'color-point';
    colorPoint.style.background = pointColor.color;
    colorPoint.style.boxShadow = `0 0 8px ${pointColor.color}, 0 0 16px ${pointColor.color}`;

        const coordText = document.createElement('div');
    coordText.className = 'coord-text';
    coordText.textContent = coord.reference === null
        ? `(x:${coord.x}, y:${coord.y})`
        : coord.hint;

    entry.appendChild(colorPoint);
    entry.appendChild(coordText);

    return { entry, isSolved };
}

function createSingleCard(coord) {
    const result = createInstructionEntry(coord);
    if (!result) return null;

    const { entry, isSolved } = result;
    const card = document.createElement('div');
    card.className = 'coord-card coord-card-single';
    if (isSolved) {
        card.classList.add('completed');
    }

    card.appendChild(entry);
    return card;
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

    console.debug('[Nivel 3] placed:', placedCount, 'correct:', correctCount, 'allCorrect:', allCorrect);
    
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
    updateConnectionLines();
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
    svg.setAttribute('width', GRID_TOTAL_SIZE);
    svg.setAttribute('height', GRID_TOTAL_SIZE);
    svg.style.position = 'absolute';
    svg.style.left = '0';
    svg.style.top = '0';
    svg.style.pointerEvents = 'none';
    svg.style.zIndex = '4';

    gridWrapper.appendChild(svg);
    connectionLayer = svg;
    return connectionLayer;
}

function updateConnectionLines() {
    const layer = ensureConnectionLayer();
    if (!layer) return;

    const gridWrapper = document.querySelector('.grid-wrapper');

    layer.innerHTML = '';

    const orderedPoints = CONNECTION_PATH.map((colorId) =>
        PUZZLE_POINTS.find((point) => point.colorId === colorId)
    );

    if (orderedPoints.some((point) => !point)) {
        if (gridWrapper) gridWrapper.classList.remove('solved');
        console.debug('[Nivel 3] líneas no dibujadas: puntos faltantes en ruta');
        return;
    }

    let drawnSegments = 0;

    for (let i = 0; i < orderedPoints.length - 1; i++) {
        const start = orderedPoints[i];
        const end = orderedPoints[i + 1];

        if (!isCoordinatePlaced(start.x, start.y, start.colorId) ||
            !isCoordinatePlaced(end.x, end.y, end.colorId)) {
            continue;
        }

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', coordToPixelX(start.x));
        line.setAttribute('y1', coordToPixelY(start.y));
        line.setAttribute('x2', coordToPixelX(end.x));
        line.setAttribute('y2', coordToPixelY(end.y));
        line.setAttribute('stroke', '#00ff80');
        line.setAttribute('stroke-width', '3.5');
        line.setAttribute('stroke-linecap', 'round');
        line.style.filter = 'drop-shadow(0 0 14px rgba(0, 255, 128, 0.75))';

        layer.appendChild(line);
        drawnSegments++;
    }

    if (gridWrapper) {
        if (drawnSegments > 0) {
            gridWrapper.classList.add('solved');
        } else {
            gridWrapper.classList.remove('solved');
        }
    }
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
        showMessage('Código correcto. Nivel 5 en construcción, ¡pronto disponible!', 'success');
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
    draggedPoint = e.target.closest('.point-item, .grid-placed-point');
    if (!draggedPoint) return;

    if (draggedPoint.classList.contains('grid-placed-point')) {
        draggedColorId = parseInt(draggedPoint.dataset.colorId, 10);
            draggedPoint.dataset.isMoving = 'true';
            draggedPoint.style.opacity = '0.5';
    } else {
        draggedColorId = parseInt(draggedPoint.dataset.colorId || draggedPoint.dataset.colorId, 10);
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
    
    const objX = pixelToCoordX(mouseX);
    const objY = pixelToCoordY(mouseY);
    
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
    const pointX = coordToPixelX(objX);
    const pointY = coordToPixelY(objY);
    
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
    
    const pointX = coordToPixelX(x);
    const pointY = coordToPixelY(y);
    
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
    const pointX = coordToPixelX(objX);
    const pointY = coordToPixelY(objY);
    
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

// Manejar soltar punto en el pool para devolverlo
function handlePoolDrop(e) {
    if (!draggedColorId || !poolContainer) return;
    e.preventDefault();
    e.stopPropagation();

    const movingPoint = document.querySelector('.grid-placed-point[data-is-moving="true"]');
    if (!movingPoint) {
        // Solo puntos ya colocados pueden regresarse
        return;
    }
    
    const oldX = parseInt(movingPoint.dataset.cellX, 10);
    const oldY = parseInt(movingPoint.dataset.cellY, 10);
    const oldKey = `${oldX}-${oldY}`;

    // Si ya existe el punto en el pool, solo eliminamos el del grid
    const existingWrapper = poolContainer.querySelector(`.point-item[data-color-id="${draggedColorId}"]`);
    if (existingWrapper) {
        movingPoint.dataset.isMoving = 'false';
        movingPoint.remove();
        if (placedPoints[oldKey]) {
            delete placedPoints[oldKey];
        }
        updateCounts();
        displayCoordinates();
        return;
    }

    const colorInfo = COLOR_MAP.get(draggedColorId);

    // Crear un nuevo wrapper como en loadPoints
    const pointWrapper = document.createElement('div');
    pointWrapper.className = 'point-item';
    pointWrapper.draggable = true;
    pointWrapper.dataset.colorId = draggedColorId;

    const colorPoint = document.createElement('div');
    colorPoint.className = 'color-point';
    const baseSize = POINT_SIZE * 2;
    colorPoint.style.cssText = `
        width: ${baseSize}px;
        height: ${baseSize}px;
        background: ${colorInfo?.color || '#ffffff'};
        border-radius: 50%;
        border: 2px solid rgba(255, 255, 255, 0.3);
        box-shadow: 0 0 10px ${colorInfo?.color || '#ffffff'}, 0 0 20px ${colorInfo?.color || '#ffffff'};
        cursor: grab;
        transition: transform 0.2s ease;
    `;

    pointWrapper.appendChild(colorPoint);

    pointWrapper.addEventListener('dragstart', handleDragStart);
    pointWrapper.addEventListener('dragend', handleDragEnd);
    pointWrapper.addEventListener('mouseenter', () => {
        colorPoint.style.transform = 'scale(1.2)';
    });
    pointWrapper.addEventListener('mouseleave', () => {
        colorPoint.style.transform = 'scale(1)';
    });

    poolContainer.appendChild(pointWrapper);

    // Remover el punto antiguo del grid
    movingPoint.dataset.isMoving = 'false';
    movingPoint.remove();

    if (placedPoints[oldKey]) {
        delete placedPoints[oldKey];
    }

    updateCounts();
    displayCoordinates();
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

