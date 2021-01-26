import React from 'react';
import { FiLogIn } from 'react-icons/fi'
import { Link } from 'react-router-dom'

import './styles.css'
import logo from '../../assets/logo.svg'

const Home = () => {
    return (
        <div id="page-home">
            <div className="content">
                <header>
                    <img src={logo} alt="Ecoleta"/>
                </header>
                <main>
                    <h1>Seu marketplace de coleta de resíduos.</h1>
                    <p>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</p>
                    <Link to="/create-point">
                        {/*OBS: Usamos esse Link to no lugar de a href pois quando usamos o a href e clicamos no botão, o React
                        recarrega toda a aplicação novamente (se clicarmos no link usando o href, podemos abrir o console na aba
                        network e veremos que ele exibe alguns dados carregados, o que prova que a página foi carregada).
                        Um dos principais conceitos do React é que ele serve pra construir SPA(single page application) que é uma forma
                        de não precisarmos recarregar toda aplicação quando fazemos uma alteração de rota. Confirmamos que a app
                        não foi carregad pq usando o link to não aparece nada na aba network ao clicarmos no botão a não ser o 
                        favicon. Isso deixa nosso app MUITO mais performático\
                     */}
                        <span>
                            <FiLogIn />
                        </span>
                        <strong>Cadastre um ponto de coleta</strong>
                    </Link>
                </main>
            </div>
        </div>
    )
}

export default Home;