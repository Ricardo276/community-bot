const fs = require('fs');
const { Client, Collection, GatewayIntentBits, REST, Routes, ActivityType } = require('discord.js');
const { token, clientId, guildId, defaultPrefix } = require('./config.json');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

client.commands = new Collection();
client.prefixCommands = new Collection();
client.events = new Collection();

const loadCommands = (dir, collection) => {
  const commandFiles = fs.readdirSync(dir).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(`${dir}/${file}`);
    collection.set(command.name, command);
    console.log(`Loaded command: ${command.name}`);
  }
};

const loadEvents = (dir, collection) => {
  const eventFiles = fs.readdirSync(dir).filter(file => file.endsWith('.js'));
  for (const file of eventFiles) {
    const event = require(`${dir}/${file}`);
    collection.set(event.name, event);
    if (event.once) {
      client.once(event.name, (...args) => event.execute(client, ...args));
    } else {
      client.on(event.name, (...args) => event.execute(client, ...args));
    }
    console.log(`Loaded event: ${event.name}`);
  }
};

// add more folders here in the same way as below to put the command in the separate folder in your folder
loadCommands('./commands', client.commands);
loadCommands('./commands/defaultbotcommands', client.commands);
loadCommands('./commands/moderate', client.commands);
loadCommands('./commands/overig', client.commands);

// add more folders here in the same way as below to put the prefix commands in the separate folder in your folder
loadCommands('./prefixes', client.prefixCommands);

// add more folders here in the same way as below to put the event in the separate folder in your folder
loadEvents('./events', client.events);
loadEvents('./events/welcomer', client.events);
loadEvents('./events/counting', client.events);

const registerSlashCommands = async () => {
  const commands = [];
  client.commands.forEach(command => {
    if (command.data) {
      commands.push(command.data.toJSON());
    }
  });

  const rest = new REST({ version: '10' }).setToken(token);

  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
};

// Event listeners for member count updates
client.on('guildMemberAdd', member => {
  updateActivity(member.guild);
});

client.on('guildMemberRemove', member => {
  updateActivity(member.guild);
});

client.on('guildBanAdd', (ban) => {
  updateActivity(ban.guild);
});

// Event listener for kicking a member
client.on('guildMemberRemove', member => {
  if (member.kickable) {
    updateActivity(member.guild);
  }
});

// Function to update the activity
const updateActivity = (guild) => {
  const memberCount = guild.memberCount;
  client.user.setActivity(`${memberCount} Members`, { type: ActivityType.Watching });
};

client.once('ready', () => {
  const guild = client.guilds.cache.first(); // Assuming the bot is in one server
  if (guild) {
    updateActivity(guild); // Initialize status on startup
  }

  console.log(`Logged in as ${client.user.tag} and ready to use!`);
  registerSlashCommands(); // Ensure slash commands are registered on startup
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  const prefixes = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
  const prefix = prefixes.prefix || defaultPrefix;

  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (!client.prefixCommands.has(commandName)) return;

  const command = client.prefixCommands.get(commandName);

  try {
    await command.run(message, args);
  } catch (error) {
    console.error(error);
    message.reply('There was an error trying to execute that command!');
  }
});

// Event to update bot status before shutting down
client.once('disconnect', async () => {
  console.log('Bot is shutting down...');
  await client.user.setStatus('invisible'); // Set status to 'offline'
  process.exit(0); // Shut down the bot
});

client.login(token);
