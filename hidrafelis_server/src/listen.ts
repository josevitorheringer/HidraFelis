import mqtt from "mqtt";
import { insert } from "./repository";

const client = mqtt.connect("");
const myTopic = 'hidrafelis';

client.on("connect", () => {
    client.subscribe(myTopic, (err) => {
        if (!err) {
            console.log('connected');
        }
    });
});

client.on("message", async (topic, message) => {
    if (topic === myTopic) {
        await insert(message.toString());
    }
});