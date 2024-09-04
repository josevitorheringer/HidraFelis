
import { Knex, knex } from 'knex';

const knexConfig = {
    client: "mysql2",
    connection: {
        host: '',
        port: 3306,
        user: '',
        password: '',
        database: 'hidrafelis'
    }
    }

const queryKnex = knex(knexConfig)

export async function insert(value: string) {
    return await queryKnex('log').insert({value, date: new Date()})
}

export async function addNewUser(telegramId: number) {
  return await queryKnex('users').insert({user: telegramId, active: true})
}

export async function getUserByChatId(id: number) {
  return await queryKnex('users').select('*').where('user', id).first();
}

export async function updateUser(id: number, data) {
  return await queryKnex('users').update(data).where('user', id);
}

export async function getActiveUsers() {
  return await queryKnex('users').select('*').where('active', 1);
}

export async function getStatus(date: Date) {
  return await queryKnex('log').select('*').where('date', '>=', date).limit(1).orderBy('date', 'desc');
}