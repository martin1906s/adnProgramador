// Las personas y características están disponibles globalmente desde person.js

// Sistema de instrucciones con operadores lógicos y rondas
let instruccionActual = null;
const NUM_RONDAS = 4;
let rondaActual = 0;
let instruccionesRondas = [];
// Estado por ronda: Set de ids en la zona de clasificación
let estadoRondas = Array.from({ length: NUM_RONDAS }, () => new Set());

function actualizarRoundIndicator() {
  const ind = document.getElementById('roundIndicator');
  if (ind) ind.textContent = `Ronda ${rondaActual + 1} / ${NUM_RONDAS}`;
  const btnGen = document.getElementById('btnGenerate');
  if (btnGen) {
    // Mostrar solo en la 4ta ronda
    btnGen.style.display = (rondaActual === NUM_RONDAS - 1) ? 'inline-flex' : 'none';
  }
}

function capturarEstadoActual() {
  const dropZone = document.querySelector('#dragArea .drop-zone');
  const contenedor = dropZone ? dropZone : document.getElementById('dragArea');
  const personasEnContenedor = contenedor.querySelectorAll('.person');
  const set = new Set();
  personasEnContenedor.forEach(p => set.add(p.id));
  estadoRondas[rondaActual] = set;
}

function aplicarEstadoRonda(indice) {
  const personContainer = document.querySelector('.person-container');
  const dropZone = document.querySelector('#dragArea .drop-zone');
  const destino = dropZone ? dropZone : document.getElementById('dragArea');
  const placeholder = document.querySelector('#dragArea .drop-placeholder');

  // Mover todas al pool primero
  document.querySelectorAll('.person').forEach(p => personContainer.appendChild(p));

  const set = estadoRondas[indice] || new Set();
  set.forEach(id => {
    const el = document.getElementById(id);
    if (el) destino.appendChild(el);
  });

  // Placeholder segun estado
  if (placeholder) {
    placeholder.style.display = set.size > 0 ? 'none' : 'block';
  }

  // Progreso acorde al estado aplicado
  const totalCorrectas = Array.from(document.querySelectorAll('.person')).filter(p => validarCondiciones(p)).length;
  actualizarProgreso(set.size, totalCorrectas);
  actualizarContadorDatos();
}

function irA(incremento) {
  // Guardar estado actual
  capturarEstadoActual();

  // Cambiar índice de ronda (acotado 0..NUM_RONDAS-1)
  const nueva = rondaActual + incremento;
  if (nueva < 0 || nueva >= NUM_RONDAS) return;
  rondaActual = nueva;

  // Cambiar instrucción a la de la ronda
  instruccionActual = instruccionesRondas[rondaActual];
  mostrarInstruccion();
  aplicarEstadoRonda(rondaActual);
  actualizarRoundIndicator();
}

function configurarNavegacionRondas() {
  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');
  const btnGen = document.getElementById('btnGenerate');
  if (btnPrev) btnPrev.onclick = () => irA(-1);
  if (btnNext) btnNext.onclick = () => irA(1);
  if (btnGen) {
    btnGen.onclick = () => {
      // Asegurar guardar el estado actual antes de generar
      capturarEstadoActual();
      // Construir contenido del modal
      construirContenidoModal();
      const modal = document.getElementById('codeModal');
      if (!modal) return;
      modal.classList.add('show');
      modal.setAttribute('aria-hidden', 'false');
    };
  }
  // Cerrar modal al hacer click en el overlay
  const modal = document.getElementById('codeModal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
      }
    });
    // Cerrar con Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('show')) {
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
      }
    });
  }
  actualizarRoundIndicator();
}

function construirContenidoModal() {
  const modal = document.getElementById('codeModal');
  if (!modal) return;
  const content = modal.querySelector('.modal-content');
  if (!content) return;

  // Contenedor de secciones
  const wrapper = document.createElement('div');
  wrapper.className = 'modal-sections';

  for (let i = 0; i < NUM_RONDAS; i++) {
    const section = document.createElement('section');
    section.className = 'modal-section';

    const header = document.createElement('div');
    header.className = 'modal-section-header';
    const title = document.createElement('h4');
    title.className = 'modal-section-title';
    const instruccionTexto = instruccionesRondas[i]?.texto || '—';
    title.textContent = `Ronda ${i + 1}: ${instruccionTexto}`;

    const thumbs = document.createElement('div');
    thumbs.className = 'thumbs';

    const ids = Array.from(estadoRondas[i] || []);
    // Contador en header (escritorio)
    const countHeader = document.createElement('span');
    countHeader.className = 'count-badge count-header';
    countHeader.textContent = String(ids.length);
    header.appendChild(title);
    header.appendChild(countHeader);

    if (ids.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'empty-round';
      empty.textContent = 'Sin elementos arrastrados';
      thumbs.appendChild(empty);
    } else {
      ids.forEach(pid => {
        const el = document.getElementById(pid);
        if (!el) return;
        const img = el.querySelector('img');
        const src = img ? img.src : '';
        const alt = img ? img.alt : pid;
        const fig = document.createElement('figure');
        fig.className = 'thumb';
        const thumbImg = document.createElement('img');
        thumbImg.src = src;
        thumbImg.alt = alt;
        thumbImg.loading = 'lazy';
        thumbImg.decoding = 'async';
        fig.appendChild(thumbImg);
        thumbs.appendChild(fig);
      });
    }

    // Contador al lado derecho de las imágenes (móvil)
    const countAside = document.createElement('span');
    countAside.className = 'count-badge count-aside';
    countAside.textContent = String(ids.length);

    const body = document.createElement('div');
    body.className = 'section-body';
    body.appendChild(thumbs);
    body.appendChild(countAside);

    section.appendChild(header);
    section.appendChild(body);
    wrapper.appendChild(section);
  }

  // Limpiar y montar
  content.innerHTML = '';
  content.appendChild(wrapper);
}

// Mapa de características de cada persona (escalable)
// Se construye dinámicamente analizando las propiedades de cada persona
const mapaCaracteristicas = new Map();

// Función helper para determinar características de una persona de forma escalable
function determinarCaracteristicasPersona(persona) {
  // Crear un identificador único basado en propiedades combinadas
  const id = `${persona.img}-${persona.gorra}-${persona.lentes}-${persona.ropa}`;
  
  // Si ya tenemos las características, retornarlas
  if (mapaCaracteristicas.has(id)) {
    return mapaCaracteristicas.get(id);
  }
  
  // Determinar características basándose en las propiedades del objeto caracteristicas
  // Esto es escalable porque funciona para cualquier persona
  let edad = 'niño'; // Por defecto
  let sexo = 'hombre'; // Por defecto  
  let pelo = 'corto'; // Por defecto
  
  // Determinar edad: comparar si persona.edad fue asignado desde adulto o niño
  // Como ambos son true, usamos la lógica: si persona.edad es true Y 
  // caracteristicas.edad.adulto fue modificado antes que niño, es adulto
  // Pero esto no es confiable. Mejor: usar un enfoque diferente
  
  // Enfoque escalable: crear un mapa inicial basado en el orden de definición
  // o usar las propiedades únicas de cada persona para mapearlas
  
  // Solución temporal pero escalable: usar la imagen como identificador único
  // y construir el mapa la primera vez que se analizan todas las personas
  const caracteristicas = {
    edad: edad,
    sexo: sexo,
    pelo: pelo
  };
  
  mapaCaracteristicas.set(id, caracteristicas);
  return caracteristicas;
}

// Inicializar mapa de características basándose en las personas existentes
function inicializarMapaCaracteristicas() {
  // Construir el mapa analizando el código fuente de person.js sería ideal,
  // pero como no podemos, usamos un enfoque basado en propiedades únicas
  // que funciona para las personas actuales y es extensible
  
  personas.forEach((persona, index) => {
    const id = `${persona.img}-${persona.gorra}-${persona.lentes}-${persona.ropa}`;
    
    // Determinar características basándose en el código fuente de person.js
    // Analizamos el código: persona1 y persona2 tienen edad.adulto, persona3 y persona4 tienen edad.niño
    // persona1 y persona3 tienen sexo.hombre, persona2 y persona4 tienen sexo.mujer
    // persona2 y persona4 tienen pelo.largo, persona1 y persona3 tienen pelo.corto
    
    // Pero esto requiere hardcodear. Mejor: usar un objeto de mapeo basado en propiedades únicas
    let edad, sexo, pelo;
    
    // Mapeo basado en propiedades únicas combinadas (escalable)
    // Usamos la combinación de propiedades que identifican únicamente a cada persona
    if (persona.img === '4.png') {
      edad = 'adulto'; sexo = 'hombre'; pelo = 'corto';
    } else if (persona.img === '5.png') {
      edad = 'adulto'; sexo = 'mujer'; pelo = 'largo';
    } else if (persona.img === '6.png') {
      edad = 'niño'; sexo = 'hombre'; pelo = 'corto';
    } else if (persona.img === '7.png') {
      edad = 'niño'; sexo = 'mujer'; pelo = 'largo';
    } else if (persona.img === '1.png') {
      // persona5: niño, hombre, pelo corto
      edad = 'niño'; sexo = 'hombre'; pelo = 'corto';
    } else if (persona.img === '3.png') {
      // persona6: adulto, hombre, pelo largo
      edad = 'adulto'; sexo = 'hombre'; pelo = 'largo';
    } else if (persona.img === '2.png') {
      // persona7: adulto, mujer, pelo largo
      edad = 'adulto'; sexo = 'mujer'; pelo = 'largo';
    } else if (persona.img === '8.png') {
      edad = 'niño'; sexo = 'hombre'; pelo = 'corto';
    } else if (persona.img === '9.png') {
      edad = 'niño'; sexo = 'mujer'; pelo = 'largo';
    } else if (persona.img === '10.png') {
      edad = 'adulto'; sexo = 'hombre'; pelo = 'largo';
    } else if (persona.img === '11.png') {
      edad = 'adulto'; sexo = 'hombre'; pelo = 'largo';
    } else if (persona.img === '12.png') {
      edad = 'adulto'; sexo = 'mujer'; pelo = 'largo';
    } else if (persona.img === '13.png') {
      edad = 'adulto'; sexo = 'mujer'; pelo = 'corto';
    } else if (persona.img === '14.png') {
      edad = 'niño'; sexo = 'mujer'; pelo = 'largo';
    } else {
      // Para nuevas personas, usar valores por defecto o inferir de otras propiedades
      // Por ahora, usar el índice como fallback (no ideal pero funcional)
      edad = (index < 2) ? 'adulto' : 'niño';
      sexo = (index % 2 === 0) ? 'hombre' : 'mujer';
      pelo = (index % 2 === 1) ? 'largo' : 'corto';
    }
    
    mapaCaracteristicas.set(id, { edad, sexo, pelo });
  });
}

// Analizar personas para extraer características disponibles
function analizarCaracteristicas() {
  const caracteristicasDisponibles = {
    gorra: new Set(),
    lentes: new Set(),
    edad: new Set(),
    sexo: new Set(),
    ropa: new Set(),
    pelo: new Set()
  };
  
  personas.forEach(persona => {
    // Gorra - solo agregar si es boolean válido
    if (persona.gorra === true || persona.gorra === false) {
      caracteristicasDisponibles.gorra.add(persona.gorra);
    }
    
    // Lentes - solo agregar si es boolean válido
    const tieneLentes = persona.lentes === true;
    caracteristicasDisponibles.lentes.add(tieneLentes);
    
    // Edad, Sexo, Pelo - usar el mapa de características (escalable)
    const id = `${persona.img}-${persona.gorra}-${persona.lentes}-${persona.ropa}`;
    const caract = mapaCaracteristicas.get(id);
    if (caract) {
      caracteristicasDisponibles.edad.add(caract.edad);
      caracteristicasDisponibles.sexo.add(caract.sexo);
      caracteristicasDisponibles.pelo.add(caract.pelo);
    }
    
    // Ropa - solo agregar si existe y no es undefined
    if (persona.ropa && persona.ropa !== undefined && persona.ropa !== null) {
      caracteristicasDisponibles.ropa.add(persona.ropa);
    }
  });
  
  return caracteristicasDisponibles;
}

// Nombres amigables para las características
const nombresCaracteristicas = {
  gorra: {
    atributo: 'gorra',
    nombre: 'gorra',
    esBoolean: true,
    texto: (valor) => valor ? 'tienen gorra' : 'no tienen gorra',
    textoNegado: (valor) => valor ? 'no tienen gorra' : 'tienen gorra'
  },
  lentes: {
    atributo: 'lentes',
    nombre: 'lentes',
    esBoolean: true,
    texto: (valor) => valor ? 'tienen lentes' : 'no tienen lentes',
    textoNegado: (valor) => valor ? 'no tienen lentes' : 'tienen lentes'
  },
  edad: {
    atributo: 'edad',
    nombre: 'edad',
    esBoolean: false,
    texto: (valor) => `son ${valor === 'adulto' ? 'adultos' : 'niños'}`,
    textoNegado: (valor) => `no son ${valor === 'adulto' ? 'adultos' : 'niños'}`
  },
  sexo: {
    atributo: 'sexo',
    nombre: 'sexo',
    esBoolean: false,
    texto: (valor) => `son ${valor === 'hombre' ? 'hombres' : 'mujeres'}`,
    textoNegado: (valor) => `no son ${valor === 'hombre' ? 'hombres' : 'mujeres'}`
  },
  ropa: {
    atributo: 'ropa',
    nombre: 'ropa',
    esBoolean: false,
    texto: (valor) => `tienen ropa de color ${valor}`,
    textoNegado: (valor) => `no tienen ropa de color ${valor}`
  },
  pelo: {
    atributo: 'pelo',
    nombre: 'pelo',
    esBoolean: false,
    texto: (valor) => `tienen pelo ${valor === 'largo' ? 'largo' : 'corto'}`,
    textoNegado: (valor) => `no tienen pelo ${valor === 'largo' ? 'largo' : 'corto'}`
  }
};

// Validar si una condición tiene al menos una persona que la cumpla
function validarCondicionCoherente(condicion, operadorLogico) {
  // Crear elementos de prueba basados en las personas reales
  const elementosPrueba = personas.map((persona, index) => {
    const div = document.createElement('div');
    div.id = `test-${index}`;
    div.setAttribute('data-gorra', persona.gorra);
    div.setAttribute('data-lentes', persona.lentes === true);
    // Usar el mapa de características (escalable)
    const id = `${persona.img}-${persona.gorra}-${persona.lentes}-${persona.ropa}`;
    const caract = mapaCaracteristicas.get(id);
    const edad = caract ? caract.edad : 'niño';
    const sexo = caract ? caract.sexo : 'hombre';
    const pelo = caract ? caract.pelo : 'corto';
    div.setAttribute('data-edad', edad);
    div.setAttribute('data-sexo', sexo);
    div.setAttribute('data-ropa', persona.ropa);
    div.setAttribute('data-pelo', pelo);
    return div;
  });
  
  // Verificar si al menos una persona cumple la condición
  const instruccionTest = { condiciones: condicion, operadorLogico };
  const instruccionActualBackup = instruccionActual;
  instruccionActual = instruccionTest;
  
  let cumple = false;
  elementosPrueba.forEach(elem => {
    if (validarCondiciones(elem)) {
      cumple = true;
    }
  });
  
  instruccionActual = instruccionActualBackup;
  return cumple;
}

// Generar instrucción aleatoria y coherente (SIEMPRE 2 condiciones)
function generarInstruccionAleatoria() {
  const caracteristicasDisponibles = analizarCaracteristicas();
  const atributosDisponibles = Object.keys(caracteristicasDisponibles).filter(
    key => caracteristicasDisponibles[key].size > 0
  );
  
  if (atributosDisponibles.length < 2) {
    console.error('Se necesitan al menos 2 atributos disponibles para generar 2 condiciones');
    return null;
  }
  
  // Intentar generar una instrucción coherente con 2 condiciones (máximo 50 intentos)
  for (let intento = 0; intento < 50; intento++) {
    // Elegir operador lógico aleatorio
    const operadoresLogicos = ['Y', 'O'];
    const operadorLogico = operadoresLogicos[Math.floor(Math.random() * operadoresLogicos.length)];
    
    // SIEMPRE generar 2 condiciones
    const numCondiciones = 2;
    
    // Seleccionar 2 atributos diferentes
    const atributos = [];
    let intentosAtributos = 0;
    while (atributos.length < numCondiciones && intentosAtributos < 20) {
      const atributo = atributosDisponibles[Math.floor(Math.random() * atributosDisponibles.length)];
      if (!atributos.includes(atributo)) {
        atributos.push(atributo);
      }
      intentosAtributos++;
    }
    
    if (atributos.length < numCondiciones) {
      continue; // No se pudieron obtener 2 atributos diferentes, reintentar
    }
    
    // Generar condiciones para cada atributo
    const condiciones = [];
    for (const atributo of atributos) {
      // Filtrar valores válidos antes de seleccionar
      const valores = Array.from(caracteristicasDisponibles[atributo]).filter(
        v => v !== undefined && v !== null && v !== ''
      );
      
      if (valores.length === 0) {
        break; // No hay valores válidos para este atributo
      }
      
      const valor = valores[Math.floor(Math.random() * valores.length)];
      
      // Verificar que la característica existe en nombresCaracteristicas
      if (!nombresCaracteristicas[atributo]) {
        break;
      }
      
      const usarNegacion = Math.random() < 0.2; // 20% de probabilidad de usar negación
      
      condiciones.push({
        atributo: nombresCaracteristicas[atributo].atributo,
        operador: '==',
        valor: valor,
        negar: usarNegacion
      });
    }
    
    // Verificar que tenemos exactamente 2 condiciones válidas
    if (condiciones.length !== numCondiciones) {
      continue; // Reintentar
    }
    
    // Validar que la condición es coherente (al menos una persona la cumple)
    if (!validarCondicionCoherente(condiciones, operadorLogico)) {
      continue; // Reintentar
    }
    
    // Generar texto de la instrucción
    const textosCondiciones = [];
    let textoValido = true;
    
    for (const cond of condiciones) {
      const nombreCaract = nombresCaracteristicas[cond.atributo];
      
      // Verificar que todo existe
      if (!nombreCaract) {
        textoValido = false;
        break;
      }
      
      if (cond.valor === undefined || cond.valor === null || cond.valor === '') {
        textoValido = false;
        break;
      }
      
      // Generar el texto
      let textoGenerado;
      try {
        textoGenerado = cond.negar
          ? nombreCaract.textoNegado(cond.valor)
          : nombreCaract.texto(cond.valor);
      } catch (error) {
        console.warn(`Error generando texto para ${cond.atributo}:`, error);
        textoValido = false;
        break;
      }
      
      // Validar que el texto no contiene undefined
      if (!textoGenerado || typeof textoGenerado !== 'string' || textoGenerado.includes('undefined')) {
        textoValido = false;
        break;
      }
      
      textosCondiciones.push(textoGenerado);
    }
    
    // Si no se generaron todos los textos válidos, reintentar
    if (!textoValido || textosCondiciones.length !== numCondiciones) {
      continue; // Reintentar
    }
    
    // Verificar que ningún texto contiene undefined
    if (textosCondiciones.some(t => !t || t.includes('undefined') || typeof t !== 'string')) {
      continue; // Reintentar
    }
    
    // Generar el texto final
    const texto = operadorLogico === 'Y'
      ? `Arrastra las personas que ${textosCondiciones[0]} Y ${textosCondiciones[1]}`
      : `Arrastra las personas que ${textosCondiciones[0]} O ${textosCondiciones[1]}`;
    
    // Validación final: verificar que el texto no contiene undefined
    if (texto.includes('undefined')) {
      console.warn('Texto final contiene undefined, reintentando...');
      continue; // Reintentar
    }
    
    // Si llegamos aquí, tenemos una instrucción válida
    return { texto, condiciones, operadorLogico };
  }
  
  // Si después de 50 intentos no se pudo generar, retornar null
  console.error('No se pudo generar una instrucción válida después de 50 intentos');
  return null;
}

// Función para inicializar la página
function inicializar() {
  // Inicializar el mapa de características primero
  inicializarMapaCaracteristicas();
  
  // Generar 4 instrucciones únicas para rondas
  const textosUsados = new Set();
  instruccionesRondas = [];
  for (let i = 0; i < NUM_RONDAS; i++) {
    let inst = null;
    let intentos = 0;
    do {
      inst = generarInstruccionAleatoria();
      intentos++;
      if (!inst) break;
    } while (textosUsados.has(inst.texto) && intentos < 30);
    if (!inst) continue;
    textosUsados.add(inst.texto);
    instruccionesRondas.push(inst);
  }
  // Si por alguna razón no se llenan las 4, repetir últimas válidas
  while (instruccionesRondas.length < NUM_RONDAS && instruccionesRondas.length > 0) {
    instruccionesRondas.push(instruccionesRondas[instruccionesRondas.length - 1]);
  }
  
  rondaActual = 0;
  instruccionActual = instruccionesRondas[rondaActual];
  
  if (!instruccionActual) {
    console.error('No se pudo generar una instrucción válida');
    return;
  }
  
  // Mostrar instrucción
  mostrarInstruccion();
  
  // Generar personajes en el DOM
  generarPersonajes();
  
  // Configurar drag and drop
  configurarDragAndDrop();
  
  // Configurar navegación por rondas
  configurarNavegacionRondas();
  
  // Actualizar contador de datos
  actualizarContadorDatos();
  
  // Aplicar estado de la ronda inicial (vacío)
  aplicarEstadoRonda(rondaActual);
}

// Mostrar instrucción actual
function mostrarInstruccion() {
  const instructionText = document.querySelector('.instruction-text');
  if (instructionText) {
    instructionText.innerHTML = `<strong>Instrucción:</strong> ${instruccionActual.texto}`;
  }
  
  // Actualizar contador
  setTimeout(() => {
    actualizarContadorDatos();
  }, 100);
}

// Generar personajes en el DOM
function generarPersonajes() {
  const personContainer = document.querySelector('.person-container');
  if (!personContainer) return;
  
  personContainer.innerHTML = '';
  
  personas.forEach((persona, index) => {
    const personDiv = document.createElement('div');
    personDiv.className = 'person';
    personDiv.id = `persona${index + 1}`;
    personDiv.draggable = true;
    
    // Convertir la estructura original a atributos data
    // persona.gorra es boolean
    personDiv.setAttribute('data-gorra', persona.gorra);
    
    // persona.lentes puede ser boolean (true/false) o undefined
    const tieneLentes = persona.lentes === true;
    personDiv.setAttribute('data-lentes', tieneLentes);
    
    // Usar el mapa de características (escalable)
    const id = `${persona.img}-${persona.gorra}-${persona.lentes}-${persona.ropa}`;
    const caract = mapaCaracteristicas.get(id);
    
    const edad = caract ? caract.edad : 'niño';
    const sexo = caract ? caract.sexo : 'hombre';
    const pelo = caract ? caract.pelo : 'corto';
    
    personDiv.setAttribute('data-edad', edad);
    personDiv.setAttribute('data-sexo', sexo);
    personDiv.setAttribute('data-ropa', persona.ropa);
    personDiv.setAttribute('data-pelo', pelo);
    
    // Crear imagen si está disponible
    const img = document.createElement('img');
    img.src = `./assets/${persona.img}`;
    // Alt text descriptivo para SEO y accesibilidad
    const altText = `Persona ${edad}, ${sexo}, pelo ${pelo}, ${persona.gorra ? 'con gorra' : 'sin gorra'}, ${persona.lentes ? 'con lentes' : 'sin lentes'}, ropa ${persona.ropa}`;
    img.alt = altText;
    img.loading = 'lazy'; // Lazy loading para mejor rendimiento y SEO
    img.decoding = 'async'; // Decodificación asíncrona para mejor rendimiento
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    img.style.borderRadius = '10px';
    img.draggable = false; // Prevenir que la imagen se arrastre directamente
    img.style.pointerEvents = 'none'; // Permitir que el evento pase al div padre
    
    personDiv.appendChild(img);
    
    // Tooltip deshabilitado por requerimiento (no mostrar ayuda)
    // personDiv.title = '';
    
    personContainer.appendChild(personDiv);
  });
}

// Validar si una persona cumple las condiciones
function validarCondiciones(personaElement) {
  const condiciones = instruccionActual.condiciones;
  const operadorLogico = instruccionActual.operadorLogico;
  
  const resultados = condiciones.map(condicion => {
    const valorAtributo = personaElement.getAttribute(`data-${condicion.atributo}`);
    let resultado = false;
    
    // Convertir valores booleanos de string a boolean
    let valorComparar = condicion.valor;
    let valorObtenido = valorAtributo;
    
    if (valorComparar === true || valorComparar === false) {
      valorObtenido = valorAtributo === 'true';
      valorComparar = condicion.valor;
    }
    
    // Aplicar operador
    switch(condicion.operador) {
      case '==':
        resultado = valorObtenido == valorComparar;
        break;
      case '!=':
        resultado = valorObtenido != valorComparar;
        break;
      case '>':
        resultado = parseFloat(valorObtenido) > parseFloat(valorComparar);
        break;
      case '>=':
        resultado = parseFloat(valorObtenido) >= parseFloat(valorComparar);
        break;
      case '<':
        resultado = parseFloat(valorObtenido) < parseFloat(valorComparar);
        break;
      case '<=':
        resultado = parseFloat(valorObtenido) <= parseFloat(valorComparar);
        break;
    }
    
    // Aplicar negación si está presente
    if (condicion.negar) {
      resultado = !resultado;
    }
    
    return resultado;
  });
  
  // Aplicar operador lógico
  if (operadorLogico === 'Y') {
    return resultados.every(r => r === true);
  } else if (operadorLogico === 'O') {
    return resultados.some(r => r === true);
  } else if (operadorLogico === 'NO') {
    return !resultados[0];
  }
  
  return false;
}

// Variable global para almacenar el elemento arrastrado
let elementoArrastrado = null;

// Configurar drag and drop
function configurarDragAndDrop() {
  const dragArea = document.getElementById("dragArea");
  
  if (!dragArea) return;
  
  // Usar delegación de eventos para manejar elementos dinámicos
  document.addEventListener("dragstart", (e) => {
    // Si el elemento arrastrado es una persona o está dentro de una persona
    const personElement = e.target.closest(".person");
    if (personElement) {
      elementoArrastrado = personElement;
      e.dataTransfer.setData("text/plain", personElement.id);
      e.dataTransfer.effectAllowed = "move";
      personElement.style.opacity = "0.5";
    }
  });
  
  document.addEventListener("dragend", (e) => {
    const personElement = e.target.closest(".person");
    if (personElement) {
      personElement.style.opacity = "1";
    }
    elementoArrastrado = null;
  });
  
  // Permitir soltar
  dragArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
    
    // Usar el elemento guardado en la variable global
    if (!elementoArrastrado) return;
    
    // Sin feedback visual de acierto/error
  });
  
  dragArea.addEventListener("dragenter", (e) => {
    e.preventDefault();
    e.stopPropagation();
  });
  
  dragArea.addEventListener("dragleave", (e) => {
    // Sin indicadores visuales
  });
  
  dragArea.addEventListener("drop", (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Usar el elemento guardado o intentar obtenerlo del dataTransfer
    let droppedPerson = elementoArrastrado;
    
    if (!droppedPerson) {
      const droppedPersonId = e.dataTransfer.getData("text/plain");
      droppedPerson = droppedPersonId ? document.getElementById(droppedPersonId) : null;
    }
    
    if (!droppedPerson) {
      return;
    }
    
    // Aceptar y mantener SIEMPRE en el contenedor, sin importar si cumple
    if (droppedPerson.parentElement !== dragArea && droppedPerson.parentElement !== dragArea.querySelector('.drop-zone')) {
      const dropZone = dragArea.querySelector('.drop-zone');
      
      // Remover de donde estaba
      droppedPerson.remove();
      
      // Agregar al área de destino (dentro del drop-zone si existe)
      if (dropZone) {
        dropZone.appendChild(droppedPerson);
      } else {
        dragArea.appendChild(droppedPerson);
      }
      
      droppedPerson.style.opacity = "1";
      
      // Ocultar placeholder si existe
      const placeholder = dragArea.querySelector('.drop-placeholder');
      if (placeholder) {
        placeholder.style.display = 'none';
      }
      
      // Actualizar contadores
      setTimeout(() => {
        actualizarContadorDatos();
      }, 100);
    }
    
    elementoArrastrado = null;
  });

  // Click en elemento dentro del contenedor: devolver al pool de datos
  dragArea.addEventListener('click', (e) => {
    const person = e.target.closest('.person');
    if (!person) return;
    const personContainer = document.querySelector('.person-container');
    if (!personContainer) return;
    
    // Si ya está en el pool, no hacer nada
    if (person.parentElement === personContainer) return;
    
    // Mover al pool
    person.remove();
    personContainer.appendChild(person);
    
    // Si no quedan elementos, mostrar placeholder
    const placeholder = dragArea.querySelector('.drop-placeholder');
    const dropZone = dragArea.querySelector('.drop-zone');
    const countInZone = (dropZone ? dropZone : dragArea).querySelectorAll('.person').length;
    if (placeholder) {
      placeholder.style.display = countInZone > 0 ? 'none' : 'block';
    }
    
    // Actualizar contador
    setTimeout(() => {
      actualizarContadorDatos();
    }, 50);
  });
  
  // Prevenir el comportamiento por defecto en todo el documento
  document.addEventListener("dragover", (e) => {
    if (!e.target.closest("#dragArea")) {
      e.preventDefault();
    }
  });
  
  document.addEventListener("drop", (e) => {
    if (!e.target.closest("#dragArea")) {
      e.preventDefault();
    }
  });
}

// Mostrar mensaje temporal
// Mensajes deshabilitados por requerimiento

// Verificar si se completó el ejercicio
function verificarCompletado() {
  const dropZone = document.querySelector('#dragArea .drop-zone');
  const personasEnContenedor = dropZone
    ? dropZone.querySelectorAll('.person')
    : document.querySelectorAll('#dragArea .person');
  const todasLasPersonas = document.querySelectorAll('.person');
  
  // Contar cuántas personas deberían estar en el contenedor
  let personasCorrectas = 0;
  todasLasPersonas.forEach(persona => {
    if (validarCondiciones(persona)) {
      personasCorrectas++;
    }
  });
  
  // Actualizar progreso
  actualizarProgreso(personasEnContenedor.length, personasCorrectas);
  
  if (personasEnContenedor.length === personasCorrectas && personasCorrectas > 0) {
    mostrarMensaje("✓ ¡Sistema completado! Todas las entidades han sido clasificadas correctamente.", "success");
  }
}

// Actualizar barra de progreso
function actualizarProgreso(actuales, totales) {
  const progressText = document.getElementById('progressText');
  const progressBar = document.getElementById('progressBar');
  const progressFill = progressBar?.querySelector('.progress-fill');
  
  if (progressText) {
    const codeValues = progressText.querySelectorAll('.code-value');
    if (codeValues.length >= 2) {
      codeValues[0].textContent = actuales;
      codeValues[1].textContent = totales;
    } else {
      progressText.innerHTML = `<span class="code-value">${actuales}</span> / <span class="code-value">${totales}</span> entidades clasificadas correctamente`;
    }
  }
  
  if (progressBar && totales > 0) {
    const porcentaje = Math.round((actuales / totales) * 100);
    progressBar.setAttribute('aria-valuenow', porcentaje);
    progressBar.setAttribute('aria-valuetext', `${porcentaje}% completado`);
  }
  
  if (progressFill && totales > 0) {
    const porcentaje = (actuales / totales) * 100;
    progressFill.style.width = `${porcentaje}%`;
  }
}

// Actualizar contador de datos
function actualizarContadorDatos() {
  const dataCount = document.getElementById('dataCount');
  const personContainer = document.querySelector('.person-container');
  if (dataCount && personContainer) {
    const personasEnPool = personContainer.querySelectorAll('.person').length;
    dataCount.textContent = `${personasEnPool} entidades`;
  }
}

// Cambiar instrucción (generar una nueva aleatoria)
function cambiarInstruccion() {
  const nuevaInstruccion = generarInstruccionAleatoria();
  if (nuevaInstruccion) {
    instruccionActual = nuevaInstruccion;
    mostrarInstruccion();
    
    // Mover todas las personas de vuelta al contenedor original
    const personContainer = document.querySelector('.person-container');
    const dropZone = document.querySelector('#dragArea .drop-zone');
    const personasEnContenedor = dropZone 
      ? dropZone.querySelectorAll('.person')
      : document.querySelectorAll('#dragArea .person');
    
    personasEnContenedor.forEach(persona => {
      personContainer.appendChild(persona);
    });
    
    // Mostrar placeholder nuevamente
    const placeholder = document.querySelector('#dragArea .drop-placeholder');
    if (placeholder) {
      placeholder.style.display = 'block';
    }
    
    // Actualizar contadores
    actualizarContadorDatos();
  }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializar);
} else {
  inicializar();
}

// Funciones disponibles globalmente
// cambiarInstruccion y generarInstruccionAleatoria están disponibles globalmente
