const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Timeout a user from the server.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to timeout')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('duration')
                .setDescription('The duration of the timeout in minutes')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for the timeout')
                .setRequired(false)),
    name: 'timeout',
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const duration = interaction.options.getInteger('duration');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const moderatorRoleId = '1256532434615402548'; // Replace with your moderator role ID

        if (!interaction.member.roles.cache.has(moderatorRoleId)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const member = interaction.guild.members.cache.get(target.id);
        if (!member) {
            return interaction.reply({ content: 'User not found.', ephemeral: true });
        }

        const timeoutDuration = duration * 60 * 1000; // Convert minutes to milliseconds
        try {
            await member.timeout(timeoutDuration, reason);
            return interaction.reply({ content: `Timed out ${target.tag} for ${duration} minutes. Reason: ${reason}` });
        } catch (error) {
            return interaction.reply({ content: 'I cannot timeout this user.', ephemeral: true });
        }
    },
};
