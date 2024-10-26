import fs from "fs";
import path from "path";

const __dirname = import.meta.dirname;
const _log = console.log;

// Part 1

const characters = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "../Snap.Metadata/Genshin/CHS/Avatar.json")
  )
);
let raw = JSON.parse(
  fs.readFileSync(path.join(__dirname, "./tags-raw.json"), "utf8")
);
let map = {};
const bodyMap = {
  1: "少男",
  2: "少女",
  3: "成男",
  4: "成女",
  5: "萝莉",
};
const weaponMap = {
    "1":"单手剑",
    "10":"法器",
    "11":"双手剑",
    "12":"弓箭",
    "13":"长柄武器"
}
const map_items = ["Body", "Weapon"];
characters.forEach((character) => {
  if (!raw?.[character.Name]) {
    raw[character.Name] = {
      rawTagString: "",
    };
  }
  raw[character.Name].id = character.Id;
  raw[character.Name].cv = [
    character.FetterInfo.CvChinese,
    character.FetterInfo.CvJapanese,
    character.FetterInfo.CvEnglish,
    character.FetterInfo.CvKorean,
  ];
  raw[character.Name].body = bodyMap[character.Body];
  raw[character.Name].weapon = weaponMap[character.Weapon];
  raw[character.Name].vision = character.FetterInfo.VisionBefore;
  raw[character.Name].description = character.Description;
  raw[character.Name].icon = `https://homdgcat.wiki/homdgcat-res/Avatar/${character.Icon}.png`

  for (const map_item of map_items) {
    if (!map?.[map_item]) {
      map[map_item] = {};
    }
    if (map[map_item]?.[character[map_item]]) {
      map[map_item][character[map_item]].push(character.Name);
    } else {
      map[map_item][character[map_item]] = [character.Name];
    }
  }
});

fs.writeFileSync(
  path.join(__dirname, "./map.json"),
  JSON.stringify(map, null, 2),
  "utf8"
);

// Part 2

for (let characterKeys of Object.keys(raw)) {
  const regex = /\[.*?\]/g;
  _log(characterKeys);
  const rawTagString = raw[characterKeys].rawTagString;
  let tags = rawTagString.replace(regex, "").split("、");
  raw[characterKeys].tags = tags;
}

fs.writeFileSync(
  path.join(__dirname, "./tags-raw.json"),
  JSON.stringify(raw, null, 2),
  "utf8"
);
let as_array = []
for (let characterKeys of Object.keys(raw)) {
  delete raw[characterKeys].rawTagString;
  as_array.push({
    name: characterKeys,
    ...raw[characterKeys],
  })
}
fs.writeFileSync(
  path.join(__dirname, "./tags.json"),
  JSON.stringify(as_array,null, 2),
  "utf8"
);