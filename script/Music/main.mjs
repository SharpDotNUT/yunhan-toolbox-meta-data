import fs from "fs";
import path from "path";
import { addInSourceMap } from "../utils.mjs";
const __dirname = import.meta.dirname;
// 定义API主机地址
const apiHost = "http://localhost:3000";

async function getAlbum() {
  const response = await fetch(
    apiHost + "/artist/album?id=12487174&limit=1000"
  );
  const data = await response.json();
  fs.writeFileSync(
    path.join(__dirname, "./data/album_raw.json"),
    JSON.stringify(data, null, 2)
  );
  let albumsList = [];
  for (let album of data.hotAlbums) {
    albumsList.push({
      name: album.name,
      id: album.id,
      alias: album.alias,
      picUrl: album.picUrl,
    });
  }
  fs.writeFileSync(
    path.join(__dirname, "./data/album.json"),
    JSON.stringify(albumsList, null, 2),
    (err) => {
      if (err) throw err;
    }
  );
  for (let album of albumsList) {
    const response = await fetch(apiHost + "/album/?limit=1000&id=" + album.id);
    const data = await response.json();
    console.log(`  正在写入专辑 ${album.id} - ${album.name} 的数据`);
    fs.mkdirSync(path.join(__dirname, "./data/album"), { recursive: true });
    fs.writeFileSync(
      path.join(__dirname, "data", "album", album.id + ".json"),
      JSON.stringify(data, null, 2)
    );
  }
}

async function songs() {
  let albumIndex = 0,
    songIndex = 0;
  let songs = [];
  let rawDataInfo = JSON.parse(
    fs.readFileSync(path.join(__dirname, "./data/album.json"), "utf-8")
  );
  rawDataInfo.forEach((album) => {
    songs.push({
      name: album.name,
      id: album.id,
      alias: album.alias,
      picUrl:album.picUrl,
      songs: [],
    });
    let rawAlbum = fs.readFileSync(
      path.join(__dirname, "data", "album", album.id + ".json"),
      "utf-8"
    );
    rawAlbum = JSON.parse(rawAlbum);
    songIndex = 0;
    // console.log(album.id)
    rawAlbum.songs.forEach((song) => {
      songs[albumIndex].songs.push({
        name: song.name,
        id: song.id,
        alias:song.alia,
        artist:song.ar
        // url:'https://music.163.com/song/media/outer/url?id='+song.id+'.mp3'
      });
      songIndex++;
    });

    albumIndex++;
  });
  fs.writeFileSync(
    path.join(__dirname, "./data/songs.json"),
    JSON.stringify(
      {
        update: new Date().getTime(),
        data: songs,
      },
      null,
      2
    )
  );
}



fs.mkdirSync(path.join(__dirname, "data"), { recursive: true });
// console.log(`Music - 开始`);
// await getAlbum();
console.log(`Music - 专辑信息获取已完成`);
await songs();
console.log(`Music - 基础信息已完成`);

console.log(`Music - 基础信息已完成`);
