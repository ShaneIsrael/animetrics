const Anilist = require('anilist-node')
const aniClient = new Anilist()

//create animetrics anilist app 

async function test() {
  const resp = await aniClient.media.anime(101350)
  console.log(resp.coverImage.large)
}
test()