import React from 'react'
import { Route, BrowserRouter } from 'react-router-dom'

import Home from './Pages/Home'
import CreatePoint from './Pages/CreatePoint'

const Routes = () => {
    return(
        <BrowserRouter>
            <Route component={Home} path="/" exact/>
            <Route component={CreatePoint} path="/create-point"/>
            {/* OBS: Se compararmos as duas rotas sem o 'exact' como ambas começam com '/' ele vai cair sempre na primeira
            pq o React não verifica exatamente o endereço completo e para fazer isso, devemos add o 'exact. */}
        </BrowserRouter>
    );
}

export default Routes;