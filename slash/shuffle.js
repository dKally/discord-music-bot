const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder().setName("shuffle").setDescription("Embaralha a fila"),
	run: async ({ client, interaction }) => {
		const queue = client.player.getQueue(interaction.guildId)

		if (!queue) return await interaction.editReply("Nenhuma música na fila")

		queue.shuffle()
        await interaction.editReply(`As ${queue.tracks.length} músicas da fila foram embaralhadas!`)
	},
}
