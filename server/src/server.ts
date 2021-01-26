import express, { response } from 'express';  /*foi necessário instalar a definição de tipos
aqui (tempo 51:16 da primeira aula). Dependendo da biblioteca é necessário
instalar a definição de tipos e em outras não, por já vir instalado 
automaticamente. O Diego explica que essas dependências só serão necessárias
para o nosso ambiente de DEV. Quando for pra prod o código será convertido
para javascript e não será necessário fazer isso.*/
import cors from 'cors';
import path from 'path';
import routes from './routes'

const app = express();

app.use(cors());
app.use(express.json()); //serve para o express entender linguagem json
/*se só digitarmos app.(app + ponto) ele já retorna todas as funções que esse
app recebe. Essas funções estão vindo de dentro da definição de tipos do
express */

app.use(routes); 

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));  //express.static serve para servirmos arquivos estáticos como uma pic, pdf, etc...

app.listen(3333);