const { EmbedBuilder } = require('discord.js');
const { welcomeChannelId, autoRoleId } = require('./config.json');

module.exports = {
  name: 'guildMemberAdd',
  async execute(client, member) {
    const channel = member.guild.channels.cache.get(welcomeChannelId);
    if (!channel) return;

    const embed = new EmbedBuilder()
      .setTitle(`Welkome ${member.user.username}`)
      .setDescription('Welkom bij Ricardo(S) en Sara(S) Community waar de Beste Community Voort Leeft')
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setColor('#610000');

    channel.send({ embeds: [embed] });

    const role = member.guild.roles.cache.get(autoRoleId);
    if (role) {
      member.roles.add(role);
    }
  }
};
