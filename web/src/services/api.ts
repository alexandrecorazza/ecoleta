import axios from 'axios'
/*
usaremos a biblioteca axios para requisições na nossa api ao invés do fetch(que é nativo do próprio navegador)
pq com o axios podemos usar uma baseURL que é uma url que vai se repetir entre todas as requisições que é o http://localhost
assim, se ouver qualquer mudança ou eu adicionar novas rotas, basta manipular apenas essa baseURL que mudará automaticamente
para todas.
*/

const api = axios.create({
    baseURL: 'http://localhost:3333'
});

export default api