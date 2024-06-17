import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { copyFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import Database from "better-sqlite3";

import { formatDate, getWeekRange } from "./utils.js";

const src = join(
  homedir(),
  "./Library/Group Containers/JLMPQHK86H.com.culturedcode.ThingsMac/ThingsData-8SSNY/Things Database.thingsdatabase/main.sqlite"
);

const target = join(dirname(fileURLToPath(import.meta.url)), "main.sqlite");

await copyFile(src, target);

const db = new Database(target);

const [startDateTime, endDateTime] = getWeekRange();

const rows = db
  .prepare(
    `
    SELECT TMTask.title, TMTask.project, TMTask.stopDate, Project.title as projectTitle
    FROM TMTask
    LEFT JOIN TMTask AS Project ON TMTask.project = Project.uuid
    WHERE TMTask.stopDate >= $startDateTime AND TMTask.stopDate <= $endDateTime
    ORDER BY CASE WHEN TMTask.project is null THEN 1 ELSE 2 END DESC, TMTask.stopDate DESC;
    `
  )
  .all({
    startDateTime: Number(startDateTime) / 1000,
    endDateTime: Number(endDateTime) / 1000,
  });

const result = rows.reduce(
  (acc, row) => {
    const { map, list } = acc;
    const { project } = row;
    if (!map[project]) {
      map[project] = { title: row.projectTitle, tasks: [] };
      list.push(project);
    }
    map[project].tasks.push(row);
    return { map, list };
  },
  { map: {}, list: [] }
);

const rendered = result.list
  .map(project => {
    const data = result.map[project];

    return [
      `# ${data.title || "无"}`,
      data.tasks
        .map(
          row => `- ${row.title} @${formatDate(new Date(row.stopDate * 1000))}`
        )
        .join("\n"),
    ].join("\n\n");
  })
  .join("\n\n");

console.log(rendered);
