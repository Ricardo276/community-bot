const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Repeats your message')
        .addStringOption(option => 
            option.setName('message')
                .setDescription('The message to repeat')
                .setRequired(true)),
    
    name: 'say',
    description: 'Repeats your message',
    
    async execute(interaction) {
        if (!interaction.member.permissions.has('MANAGE_MESSAGES')) {
            return await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const message = interaction.options.getString('message');
        await interaction.channel.send(message); // Verstuur het bericht in het kanaal
        await interaction.reply({ content: 'Message sent!', ephemeral: true }); // Verborgen bevestiging
    },

    async run(message) {
        if (!message.member.permissions.has('MANAGE_MESSAGES')) {
            return message.reply('You do not have permission to use this command.');
        }

        const args = message.content.slice(1).trim().split(/ +/);
        const command = args.shift().toLowerCase();
        
        if (command === 'say') {
            const sayMessage = args.join(' ');
            await message.channel.send(sayMessage);
        }
    }
};
