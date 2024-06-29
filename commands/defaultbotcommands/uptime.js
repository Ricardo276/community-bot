const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('uptime')
        .setDescription('Displays the bot uptime'),
    
  name: 'uptime',
  description: 'Displays the bot uptime',     
    
    async execute(interaction) {
        const uptime = formatUptime(interaction.client.uptime);

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Bot Uptime')
            .addFields({ name: 'Uptime', value: `\`${uptime}\``, inline: true });

        await interaction.reply({ embeds: [embed] });
    },
};

function formatUptime(time) {
    const seconds = Math.floor((time / 1000) % 60);
    const minutes = Math.floor((time / (1000 * 60)) % 60);
    const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
    const days = Math.floor(time / (1000 * 60 * 60 * 24));

    return `${days} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds`;
}
