//Serve para pré cadastrarmos esses items no nosso banco de dados

import Knex from 'knex';

export async function seed(knex: Knex){
    await knex('items').insert([    //colocamos o await pq esse .insert demora um pouco, então devemos espear ele finalizar
        { title: 'Lâmpadas', image: 'lampadas.svg' },
        { title: 'Pilhas e Baterias', image: 'baterias.svg' },
        { title: 'Papéis e Papelão', image: 'papeis-papelao.svg' },
        { title: 'Resíduos Eletrônicos', image: 'eletronicos.svg' },
        { title: 'Resíduos Orgânicos', image: 'organicos.svg' },
        { title: 'Óleo de Cozinha', image: 'oleo.svg' },
    ]);
}