
const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder().setName("info").setDescription("Mostra informações sobre a música tocando"),
	run: async ({ client, interaction }) => {
		const queue = client.player.getQueue(interaction.guildId)

		if (!queue) return await interaction.editReply("Nenhuma música na fila")

		let bar = queue.createProgressBar({
			queue: false,
			length: 19,
		})

        const song = queue.current

		await interaction.editReply({
			embeds: [new EmbedBuilder()
            .setThumbnail(song.thumbnail)
            .setDescription(`Tocando agora [${song.title}](${song.url})\n\n` + bar)
        ],
		})
	},
}
