const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('regels')
        .setDescription('Sends the server rules in the selected language')
        .addStringOption(option => 
            option.setName('language')
                .setDescription('Choose the language')
                .setRequired(true)
                .addChoices(
                    { name: 'Dutch', value: 'nl' },
                    { name: 'English', value: 'en' }
                )),
    
    name: 'regels',
    description: 'Sends the server rules in the selected language',

    async execute(interaction) {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            return await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const language = interaction.options.getString('language');
        
        let rulesMessage;

        if (language === 'nl') {
            rulesMessage = `Regels voor het Tellen en Spammen

Welkom in onze Discord-server! Om ervoor te zorgen dat iedereen een prettige ervaring heeft, vragen we je om je aan de volgende regels te houden:

1. **Geen Spammen**: Het is niet toegestaan om berichten te spammen. Dit geldt voor alle kanalen, inclusief het tellen.

2. **Tellen Regels**:
    - Geef anderen de kans om mee te tellen. Post niet meerdere keren achter elkaar zonder dat iemand anders heeft geteld.
    - Probeer geen gesprekken te voeren in het telkanaal. Gebruik hiervoor de daarvoor bestemde kanalen.

3. **Respecteer Anderen**: Behandel alle leden met respect. Beledigingen, schelden of intimiderend gedrag wordt niet getolereerd.

4. **Volg de Algemene Serverregels**: Naast bovenstaande specifieke regels, gelden ook alle andere algemene regels van de server. Zorg ervoor dat je deze hebt gelezen en begrijpt.

5. **Moderatoren Hebben het Laatste Woord**: Bij twijfel of discussie over de regels, hebben de moderatoren het laatste woord. Volg hun instructies op.

Dank je wel voor je medewerking en veel plezier in onze Discord-server!`;
        } else if (language === 'en') {
            rulesMessage = `Rules for Counting and Spamming

Welcome to our Discord server! To ensure everyone has a pleasant experience, we ask you to follow these rules:

1. **No Spamming**: Spamming is not allowed in any channel, including the counting channel.

2. **Counting Rules**:
    - Give others a chance to participate in counting. Do not post multiple times in a row without someone else counting.
    - Avoid having conversations in the counting channel. Use the designated channels for discussions.

3. **Respect Others**: Treat all members with respect. Insults, swearing, or intimidating behavior will not be tolerated.

4. **Follow the General Server Rules**: In addition to the above specific rules, all other general server rules also apply. Make sure you have read and understood them.

5. **Moderators Have the Final Say**: In case of any doubts or disputes regarding the rules, the moderators have the final say. Follow their instructions.

Thank you for your cooperation and enjoy your time on our Discord server!`;
        } else {
            return await interaction.reply({ content: 'Invalid language selected.', ephemeral: true });
        }

        await interaction.channel.send(rulesMessage);
        await interaction.reply({ content: 'Rules message sent!', ephemeral: true });
    },

    async run(message) {
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.reply('You do not have permission to use this command.');
        }

        const args = message.content.split(' ').slice(1);
        const language = args[0];

        let response;

        if (language === 'nl') {
            response = `Regels voor het Tellen en Spammen

Welkom in onze Discord-server! Om ervoor te zorgen dat iedereen een prettige ervaring heeft, vragen we je om je aan de volgende regels te houden:

1. **Geen Spammen**: Het is niet toegestaan om berichten te spammen. Dit geldt voor alle kanalen, inclusief het tellen.

2. **Tellen Regels**:
    - Geef anderen de kans om mee te tellen. Post niet meerdere keren achter elkaar zonder dat iemand anders heeft geteld.
    - Probeer geen gesprekken te voeren in het telkanaal. Gebruik hiervoor de daarvoor bestemde kanalen.

3. **Respecteer Anderen**: Behandel alle leden met respect. Beledigingen, schelden of intimiderend gedrag wordt niet getolereerd.

4. **Volg de Algemene Serverregels**: Naast bovenstaande specifieke regels, gelden ook alle andere algemene regels van de server. Zorg ervoor dat je deze hebt gelezen en begrijpt.

5. **Moderatoren Hebben het Laatste Woord**: Bij twijfel of discussie over de regels, hebben de moderatoren het laatste woord. Volg hun instructies op.

Dank je wel voor je medewerking en veel plezier in onze Discord-server!`;
        } else if (language === 'en') {
            response = `Rules for Counting and Spamming

Welcome to our Discord server! To ensure everyone has a pleasant experience, we ask you to follow these rules:

1. **No Spamming**: Spamming is not allowed in any channel, including the counting channel.

2. **Counting Rules**:
    - Give others a chance to participate in counting. Do not post multiple times in a row without someone else counting.
    - Avoid having conversations in the counting channel. Use the designated channels for discussions.

3. **Respect Others**: Treat all members with respect. Insults, swearing, or intimidating behavior will not be tolerated.

4. **Follow the General Server Rules**: In addition to the above specific rules, all other general server rules also apply. Make sure you have read and understood them.

5. **Moderators Have the Final Say**: In case of any doubts or disputes regarding the rules, the moderators have the final say. Follow their instructions.

Thank you for your cooperation and enjoy your time on our Discord server!`;
        } else {
            return message.reply('Invalid language. Please use "nl" for Dutch or "en" for English.');
        }

        await message.channel.send(response);
    }
};
