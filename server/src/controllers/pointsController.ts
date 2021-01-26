import { Request, Response } from 'express';
import knex from '../database/connection';

class PointsController {
    async index(request: Request, response: Response){
        const { city, uf, items } = request.query;

        const parsedItems = String(items)
            .split(',')
            .map(item => Number(item.trim()));

        const points = await knex('points')
            .join('point_items', 'points.id', '=', 'point_items.point_id')
            .whereIn('point_items.item_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*');

        return response.json(points)
    }

    async show(request: Request, response: Response){
        const { id } = request.params;

        const point = await knex('points').where('id', id).first(); /*obs se eu passar o mouse por cima da variável point
        sem esse first, observamos que ela é um array. Com o .first() ela deixa de ser um array pq tá pegando só o primeiro 
        registro da tabela*/
        if(!point){
            return response.status(400).json({ message: 'point not found' });
        }

        const items = await knex('items')
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', id)
            .select('items.title') //opção para exibir apenas o título
        //relacionamente entre os pontos de coleta e seus items

        return response.json({ point, items });
    }

    async create(request: Request, response: Response){
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = request.body;
    
        const trx = await knex.transaction();   /* dentro dessa rota de /points temos dois inserts no banco: o 'points' e o
        insert no 'pointsItem'. Se um deles falhar, não ficaria legal se o outro funcionasse, então usaremos essa função
        transaction para impedir que o outro insert seja realizado caso um dos dois falhe. Para aplicar, nas linhas onde temos o
        insert, devemos substituir onde tem knex por txt que é a variável que declaramos para a nossa transaction */
    
        const point = {
            image: 'https://images.unsplash.com/photo-1556767576-5ec41e3239ea?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
            //obs: O Diego diminuiu a qualidade da imagem pelo próprio link e mostrou o site em que pega as imagens tbm.(Vídeo: Olhando para as oportunidades. 02:01:50)
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        };

        const insertedIds = await trx('points').insert(point);   //aqui está usando o conceito de short sintax, onde não é necessário por ex declarar name = name. 

        const point_id = insertedIds[0];
    
        const pointItems = items.map((item_id: number) => {
            return {
                item_id,
                point_id,
            };
        })
    
        await trx('point_items').insert(pointItems);

        await trx.commit();
        //ATENÇÃO!!!! Sempre que usamos transactions, precisamos dar o COMMIT. Só assim ele realmente vai fazer os inserts na base de dados. Se não tivessemos a linha de código acima não conseguiríamos criar nenhum ponto, item, etc. A resposta no insomnia é como se tivesse criado, mas se olharmos no banco, não criou! Se atentar a isso sempre!
    
        return response.json({
            id: point_id,
            ...point,   //retorna todos os dados do meu point (utilização do conceito de Spread Operator)
        });
    };
};

export default PointsController;