const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a user from the server.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to ban')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for the ban')
                .setRequired(false)),
    name: 'ban',
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const moderatorRoleId = '1256532434615402548'; // Replace with your moderator role ID

        if (!interaction.member.roles.cache.has(moderatorRoleId)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const member = interaction.guild.members.cache.get(target.id);
        if (!member) {
            return interaction.reply({ content: 'User not found.', ephemeral: true });
        }

        if (member.bannable) {
            await member.ban({ reason });
            return interaction.reply({ content: `Banned ${target.tag} for: ${reason}` });
        } else {
            return interaction.reply({ content: 'I cannot ban this user.', ephemeral: true });
        }
    },
};
