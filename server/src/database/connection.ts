import knex from 'knex';
import path from 'path';    //serve para unir caminhos e diretórios do nosso pc

const connection = knex({
    client: 'sqlite3',   //é qual client queremos usar.(sqlite, mysql, oracledb, etc)
    //obs: Devemos instalar o sqlite. comando: npm install sqlite3
    connection: {
        filename: path.resolve(__dirname, 'database.sqlite'),   //filename é o arquivo que vamos armazenar o nosso bd
        //__dirname retorna o diretório para o nosso arquivo connection.ts
        //'database.sqlite' vamos executar esse arquivo na pasta database
        //explicação melhor 37:34min da aula 2
    },
    useNullAsDefault: true,
});

export default connection;

//migration = histórico do banco de dados
/*é possível fazer um 'merge' caso eu crie uma tabela por ex e outra pessoa crie outra.
Ao invés de pedir o código pro outro pra colar no projeto, fazemos um merge usando esse conceito de migration*/