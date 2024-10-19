<script setup>

import {ref, onMounted, computed} from 'vue';
import axios from 'axios';

const candidatos = ref([]); // Lista de candidatos inicial
const showModal = ref(false); // Controla la visibilidad del modal
const selectedCandidato = ref(null); // Almacena el candidato seleccionado
const successMessage = ref(false); // Controla la visibilidad del mensaje de éxito
const searchQuery = ref(''); // Para la búsqueda

// Función para votar por un candidato
const votar = async () => {
  if (!selectedCandidato.value) return; // Si no hay candidato seleccionado, no hace nada
  try {
    await axios.post(`https://votaciones-9614.onrender.com/api/candidatos/votar/${selectedCandidato.value.id}`);

    // Solo actualizamos el conteo de votos del candidato que fue votado
    selectedCandidato.value.votos += 1; // Aumenta el conteo de votos en la lista local
    successMessage.value = true; // Muestra el mensaje de éxito

    // Oculta el mensaje de éxito después de 3 segundos
    setTimeout(() => {
      successMessage.value = false;
    }, 1000);
  } catch (error) {
    console.error("Error al votar:", error);
  } finally {
    showModal.value = false; // Cierra el modal después de votar
  }
};

// Función para abrir el modal con el candidato seleccionado
const confirmarVoto = (candidato) => {
  selectedCandidato.value = candidato;
  showModal.value = true;
};

// Función para obtener la lista de candidatos desde la API
const obtenerCandidatos = async () => {
  try {
    const response = await axios.get('https://votaciones-9614.onrender.com/api/candidatos'); // Asegúrate de que esta URL es correcta
    candidatos.value = response.data; // Carga la lista inicial de candidatos
  } catch (error) {
    console.error('Error al obtener los candidatos:', error);
  }
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

// Llamada inicial para obtener los candidatos
onMounted(() => {
  obtenerCandidatos(); // Llama a la función al montar el componente
});

</script>

<template>
  <div class="candidato-container">
    <h2>Votantes - Lista de Candidatos</h2>
    <div class="buscador-candidatos">
      <h3>Buscar Candidato</h3>
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
      </tr>
      </thead>
      <tbody>
      <tr v-for="candidato in candidatosFiltrados" :key="candidato.id">
        <td>
          <div style="display: flex; align-items: center;"> <!-- Flexbox para alinear la foto y el nombre -->
            <img
              v-if="candidato.foto"
              :src="`http://localhost:8080/uploads/${candidato.foto}`"
              alt="Foto del candidato"
              style="width: 50px; height: auto; margin-right: 10px;"/>
            {{ candidato.nombre }}
          </div>
        </td>
        <td>{{ candidato.apellido }}</td>
        <td>{{ candidato.curso }}</td>
        <td>{{ candidato.partido }}</td>
        <td>
          <button class="vote-button" @click="confirmarVoto(candidato)">Votar</button>
        </td>
      </tr>
      </tbody>
    </table>

    <!-- Modal de Confirmación -->
    <div class="modal" v-if="showModal">
      <div class="modal-content">
        <h3>Confirmación de Voto</h3>
        <p>¿Está seguro de votar por {{ selectedCandidato?.nombre }} {{ selectedCandidato?.apellido }}?</p>
        <button class="modal-button" @click="votar">Aceptar</button>
        <button class="modal-button" @click="showModal = false">Cancelar</button>
      </div>
    </div>

    <!-- Mensaje de éxito -->
    <div class="success-message" v-if="successMessage">
      Voto realizado con éxito.
    </div>

    <router-link class="router-link" to="/">Volver a la Lista de Candidatos</router-link>
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

.vote-button {
  padding: 8px 16px; /* Espaciado interno del botón */
  background-color: #4CAF50; /* Color de fondo del botón */
  color: white; /* Color del texto */
  border: none; /* Sin bordes */
  border-radius: 5px; /* Bordes redondeados */
  cursor: pointer; /* Cambia el cursor al pasar el mouse */
}

.vote-button:hover {
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

/* Estilos para el modal */
.modal {
  position: fixed; /* Posición fija */
  top: 0; /* Posiciona en la parte superior */
  left: 0; /* Posiciona a la izquierda */
  width: 100%; /* Ancho completo */
  height: 100%; /* Altura completa */
  background-color: rgba(0, 0, 0, 0.5); /* Fondo oscuro semi-transparente */
  display: flex; /* Flexbox para centrar contenido */
  align-items: center; /* Centra verticalmente */
  justify-content: center; /* Centra horizontalmente */
}

.modal-content {
  background-color: white; /* Fondo blanco del modal */
  border-radius: 8px; /* Bordes redondeados */
  padding: 20px; /* Espaciado interno */
  text-align: center; /* Centra el texto */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3); /* Sombra del modal */
}

.modal-button {
  padding: 10px 20px; /* Espaciado interno del botón del modal */
  background-color: #4CAF50; /* Color de fondo del botón */
  color: white; /* Color del texto */
  border: none; /* Sin bordes */
  border-radius: 5px; /* Bordes redondeados */
  cursor: pointer; /* Cambia el cursor al pasar el mouse */
  margin: 5px; /* Margen entre botones */
}

.modal-button:hover {
  background-color: #45a049; /* Color de fondo al pasar el mouse */
}

/* Estilo para el mensaje de éxito */
.success-message {
  background-color: #dff0d8; /* Fondo verde claro */
  color: #3c763d; /* Color del texto */
  border: 1px solid #d6e9c6; /* Borde verde */
  border-radius: 5px; /* Bordes redondeados */
  padding: 10px; /* Espaciado interno */
  text-align: center; /* Centra el texto */
  margin-top: 20px; /* Margen superior */
}
</style>
