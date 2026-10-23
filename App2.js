// 1. Clase Tarea 
class Tarea {
    constructor(nombre, completa = false) {
        this.nombre = nombre;
        this.completa = completa;
    }

    // Metodo para cambiar el estado
    completar() {
        this.completa = !this.completa;
    }

    // Metodo para editar el contenido
    editar(nuevoNombre) {
        this.nombre = nuevoNombre;
    }
}

// 2. Clase GestorDeTareas 
class GestorDeTareas {
    constructor() {
        this.tareas = [];
        
        // Referencias al DOM
        this.inputTarea = document.getElementById('nueva-tarea');
        this.btnAgregar = document.getElementById('agregar-tarea');
        this.listaTareas = document.getElementById('lista-tareas');

        // Cargar actividades previas (LocalStorage)
        this.cargarDeLocalStorage();

        // Eventos 
        this.btnAgregar.addEventListener('click', () => this.agregarTareaDesdeInput());
        
        // Presionar "Enter" tambien agrega la tarea
        this.inputTarea.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.agregarTareaDesdeInput();
        });

        // Renderizado inicial
        this.render();
    }

    agregarTareaDesdeInput() {
        // .trim() elimina espacios en blanco al inicio y final
        const nombre = this.inputTarea.value.trim(); 

        // Validacion de entrada vacia
        if (nombre === '') {
            alert('Por favor, escribe una actividad valida para el Consejo Estudiantil.');
            return;
        }

        this.agregarTarea(nombre);
        this.inputTarea.value = ''; // Limpiar el input
    }

    agregarTarea(nombre) {
        const nuevaTarea = new Tarea(nombre);
        this.tareas.push(nuevaTarea);
        this.guardarEnLocalStorage();
        this.render();
    }

    eliminarTarea(index) {
        // Confirmacion antes de eliminar 
        if(confirm('¿Estas seguro de eliminar esta actividad?')) {
            this.tareas.splice(index, 1);
            this.guardarEnLocalStorage();
            this.render();
        }
    }

    editarTarea(index) {
        const tarea = this.tareas[index];
        const nuevoNombre = prompt('Edita la actividad:', tarea.nombre);
        
        // Validar que el usuario no cancele y que el campo no quede vacio
        if (nuevoNombre !== null && nuevoNombre.trim() !== '') {
            tarea.editar(nuevoNombre.trim());
            this.guardarEnLocalStorage();
            this.render();
        }
    }

    toggleCompletar(index) {
        this.tareas[index].completar();
        this.guardarEnLocalStorage();
        this.render();
    }

    // Manipulacion del DOM 
    render() {
        this.listaTareas.innerHTML = ''; // Limpiar la lista antes de volver a dibujar

        // Iterar sobre las tareas usando forEach (ES6+)
        this.tareas.forEach((tarea, index) => {
            const li = document.createElement('li');
            
            // Si esta completa, se le agrega la clase CSS
            if (tarea.completa) {
                li.classList.add('completada');
            }

            // Template literals para el HTML dinamico
            li.innerHTML = `
                <span>${tarea.nombre}</span>
                <div class="acciones">
                    <button class="btn-completar" onclick="gestor.toggleCompletar(${index})">
                        ${tarea.completa ? 'Reanudar' : 'Completar'}
                    </button>
                    <button class="btn-editar" onclick="gestor.editarTarea(${index})">Editar</button>
                    <button class="btn-eliminar" onclick="gestor.eliminarTarea(${index})">Eliminar</button>
                </div>
            `;

            this.listaTareas.appendChild(li);
        });
    }

    // Desafio Adicional: LocalStorage 
    guardarEnLocalStorage() {
        // Convertir el arreglo de objetos a string para guardarlo
        localStorage.setItem('actividadesConsejo', JSON.stringify(this.tareas));
    }

    cargarDeLocalStorage() {
        const tareasGuardadas = localStorage.getItem('actividadesConsejo');
        if (tareasGuardadas) {
            const tareasParseadas = JSON.parse(tareasGuardadas);
            // Volver a instanciar como objetos de la clase Tarea
            this.tareas = tareasParseadas.map(t => new Tarea(t.nombre, t.completa));
        }
    }
}

// Inicializar la aplicacion
// Se crea la instancia global para que los botones "onclick" del HTML la puedan encontrar
const gestor = new GestorDeTareas();