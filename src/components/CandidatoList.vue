<script setup>
import { computed, ref, onMounted } from 'vue';
import axios from 'axios';

const candidatos = ref([]);
const searchQuery = ref('');
const totalVotos = ref(0);
const candidatoSeleccionado = ref({});
const mostrarModal = ref(false);
let fotoActualizada = null;

const obtenerTotalVotos = async () => {
  try {
    const response = await axios.get('https://votaciones-9614.onrender.com/api/candidatos/total-votos');
    totalVotos.value = response.data;
  } catch (error) {
    console.error("Error al obtener el total de votos:", error);
  }
};

const obtenerCandidatos = async () => {
  try {
    const response = await axios.get('https://votaciones-9614.onrender.com/api/candidatos');
    candidatos.value = response.data;
    ordenarCandidatos();
  } catch (error) {
    console.error("Error al obtener los candidatos:", error);
  }
};

const eliminarCandidato = async (id) => {
  try {
    await axios.delete(`https://votaciones-9614.onrender.com/api/candidatos/${id}`);
    candidatos.value = candidatos.value.filter(candidato => candidato.id !== id);
  } catch (error) {
    console.error('Error al eliminar el candidato:', error);
  }
};

const ordenarCandidatos = () => {
  candidatos.value.sort((a, b) => b.votos - a.votos);
};

const mostrarVotos = ref(false);

const toggleMostrarVotos = () => {
  mostrarVotos.value = !mostrarVotos.value;
};

const candidatosFiltrados = computed(() => {
  if (!searchQuery.value) {
    return candidatos.value;
  }
  return candidatos.value.filter(candidato =>
    candidato.nombre.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    candidato.apellido.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const mostrarModalActualizar = (candidato) => {
  candidatoSeleccionado.value = { ...candidato }; // Hacer una copia para evitar cambios directos
  mostrarModal.value = true;
};

const cerrarModal = () => {
  mostrarModal.value = false;
};

const onFileChange = (event) => {
  fotoActualizada = event.target.files[0];
};

const editarCandidato = async () => {
  const formData = new FormData();
  formData.append('nombre', candidatoSeleccionado.value.nombre);
  formData.append('apellido', candidatoSeleccionado.value.apellido);
  formData.append('curso', candidatoSeleccionado.value.curso);
  formData.append('partido', candidatoSeleccionado.value.partido);

  if (fotoActualizada) {
    formData.append('file', fotoActualizada);
  }

  try {
    await axios.put(`https://votaciones-9614.onrender.com/api/candidatos/${candidatoSeleccionado.value.id}`, formData);
    cerrarModal();
    obtenerCandidatos();

    candidatoSeleccionado.value = {};
    fotoActualizada = null;
  } catch (error) {
    console.error('Error al editar candidato:', error);
  }
};

onMounted(() => {
  obtenerCandidatos();
  obtenerTotalVotos();
});

</script>

<template>
  <div class="candidato-container">
    <h2>Lista de Candidatos</h2>

    <!-- Modal de Actualización -->
    <div v-if="mostrarModal" class="modal-overlay">
      <div class="modal">
        <h3>Actualizar Candidato</h3>
        <form @submit.prevent="editarCandidato">
          <label for="nombre">Nombre:</label>
          <input v-model="candidatoSeleccionado.nombre" type="text" required />

          <label for="apellido">Apellido:</label>
          <input v-model="candidatoSeleccionado.apellido" type="text" required />

          <label for="curso">Curso:</label>
          <input v-model="candidatoSeleccionado.curso" type="text" required />

          <label for="partido">Partido:</label>
          <input v-model="candidatoSeleccionado.partido" type="text" required />

          <label for="foto">Foto:</label>
          <input type="file" @change="onFileChange" />

          <div class="modal-actions">
            <button type="submit">Actualizar</button>
            <button @click="cerrarModal">Cancelar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Buscador de candidatos -->
    <div class="buscador-candidatos">
      <input v-model="searchQuery" type="text" placeholder="Buscar por nombre o apellido" />
    </div>

    <table class="candidato-table">
      <thead>
      <tr>
        <th>Nombre</th>
        <th>Apellido</th>
        <th>Curso</th>
        <th>Partido</th>
        <th>Acciones</th>
        <th v-if="mostrarVotos">Votos</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="candidato in candidatosFiltrados" :key="candidato.id">
        <td>
          <div style="display: flex; align-items: center;">
            <img
              v-if="candidato.foto"
              :src="`https://votaciones-9614.onrender.com/uploads/${candidato.foto}`"
              alt="Foto del candidato"
              style="width: 50px; height: auto; margin-right: 10px;" />
            <span>{{ candidato.nombre }}</span>
          </div>
        </td>
        <td>{{ candidato.apellido }}</td>
        <td>{{ candidato.curso }}</td>
        <td>{{ candidato.partido }}</td>
        <td>
          <button @click="eliminarCandidato(candidato.id)" style="margin-right: 10px;">Eliminar</button>
          <button @click="mostrarModalActualizar(candidato)">Editar</button>
        </td>
        <td v-if="mostrarVotos">{{ candidato.votos }}</td>
      </tr>
      </tbody>
    </table>

    <button class="toggle-votes-button" @click="toggleMostrarVotos">
      {{ mostrarVotos ? 'Ocultar Votos' : 'Mostrar Votos' }}
    </button>

    <!-- Mostrar el total de votos -->
    <div class="total-votos">
      <p>Total Votos: {{ totalVotos }}</p>
    </div>

    <div>
      <router-link class="router-link" to="/votantes">Ver Candidatos para Votar</router-link>
    </div>
  </div>
</template>

<style scoped>
.candidato-container {
  max-width: 800px; /* Máximo ancho del contenedor */
  margin: auto; /* Centra el contenedor */
  padding: 20px; /* Espaciado interno */
  background-color: #f9f9f9; /* Fondo claro */
  border-radius: 8px; /* Bordes redondeados */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Sombra suave */
}

h2 {
  text-align: center; /* Centra el título */
  color: #333; /* Color del texto */
  margin-bottom: 20px; /* Margen inferior */
}

.candidato-table {
  width: 100%; /* Tabla ocupa el 100% del ancho */
  border-collapse: collapse; /* Combina bordes */
  margin-bottom: 20px; /* Margen inferior */
}

.candidato-table th, .candidato-table td {
  padding: 12px; /* Espaciado interno */
  text-align: left; /* Alineación del texto */
  border-bottom: 1px solid #ddd; /* Línea divisoria */
}

.candidato-table th {
  background-color: #4CAF50; /* Color de fondo de encabezados */
  color: white; /* Color del texto de encabezados */
}

.candidato-table tr:hover {
  background-color: #f1f1f1; /* Color de fondo al pasar el mouse */
}

.toggle-votes-button {
  display: block; /* Hace que el botón ocupe todo el ancho */
  margin: 20px auto; /* Margen superior e inferior */
  padding: 10px 20px; /* Espaciado interno */
  background-color: #4CAF50; /* Color de fondo del botón */
  color: white; /* Color del texto */
  border: none; /* Sin bordes */
  border-radius: 5px; /* Bordes redondeados */
  cursor: pointer; /* Cambia el cursor al pasar el mouse */
  font-size: 16px; /* Tamaño de fuente */
}

.toggle-votes-button:hover {
  background-color: #45a049; /* Color de fondo al pasar el mouse */
}

.router-link {
  display: inline-block; /* Hace que el enlace ocupe solo el espacio necesario */
  margin-top: 10px; /* Margen superior */
  color: #4CAF50; /* Color del texto */
  text-decoration: none; /* Sin subrayado */
}

.router-link:hover {
  text-decoration: underline; /* Subrayado al pasar el mouse */
}
button {
  background-color: #4CAF50;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
.total-votos {
  margin-bottom: 20px;
  font-size: 18px;
  color: #050505;
}
.modal-overlay{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color:rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal{
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  width: 500px;
}

.modal form label {
  display: block; /* Colocar las etiquetas en bloque */
  margin-bottom: 8px; /* Añadir espacio debajo de las etiquetas */
  font-weight: bold; /* Resaltar las etiquetas */
}

.modal form input {
  width: 100%; /* Hacer que los inputs ocupen  */
  padding: 10px; /* Aumentar el espacio interno de los inputs */
  margin-bottom: 15px; /* Separar los campos entre sí */
  border: 1px solid #ddd; /* Bordes claros */
  border-radius: 5px; /* Bordes redondeados */
}


.modal-actions{
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}
.modal-actions button{
  padding: 8px 12px;
}

</style>
