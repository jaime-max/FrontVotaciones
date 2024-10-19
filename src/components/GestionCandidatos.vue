<script setup>
import { ref } from 'vue';
import axios from 'axios';
import imageCompression from 'browser-image-compression'; // Importa la librería de compresión

const nuevoCandidato = ref({
  nombre: '',
  apellido: '',
  curso: '',
  file: null, // Agregar el campo para el archivo
  partido: ''
}); // Datos del nuevo candidato

const fileInput = ref(null); // Ref para el input de archivo
const candidatos = ref([]); // Lista de candidatos

// Función para agregar un nuevo candidato
const agregarCandidato = async () => {
  const formData = new FormData();
  formData.append('nombre', nuevoCandidato.value.nombre);
  formData.append('apellido', nuevoCandidato.value.apellido);
  formData.append('curso', nuevoCandidato.value.curso);
  formData.append('file', nuevoCandidato.value.file); // Agregar archivo al FormData
  formData.append('partido', nuevoCandidato.value.partido);

  try {
    // Envía la solicitud al backend
    const response = await axios.post('https://votaciones-9614.onrender.com/api/candidatos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data' // Importante para enviar archivos
      }
    });
    candidatos.value.push(response.data); // Añadir el nuevo candidato a la lista

    // Limpiar los campos
    nuevoCandidato.value.nombre = '';
    nuevoCandidato.value.apellido = '';
    nuevoCandidato.value.curso = '';
    nuevoCandidato.value.file = null;
    nuevoCandidato.value.partido = '';

    // Limpiar el campo de archivo en el input
    if (fileInput.value) {
      fileInput.value.value = '';
    }
  } catch (error) {
    console.error('Error al agregar candidato:', error);
  }
};

// Función para manejar la compresión de la imagen y asignarla al candidato
const handleFileUpload = async (event) => {
  let file = event.target.files[0];

  // Opciones para la compresión de la imagen
  const options = {
    maxSizeMB: 1, // Tamaño máximo en MB
    maxWidthOrHeight: 1280, // Dimensiones máximas
    useWebWorker: true // Mejorar rendimiento
  };

  try {
    const compressedFile = await imageCompression(file, options);
    nuevoCandidato.value.file = compressedFile; // Usa la imagen comprimida
  } catch (error) {
    console.error('Error al comprimir la imagen:', error);
  }
};
</script>


<template>
  <div class="gestion-container">
    <h2>Gestión de Candidatos</h2>

    <!-- Formulario para agregar candidatos -->
    <div class="formulario-agregar">
      <h3>Agregar Candidato</h3>
      <label for="nombre">Nombre:</label>
      <input v-model="nuevoCandidato.nombre" type="text" id="nombre" placeholder="Nombre del candidato" />

      <label for="apellido">Apellido:</label>
      <input v-model="nuevoCandidato.apellido" type="text" id="apellido" placeholder="Apellido del candidato" />

      <label for="curso">Curso:</label>
      <input v-model="nuevoCandidato.curso" type="text" id="curso" placeholder="Curso del candidato" />

      <label for="partido">Partido:</label>
      <input v-model="nuevoCandidato.partido" type="text" id="partido" placeholder="Partido del candidato" />

      <label for="file">Foto:</label>
      <!-- Usa el ref para el input de archivo -->
      <input type="file" @change="handleFileUpload" id="file" ref="fileInput" required />

      <button @click="agregarCandidato">Agregar Candidato</button>
    </div>
    <router-link class="router-link" to="/">Volver a la Lista de Candidatos</router-link>
  </div>
</template>

<style scoped>
.gestion-container {
  max-width: 800px;
  margin: auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

h2, h3 {
  text-align: center;
  color: #333;
}

.formulario-agregar label, .buscador-candidatos input {
  display: block;
  margin-bottom: 10px;
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


.router-link {
  display: inline-block;
  margin-top: 10px;
  color: #4CAF50;
  text-decoration: none;
}
</style>
