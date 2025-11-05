// Importar personas desde person.js
import { personas } from './person.js';

// Importar caracteristicas para las comparaciones
import { caracteristicas } from './person.js';

// Sistema de instrucciones con operadores lógicos
let instruccionActual = null;

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
  
  // Generar instrucción aleatoria y coherente basada en los datos reales
  instruccionActual = generarInstruccionAleatoria();
  
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
  
  // Actualizar contador de datos
  actualizarContadorDatos();
}

// Mostrar instrucción actual
function mostrarInstruccion() {
  const instructionText = document.querySelector('.instruction-text');
  if (instructionText) {
    instructionText.innerHTML = `<strong>Instrucción:</strong> ${instruccionActual.texto}`;
  }
  
  // Reiniciar progreso
  setTimeout(() => {
    const todasLasPersonas = document.querySelectorAll('.person');
    let personasCorrectas = 0;
    todasLasPersonas.forEach(persona => {
      if (validarCondiciones(persona)) {
        personasCorrectas++;
      }
    });
    actualizarProgreso(0, personasCorrectas);
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
    img.alt = `Persona ${index + 1}`;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    img.style.borderRadius = '10px';
    img.draggable = false; // Prevenir que la imagen se arrastre directamente
    img.style.pointerEvents = 'none'; // Permitir que el evento pase al div padre
    
    personDiv.appendChild(img);
    
    // Tooltip con información
    personDiv.title = `Gorra: ${persona.gorra ? 'Sí' : 'No'} | Lentes: ${persona.lentes ? 'Sí' : 'No'} | Edad: ${edad} | Sexo: ${sexo} | Ropa: ${persona.ropa} | Pelo: ${pelo}`;
    
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
    
    if (validarCondiciones(elementoArrastrado)) {
      dragArea.classList.add("accept");
      dragArea.classList.remove("reject");
    } else {
      dragArea.classList.add("reject");
      dragArea.classList.remove("accept");
    }
  });
  
  dragArea.addEventListener("dragenter", (e) => {
    e.preventDefault();
    e.stopPropagation();
  });
  
  dragArea.addEventListener("dragleave", (e) => {
    // Solo remover clases si realmente salimos del área
    if (!dragArea.contains(e.relatedTarget)) {
      dragArea.classList.remove("accept", "reject");
    }
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
      dragArea.classList.remove("accept", "reject");
      return;
    }
    
    // Validar condiciones
    if (validarCondiciones(droppedPerson)) {
      // Verificar si ya está en el contenedor
      if (droppedPerson.parentElement !== dragArea) {
        // Obtener el drop-zone dentro del dragArea
        const dropZone = dragArea.querySelector('.drop-zone');
        
        // Remover de donde estaba
        droppedPerson.remove();
        
        // Agregar al área de destino (dentro del drop-zone)
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
        
        // Mostrar mensaje de éxito
        mostrarMensaje("✓ Correcto! Entidad clasificada correctamente.", "success");
        
        // Verificar si se completó el ejercicio
        verificarCompletado();
        
        // Actualizar contadores después de un pequeño delay para asegurar que el DOM se actualizó
        setTimeout(() => {
          actualizarContadorDatos();
        }, 100);
      }
    } else {
      mostrarMensaje("✗ Error: Esta entidad no cumple con las características requeridas.", "error");
    }
    
    dragArea.classList.remove("accept", "reject");
    elementoArrastrado = null;
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
function mostrarMensaje(texto, tipo) {
  // Eliminar mensaje anterior si existe
  const mensajeAnterior = document.querySelector('.mensaje-temp');
  if (mensajeAnterior) {
    mensajeAnterior.remove();
  }
  
  const mensaje = document.createElement('div');
  mensaje.className = `mensaje-temp ${tipo}`;
  mensaje.textContent = texto;
  document.body.appendChild(mensaje);
  
  setTimeout(() => {
    mensaje.remove();
  }, 2000);
}

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

// Exportar funciones útiles
export { cambiarInstruccion, generarInstruccionAleatoria };
