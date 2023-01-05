const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Mostra as músicas que estão na fila")
    .addNumberOption((option) => option.setName("page").setDescription("Número de páginas da fila").setMinValue(1)),

    run: async ({ client, interaction }) => {
        const queue = client.player.getQueue(interaction.guildId)
        if (!queue || !queue.playing){
            return await interaction.editReply("Nenhuma música na fila")
        }

        const totalPages = Math.ceil(queue.tracks.length / 10) || 1
        const page = (interaction.options.getNumber("page") || 1) - 1

        if (page + 1 > totalPages) 
            return await interaction.editReply(`Página invalida. Só existem ${totalPages} páginas na fila`)
        
        const queueString = queue.tracks.slice(page * 10, page * 10 + 10).map((song, i) => {
            return `**${page * 10 + i + 1}.** \`[${song.duration}]\` ${song.title} -- <@${song.requestedBy.id}>`
        }).join("\n")

        const currentSong = queue.current

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`**Tocando Agora**\n` + 
                    (currentSong ? `\`[${currentSong.duration}]\` ${currentSong.title} -- <@${currentSong.requestedBy.id}>` : "None") +
                    `\n\n**Queue**\n${queueString}`
                    )
                    .setFooter({
                        text: `Página ${page + 1} de ${totalPages}`
                    })
                    .setThumbnail(currentSong.setThumbnail)
            ]
        })
    }
}
