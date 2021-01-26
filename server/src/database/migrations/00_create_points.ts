import Knex from 'knex';

export async function up(knex: Knex){ //serve pra realizar as alterações que fazermos no banco
    //CRIAR A TABELA
    return knex.schema.createTable('points', table => {    //points é o nome da tabela. table é a referência pra criar os campos na tabela
        table.increments('id').primary();   //autoincrement (PK)
        table.string('image').notNullable();    //notNullable = not null
        table.string('name').notNullable();
        table.string('email').notNullable();
        table.string('whatsapp').notNullable();
        table.decimal('latitude').notNullable();
        table.decimal('longitude').notNullable();
        table.string('city').notNullable();
        table.string('uf', 2).notNullable();    //2 é o tamanho limite do campo
    });
}

export async function down(knex: Knex){
    //O método down sempre faz o contrário do que fizemos no método UP
    //(DELETAR A TABELA) pois o método up está criando a tabela
    return knex.schema.dropTable('point');
}