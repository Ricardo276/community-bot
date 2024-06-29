const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unban a user from the server.')
        .addStringOption(option =>
            option.setName('userid')
                .setDescription('The ID of the user to unban')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for the unban')
                .setRequired(false)),
    name: 'unban',
    async execute(interaction) {
        const userId = interaction.options.getString('userid');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const moderatorRoleId = '1256532434615402548'; // Replace with your moderator role ID

        if (!interaction.member.roles.cache.has(moderatorRoleId)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        try {
            await interaction.guild.members.unban(userId, reason);
            return interaction.reply({ content: `Unbanned user with ID ${userId}. Reason: ${reason}` });
        } catch (error) {
            console.error('Error unbanning user:', error);
            return interaction.reply({ content: 'I cannot unban this user. Please check the ID and try again.', ephemeral: true });
        }
    },
};
