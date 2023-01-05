const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder().setName("pause").setDescription("Pausa a música"),
	run: async ({ client, interaction }) => {
		const queue = client.player.getQueue(interaction.guildId)

		if (!queue) return await interaction.editReply("Nenhuma música na fila")

		queue.setPaused(true)
        await interaction.editReply("A música foi pausada! Use /resume para retornar.")
	},
}
