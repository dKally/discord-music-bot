const Discord = require("discord.js")
const dotenv = require("dotenv")
const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v9")
const fs = require("fs")
const { Player } = require("discord-player")

dotenv.config()

const TOKEN = process.env.TOKEN

const LOAD_SLASH = process.argv[2] == "load"

const client = new Discord.Client({
    intents: [
        1 << 0,
        1 << 7

    ]
})



client.slashcommands = new Discord.Collection()
client.player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
})

let commands = []

const slashFiles = fs.readdirSync("./slash").filter(file => file.endsWith(".js"))
for (const file of slashFiles){
    const slashcmd = require(`./slash/${file}`)
    client.slashcommands.set(slashcmd.data.name, slashcmd)
    if (LOAD_SLASH) commands.push(slashcmd.data.toJSON())
}

client.on("ready", () => {
    console.log(`Rodando em ${client.user.tag}`)
})
client.on("interactionCreate", (interaction) => {
    async function handleCommand() {
        if (!interaction.isCommand()) return
        const slashcmd = client.slashcommands.get(interaction.commandName)
        if (!slashcmd) interaction.reply("Comando Slash inválido")
        await interaction.deferReply()
        await slashcmd.run({ client, interaction })
    }
    handleCommand()
})
client.login(TOKEN)


