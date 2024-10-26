import path from "path";
import fs from "fs";
import { SupportLanguages } from "../utils.mjs";

for (const lang of SupportLanguages) {
  // 读取成就数据文件
  const rawAchievementData = JSON.parse(
    fs.readFileSync(
      path.join(
        import.meta.dirname,
        "../../Snap.Metadata-main/Genshin/" + lang + "/Achievement.json"
      ),
      "utf8"
    )
  );
  const rawAchievementGoalData = JSON.parse(
    fs.readFileSync(
      path.join(
        import.meta.dirname,
        "../../Snap.Metadata-main/Genshin/" + lang + "/AchievementGoal.json"
      ),
      "utf8"
    )
  );

  let outAchievementData = [];

  // 初始化成就目标数据
  for (let achievementGoal of rawAchievementGoalData) {
    outAchievementData[achievementGoal.Order] = {
      id: achievementGoal.Id,
      order: achievementGoal.Order,
      name: achievementGoal.Name,
      number: 0,
      achievements: [],
    };
  }

  // 处理成就数据
  // 遍历原始成就数据
  let groupCount = 0;
  let achievementCount = 0;
  let setOfVersion = new Set();
  for (let achievement in rawAchievementData) {
    // 查找目标成就索引
    const ref_achievementGoalIndex = outAchievementData.findIndex((item) => {
      if (item) {
        return item.id === rawAchievementData[achievement].Goal;
      }
    });
    // 获取原始成就数据
    const ref_rawAchievement = rawAchievementData[achievement];
    // 构建成就数据对象
    const data_achievement = {
      id: ref_rawAchievement.Id,
      name: ref_rawAchievement.Title,
      description: ref_rawAchievement.Description,
      progress: ref_rawAchievement.Progress,
      version: ref_rawAchievement.Version,
      rewards: ref_rawAchievement.FinishReward.Count,
    };
    // 处理成就数据
    if (achievement > 1) {
      const ref_achievements =
        outAchievementData[ref_achievementGoalIndex].achievements;
      if (
        rawAchievementData[achievement].Title ==
        rawAchievementData[achievement - 1].Title
      ) {
        ref_achievements[ref_achievements.length - 1].push(data_achievement);
      } else {
        ref_achievements.push([data_achievement]);
        groupCount++;
      }
    } else {
      outAchievementData[ref_achievementGoalIndex].achievements.push([
        data_achievement,
      ]);
      groupCount++;
    }
    outAchievementData[ref_achievementGoalIndex].number++;
    achievementCount++;
    setOfVersion.add(data_achievement.version);
  }

  outAchievementData = outAchievementData.filter((item) => {
    return item;
  });

  function sortVersions(versions) {
    return versions.sort((a, b) => {
      const aParts = a.split(".").map(Number);
      const bParts = b.split(".").map(Number);
      for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
        const aPart = aParts[i] || 0;
        const bPart = bParts[i] || 0;
        if (aPart < bPart) return -1;
        if (aPart > bPart) return 1;
      }
      return 0;
    });
  }

  fs.mkdirSync(path.join(import.meta.dirname, "../../dist/achievement/"),{recursive: true});
  fs.writeFileSync(
    path.join(import.meta.dirname, `../../dist/achievement/${lang}.json`),
    JSON.stringify(
      {
        numberOfGoal: outAchievementData.length,
        numberOfGroup: groupCount,
        numberOfAchievement: achievementCount,
        versions: ["ALL", ...sortVersions(Array.from(setOfVersion))],
        data: outAchievementData,
      },
      null,
      2
    ),
    "utf8"
  );
}
