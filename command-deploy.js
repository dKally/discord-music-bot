const { REST, Routes } = require('discord.js');
const { clientId, token } = require('./config.json');
const fs = require('node:fs');

const commands = [];
const commandFiles = fs.readdirSync('./slash').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./slash/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
	try {
		console.log(`Começando a carregar ${commands.length} comandos em slash (/).`);

		const data = await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);

		console.log(`Carregado com sucesso ${data.length} comandos em slash(/)`);
	} catch (error) {

		console.error(error);
	}
})();