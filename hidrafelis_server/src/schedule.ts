import { CronJob } from "cron";
import { bot } from "./telegram";
import './telegram';
import { getActiveUsers, getStatus } from "./repository";

new CronJob(
	'0 0 20 * * *', 
	async function () {
		let date = new Date();
		date.setTime(date.getTime() - (60 * 60 * 1000));

		const activeUsers = await getActiveUsers();
		const lastsStatus = await getStatus(date);

		if (lastsStatus) {
			const minValue = Math.min(...lastsStatus.map(obj => obj.value));
			
			if (minValue < 200) {
				for (const { user } of activeUsers) {
					bot.sendMessage(user, 'Quantidade crítica de água! Reabasteça imediatamente.');
				}
			} 
		}
	}, 
	null, 
	true, 
	'America/Sao_Paulo' 
);


