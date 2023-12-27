import { Client } from "@notionhq/client";

const databaseId = process.env.NOTION_DATABASE_ID ?? "";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

interface GetDatabaseParams {
  platform?: "surflog" | "techlog" | "all";
}

export const getDatabase = async ({ platform = "all" }: GetDatabaseParams) => {
  const platformFilter =
    platform === "all"
      ? undefined
      : {
          property: "platform",
          multi_select: {
            contains: platform,
          },
        };
  const response = await notion.databases.query({
    database_id: databaseId,
    sorts: [
      {
        timestamp: "created_time",
        direction: "descending",
      },
    ],
    filter: platformFilter,
  });
  return response.results;
};
