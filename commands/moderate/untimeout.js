const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('untimeout')
        .setDescription('Remove timeout from a user.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to remove timeout from')
                .setRequired(true)),
    name: 'untimeout',
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const moderatorRoleId = '1256532434615402548'; // Replace with your moderator role ID

        if (!interaction.member.roles.cache.has(moderatorRoleId)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const member = interaction.guild.members.cache.get(target.id);
        if (!member) {
            return interaction.reply({ content: 'User not found.', ephemeral: true });
        }

        try {
            await member.timeout(null);
            return interaction.reply({ content: `Removed timeout from ${target.tag}.` });
        } catch (error) {
            console.error('Error removing timeout:', error);
            return interaction.reply({ content: 'I cannot remove timeout from this user.', ephemeral: true });
        }
    },
};
