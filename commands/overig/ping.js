const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Toont de ping van jou en de bot!'),

  name: 'ping',
  description: 'Toont de ping van jou en de bot!',
  
  async execute(interaction) {
    const start = Date.now(); // Tijdstip voordat het bericht wordt verzonden

    // Wacht 0 seconden voordat de bot reageert
    await new Promise(resolve => setTimeout(resolve, 0));

    const end = Date.now(); // Tijdstip wanneer het antwoord wordt ontvangen
    const botLatency = end - start; // Bereken de bot-latency

    const userLatency = Date.now() - interaction.createdTimestamp;

    const response = `Pong! User Latency: ${userLatency}ms Bot Latency: ${botLatency}ms`;
    await interaction.reply(response); // Verstuur het antwoord met de volledige latency-informatie
  },

  async run(message) {
    const start = Date.now(); // Tijdstip voordat het bericht wordt verzonden

    // Wacht 2 seconden voordat de bot reageert
    await new Promise(resolve => setTimeout(resolve, 2000));

    const end = Date.now(); // Tijdstip wanneer het antwoord wordt ontvangen
    const botLatency = end - start; // Bereken de bot-latency

    const userLatency = Date.now() - message.createdTimestamp;

    const response = `Pong! User Latency: ${userLatency}ms Bot Latency: ${botLatency}ms`;
    await message.channel.send(response); // Verstuur het antwoord met de volledige latency-informatie
  }
};