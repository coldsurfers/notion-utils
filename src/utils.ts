import { Client } from "@notionhq/client";

const databaseId = process.env.NOTION_DATABASE_ID ?? "";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

interface GetDatabaseParams {
  platform: "surflog" | "techlog";
}

export const getDatabase = async (params: GetDatabaseParams) => {
  const response = await notion.databases.query({
    database_id: databaseId,
    sorts: [
      {
        timestamp: "created_time",
        direction: "descending",
      },
    ],
    filter: {
      property: "platform",
      multi_select: {
        contains: params.platform,
      },
    },
  });
  return response.results;
};
