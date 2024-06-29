const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Deletes a specified number of messages')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Number of messages to delete')
                .setRequired(true)),
    
    name: 'purge',
    description: 'Deletes a specified number of messages',

    async execute(interaction) {
        if (!interaction.member.permissions.has('MANAGE_MESSAGES')) {
            return await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const amount = interaction.options.getInteger('amount');

        if (amount < 1 || amount > 100) {
            return await interaction.reply({ content: 'You need to input a number between 1 and 100.', ephemeral: true });
        }

        await interaction.channel.bulkDelete(amount, true).catch(error => {
            console.error(error);
            interaction.reply({ content: 'There was an error trying to purge messages in this channel!', ephemeral: true });
        });

        await interaction.reply({ content: `Successfully deleted ${amount} messages.`, ephemeral: true });
    },

    async run(message) {
        if (!message.member.permissions.has('MANAGE_MESSAGES')) {
            return message.reply('You do not have permission to use this command.');
        }

        const args = message.content.split(' ').slice(1);
        const amount = parseInt(args[0]);

        if (isNaN(amount) || amount < 1 || amount > 100) {
            return message.reply('You need to input a number between 1 and 100.');
        }

        await message.channel.bulkDelete(amount, true).catch(error => {
            console.error(error);
            message.reply('There was an error trying to purge messages in this channel!');
        });

        message.reply(`Successfully deleted ${amount} messages.`).then(msg => {
            setTimeout(() => msg.delete(), 5000);
        });
    }
};
