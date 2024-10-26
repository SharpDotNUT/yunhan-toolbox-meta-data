
import fs from "fs";
import path from "path";

// 定义API主机地址
const apiHost = "http://localhost:3000";

// 获取原始数据
async function getRawData() {
  // 发送请求获取专辑数据
  const response = await fetch(apiHost + "/artist/album?id=12487174&limit=1000");
  // 解析返回的数据
  const data = await response.json();
  // 将专辑数据赋值给allAlbumsList
  let rawAllAlbumsList = data.hotAlbums;
  let allAlbumsList = [];
  // 遍历专辑数据
  for (let album of rawAllAlbumsList) {
    // 将专辑数据添加到allAlbumsList
    allAlbumsList.push({
      name: album.name,
      id: album.id,
    });
  }
  // 将专辑数据写入文件
  fs.writeFile(
    path.join(__dirname, "albums.json"),
    JSON.stringify(allAlbumsList, null, 2),
    (err) => {
      if (err) throw err;
    }
  );

  // 创建data文件夹
  fs.mkdirSync(path.join(__dirname, "data"), { recursive: true });

  // 遍历所有专辑列表
  for (let album of allAlbumsList) {
    // 发送请求获取专辑详情
    const response = await fetch(
      apiHost + "/album/?limit=1000&id=" + album.id
    );
    // 解析返回的数据
    const data = await response.json();

    let songsDate = []

    for (let song of data.songs) {
      songsDate.push({
        name: song.name,
        id: song.id,
      })
    }
    // 将专辑详情写入文件
    fs.writeFileSync(
      path.join(__dirname, "data", album.id + ".json"),
      JSON.stringify({
        name:data.album.name,
        id:data.album.id,
        songs:songsDate,
      }, null, 2)
    )
  }
}

// 下一步处理
async function nextReduce() {

  // 定义专辑和歌曲索引
  let albumIndex = 0,
    songIndex = 0;
  // 定义歌曲列表
  let songs = [];

  // 定义日志输出函数
  const _log = function (...data) {
    console.log(data.join(" ") + "\n");
  };
  // 调用获取原始数据函数
  await getRawData();
  // 读取原始数据文件
  let rawDataInfo = JSON.parse(fs.readFileSync(
    path.join(__dirname, "albums.json"),
    "utf-8"
  ))
  // 遍历原始数据
  rawDataInfo.forEach((album) => {
    // 将专辑信息添加到歌曲列表
    songs.push({
      name: album.name,
      id: album.id,
      songs: [],
    });

    let rawAlbum = fs.readFileSync(
      path.join(__dirname, "data", album.id + ".json"),
      "utf-8"
    );
    rawAlbum = JSON.parse(rawAlbum);

    songIndex = 0;
    rawAlbum.songs.forEach((song) => {
      songs[albumIndex].songs.push({
        name: song.name,
        id: song.id,
      });
      songIndex++;
    });

    albumIndex++;
  });
  fs.mkdirSync(path.join(__dirname, "../../dist/musics"), { recursive: true });
  fs.writeFileSync(
    path.join(__dirname, "../../dist/musics/songs.json"),
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

getRawData();
nextReduce();

export default ()=>{
  getRawData()
  nextReduce()
}
