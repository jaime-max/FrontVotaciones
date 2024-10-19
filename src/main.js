import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Importa el router

createApp(App)
  .use(router) // Usa el router en la aplicación
  .mount('#app');

export default router;
