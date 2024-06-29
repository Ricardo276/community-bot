const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('solicitatie')
        .setDescription('Solicitatie Form')
        .addStringOption(option => 
            option.setName('language')
                .setDescription('Choose the language')
                .setRequired(true)
                .addChoices(
                    { name: 'Solicitatie NL', value: 'nl' },
                    { name: 'Solicitatie EN', value: 'en' }
                )),
    
    name: 'solicitatie',
    description: 'Solicitatie Form',

    async execute(interaction) {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            return await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const language = interaction.options.getString('language');
        
        let rulesMessage;

        if (language === 'nl') {
            rulesMessage = `Naam:

Leeftijd:

Waarom zal er ooit personeel aanwezig zijn:

Drie pluspunten:

Drie minuten punten:

Graag horen wij iets van iemand anders:

Wat is jouw motivatie:`;
        } else if (language === 'en') {
            rulesMessage = `Name:

Age:

Why will there ever be staff present:

Three plus points:

Three minute points:

We would like to hear from someone else:

What is your motivation:`;
        } else {
            return await interaction.reply({ content: 'Invalid language selected.', ephemeral: true });
        }

        await interaction.channel.send(rulesMessage);
        await interaction.reply({ content: 'Solicitatie message sent!', ephemeral: true });
    },

    async run(message) {
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.reply('You do not have permission to use this command.');
        }

        const args = message.content.split(' ').slice(1);
        const language = args[0];

        let response;

        if (language === 'nl') {
            response = `Naam:

Leeftijd:

Waarom zal er ooit personeel aanwezig zijn:

Drie pluspunten:

Drie minuten punten:

Graag horen wij iets van iemand anders:

Wat is jouw motivatie:`;
        } else if (language === 'en') {
            response = `Name:

Age:

Why will there ever be staff present:

Three plus points:

Three minute points:

We would like to hear from someone else:

What is your motivation:`;
        } else {
            return message.reply('Invalid language. Please use "nl" for Dutch or "en" for English.');
        }

        await message.channel.send(response);
    }
};
