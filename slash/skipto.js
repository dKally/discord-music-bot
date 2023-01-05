const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder().setName("skipto").setDescription("Passa uma música específica da fila #")
    .addNumberOption((option) => 
        option.setName("tracknumber").setDescription("A faixa pula para").setMinValue(1).setRequired(true)),
	run: async ({ client, interaction }) => {
		const queue = client.player.getQueue(interaction.guildId)

		if (!queue) return await interaction.editReply("There are no songs in the queue")

        const trackNum = interaction.options.getNumber("tracknumber")
        if (trackNum > queue.tracks.length)
            return await interaction.editReply("Faixa inválida")
		queue.skipTo(trackNum - 1)

        await interaction.editReply(`Música pulada para a faixa de número ${trackNum}`)
	},
}
