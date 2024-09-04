import TelegramBot from "node-telegram-bot-api";
import { addNewUser, getStatus, getUserByChatId, updateUser } from "./repository";

const token = '';

export const bot = new TelegramBot(token, {polling: true});

const actionsMap = new Map<string, Function>([
    ['start', start],
    ['stop', stop],
    ['help', help],
    ['status', status]
])

bot.on('message', async (msg) => {
    const message = msg.text?.toString().toLowerCase().replace('/', '') ?? '';

    const callback = actionsMap.get(message);

    if (callback) {
        await callback(msg.chat.id);
    }
});

async function start(id: number) {
    const user = await getUserByChatId(id);
    await bot.sendMessage(id, 'Você se inscreveu para receber notificações do HidraFelis! Digite "help" para ver os comandos básicos.');

    if(!user) {
        await addNewUser(id);
        return;
    }

    if (!user?.active) {
        await updateUser(id, {active: 1})
        return;
    }
}

async function stop(id: number) {
    const user = await getUserByChatId(id);

    if (user?.active) {
        await updateUser(id, {active: 0})
        return;
    }
}

async function help(id) {
    await bot.sendMessage(id, 'start: Receber notificações \nstop: Parar de receber notificações \nstatus: Verifica estado do tanque \nhelp: Listar Comandos');
}

async function status(id) {

    let date = new Date();
    date.setTime(date.getTime() - (60 * 60 * 1000));

    const lastsStatus = await getStatus(date);
    
    if (lastsStatus) {
        const minValue = Math.min(...lastsStatus.map(obj => obj.value));
        
        if (minValue === Infinity) {
            bot.sendMessage(id, 'O HidraFelis não conseguiu encontrar registros recentes! Por favor, verifique se o seu dispositivo está conectado corretamente.');
            return;
        }

        if (minValue < 100) {
            bot.sendMessage(id, 'Quantidade crítica de água! Reabasteça imediatamente.');
            return;
        } 

        if (minValue < 400) {
            bot.sendMessage(id, 'Parece que a água do seu pet está acabando! Por favor reabasteça.');
            return;
        } 
        
        await bot.sendMessage(id, 'O seu pet está hidratado! Não é necessário encher o tanque.');
    }
}