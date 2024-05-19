const { Client, GatewayIntentBits, Partials, EmbedBuilder } = require('discord.js');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates
  ],
  partials: [Partials.Channel]
});

let ayarlar = {
  "token": "",
  "botVoiceChannelID": "",
  "botOwnerID": "",
  "guildID": "",
  "logChannelID": ""
};

const resetChannels = async function(guildID, channelArray) {
  let guild = client.guilds.cache.get(guildID);
  channelArray.forEach(async channel => {
    let channel_old = guild.channels.cache.find(
      i => i.name == channel && i.type == 0 // 0 is for text channels
    );
    if (!channel_old) return;
    let channel_old_position = channel_old.position;
    let channel_new = await channel_old.clone();
    await channel_old.delete();
    await channel_new.setParent(channel_old.parentId);
    await channel_new.setPosition(channel_old_position);
    await channel_new.setTopic(`Bu kanal 15 dakikada bir sıfırlanmaktadır.
    ${client.users.cache.has(ayarlar.botOwner) ? client.users.cache.get(ayarlar.botOwner).tag : "Sharey"} was here!`);

    const embedMessage = new EmbedBuilder()
      .setColor('#5600df')
      .setTimestamp()
      .setTitle('Kanal Sıfırlandı')
      .setDescription('Bu kanal güvenlik nedeniyle sıfırlanmıştır.')
      .setFooter({ text: `${client.users.cache.has(ayarlar.botOwner) ? client.users.cache.get(ayarlar.botOwner).tag : "Sharey"} was here!` });

    await channel_new.send({ embeds: [embedMessage] });
  });
};

client.once('ready', () => {
  client.user.setPresence({ activities: [{ name: "Sharey ❤️" }], status: "idle" });
  let botVoiceChannel = client.channels.cache.get(ayarlar.botVoiceChannelID);
  if (botVoiceChannel) botVoiceChannel.join().catch(err => console.error("Bot ses kanalına bağlanamadı!"));
  console.log('_________________________________________');
  console.log(`Bot İsmi           : ${client.user.username}`);
  console.log(`Durum              : Bot Çevrimiçi!`);
  console.log('_________________________________________');

  const logEmbed = new EmbedBuilder()
    .setColor('#5600df')
    .setTimestamp()
    .setTitle('Kanallar Sıfırlandı.')
    .setDescription('Seçili kanalların tamamı sıfırlandı!')
    .setFooter({ text: `${client.users.cache.has(ayarlar.botOwner) ? client.users.cache.get(ayarlar.botOwner).tag : "Sharey"} was here!` });

  let kanallar = ["channel1", "channel2", "channel3"];
  setInterval(async () => {
    console.log('Kanallar başarıyla temizlendi.');
    resetChannels(ayarlar.guildID, kanallar);
    let channel = client.channels.cache.get(ayarlar.logChannelID);
    if (channel) channel.send({ embeds: [logEmbed] });
  }, 450000);

});

client.login(ayarlar.token);

//Sharey tarafından yapılmıştır!
