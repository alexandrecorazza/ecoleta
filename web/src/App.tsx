import React from 'react';
import './App.css';
import Routes from './routes';

function App() {
  return (  //abrimos parênteses no return pq queremos retornar mais de uma linha de retorno
    <Routes />
    //Dica para produtividade: usar a extensão 'emmet' para facilitar a criação de tags. Executar por exemplo: div#oioi>ul>li*5 e ver o resultado.
  );
}

export default App;
