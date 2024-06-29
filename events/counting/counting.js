const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { token } = require('./config.json');
const fs = require('fs');
const path = require('path');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const CHANNEL_ID = '1255178589142253700'; // Replace this with your channel ID
const COUNT_FILE = path.join(__dirname, 'counting.txt');
const COOLDOWN_SECONDS = 5; // Cooldown time in seconds

const cooldowns = new Map(); // Map to track cooldowns

// Function to save the current number to a file
const saveCurrentNumber = (number) => {
  fs.writeFileSync(COUNT_FILE, number.toString(), 'utf8');
};

// Function to load the current number from the file
const loadCurrentNumber = () => {
  if (fs.existsSync(COUNT_FILE)) {
    const number = fs.readFileSync(COUNT_FILE, 'utf8');
    return parseInt(number, 10);
  } else {
    saveCurrentNumber(1); // Create the file with the initial value of 1
    return 1;
  }
};

let currentNumber = loadCurrentNumber();
let lastUser = null; // Variable to keep track of the last user

client.on('messageCreate', async message => {
  // Check if the message is in the correct channel and sent by a user, not a bot
  if (message.channel.id === CHANNEL_ID && !message.author.bot) {
    // Check if the message content is a number and only contains digits
    const number = parseInt(message.content.trim());

    if (!isNaN(number) && message.content.trim() === number.toString()) {
      const now = Date.now();
      const cooldownAmount = COOLDOWN_SECONDS * 1000;

      if (lastUser !== message.author.id) {
        // Reset cooldown for other users
        lastUser = message.author.id;
      } else if (cooldowns.has(message.author.id)) {
        const expirationTime = cooldowns.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
          const timeLeft = (expirationTime - now) / 1000;
          const embed = new EmbedBuilder()
            .setDescription(`Je moet nog ${timeLeft.toFixed(1)} seconden wachten voordat je opnieuw kunt tellen, ${message.author.tag}.`)
            .setColor('#FFFF00');
          await message.channel.send({ embeds: [embed] });
          return message.delete(); // Delete the message if user is on cooldown
        }
      }

      cooldowns.set(message.author.id, now);

      if (number === currentNumber) {
        await message.react('✅');
        currentNumber++;
        saveCurrentNumber(currentNumber);
      } else {
        await message.react('❌');
        currentNumber = 1;
        saveCurrentNumber(currentNumber);

        const embed = new EmbedBuilder()
          .setDescription(`${message.author.tag} heeft verkeerd geteld. We beginnen opnieuw vanaf 1.`)
          .setColor('#FF0000');

        await message.channel.send({ embeds: [embed] });
      }
    }
  }
});

client.login(token);