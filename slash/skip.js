const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder().setName("skip").setDescription("Passa para a próxima música da fila"),
	run: async ({ client, interaction }) => {
		const queue = client.player.getQueue(interaction.guildId)

		if (!queue) return await interaction.editReply("Nenhuma música na fila")

        const currentSong = queue.current

		queue.skip()
        await interaction.editReply({
            embeds: [
                new EmbedBuilder().setDescription(`${currentSong.title} foi pulado!`).setThumbnail(currentSong.thumbnail)
            ]
        })
	},
}
