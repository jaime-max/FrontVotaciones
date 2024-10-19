import { createRouter, createWebHistory } from 'vue-router';
import CandidatoList from "@/components/CandidatoList.vue"; // Asegúrate de que la ruta sea correcta
import VotantesView from "@/components/VotantesView.vue";
import GestionCandidatos from "@/components/GestionCandidatos.vue";
import Candidatodos from '@/components/Candidatodos.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: CandidatoList // Aquí usamos el componente de la lista de candidatos como la vista principal
  },
  {
    path: '/votantes', // Ruta para los votantes
    name: 'Votantes',
    component: VotantesView // Componente para la vista de votantes
  },
  {
    path: '/agregar', // Ruta para los votantes
    name: 'agregar',
    component: GestionCandidatos // Componente para la vista de votantes
  },
  {
    path: '/candidato2', // Ruta para los votantes
    name: 'Candidato2',
    component: Candidatodos // Componente para la vista de votantes
  },
  // Aquí puedes agregar más rutas según sea necesario
];

const router = createRouter({
  history: createWebHistory(), // Usa el historial HTML5
  routes,
});

export default router;
