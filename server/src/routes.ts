import express from 'express';
import PointsController from './controllers/pointsController';
import ItemsController from './controllers/itemsController';


const routes = express.Router();
const pointsController = new PointsController();    /* aqui é necessário criar uma instância da classe PointsController 
justamente pq se trada de uma classe e não simplesmente de uma simple função por exemplo */
const itemsController = new ItemsController();

//Rota: Endereço completo da requisição
//Recurso: Qual entidade estamos acessando do sistema

//GET: Buscar uma ou mais informações do back-end
//POST: Criar uma nova informação no back-end
//PUT: Atualizar uma informação existente no back-end
//DELETE: Remover uma informação do back-end

//Request param: Parâmetros que vem na própria rota que identificam um recurso
//Query param: Parâmetro que vem na própria rota geralmente opcionais para filtros, paginação
//Request body: Parâmetros para criação/atualização de informações

//index(para quando queremos listar um unico), show(para quando queremos listar vários), create, update, delete. Obs: Isso não é regra, mas é uma boa prática usar esses nomes pela comunidade quando queremos listar, criar, atualizar e deletar dados.
routes.get('/items', itemsController.index);
routes.post('/points', pointsController.create);
routes.get('/points', pointsController.index);
routes.get('/points/:id', pointsController.show);


export default routes;

/*OBS nada a ver com essa classe:
No meu projeto a cada alteração feita, não demora pra carregar no terminal, porém, no do Diego estava demorando
bastante. Se um dia eu perceber isso, para concertar devo fazer as mesmas mudanças que podem ser revisadas
no vídeo 2-olhando para as oportunidades no tempo +/- 1:22:00*/