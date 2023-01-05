const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription("Despausa a música"),
    run: async ({client, interaction})=>{
        const queue = client.player.getQueue(interaction.guildId)

        if(!queue)
            return await interaction.editReply('Nenhuma música na fila')

            queue.setPaused(false)
        await interaction.editReply("A música foi despausada!")
    }
}
