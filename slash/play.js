const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")
const { QueryType } = require("discord-player")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("Carrega uma música do YouTube")
		.addSubcommand((subcommand) =>
			subcommand
				.setName("song")
				.setDescription("Carrega um música por URL")
				.addStringOption((option) => option.setName("url").setDescription("URL da música").setRequired(true))
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("playlist")
				.setDescription("Carrega uma playlist por URL")
				.addStringOption((option) => option.setName("url").setDescription("URL da playlist").setRequired(true))
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("search")
				.setDescription("Pesquisa e toca uma música baseado no que você escreveu")
				.addStringOption((option) =>
					option.setName("searchterms").setDescription("Digite o nome da música").setRequired(true)
				)
		),
	run: async ({ client, interaction }) => {
		if (!interaction.member.voice.channel) return interaction.editReply("Você precisa estar em um canal de voz para usar esse comando")

		const queue = await client.player.createQueue(interaction.guild)
		if (!queue.connection) await queue.connect(interaction.member.voice.channel)

		let embed = new EmbedBuilder()

		if (interaction.options.getSubcommand() === "song") {
            let url = interaction.options.getString("url")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_VIDEO
            })
            if (result.tracks.length === 0)
                return interaction.editReply("Nenhuma música encontrada")
            
            const song = result.tracks[0]
            await queue.addTrack(song)
            embed
                .setDescription(`**[${song.title}](${song.url})** foi adicionada a fila!`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duração: ${song.duration}`})

		} else if (interaction.options.getSubcommand() === "playlist") {
            let url = interaction.options.getString("url")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_PLAYLIST
            })

            if (result.tracks.length === 0)
                return interaction.editReply("Nenhuma playlist encontrada")
            
            const playlist = result.playlist
            
            await queue.addTracks(result.tracks)
            embed
                .setDescription(`**${result.tracks.length} músicas da playlist [${playlist.title}](${playlist.url})** foram adicionadas a fila`)
                // .setThumbnail(playlist.thumbnail)
		} else if (interaction.options.getSubcommand() === "search") {
            let url = interaction.options.getString("searchterms")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            })

            if (result.tracks.length === 0)
                return interaction.editReply("Nenhuma música encontrada")
            
            const song = result.tracks[0]
            await queue.addTrack(song)
            embed
                .setDescription(`**[${song.title}](${song.url})** foi adicionada a fila`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duração: ${song.duration}`})
		}
        if (!queue.playing) await queue.play()
        await interaction.editReply({
            embeds: [embed]
        })
	},
}
