import { Client } from "@notionhq/client";

const databaseId = process.env.NOTION_DATABASE_ID ?? "";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

interface GetDatabaseParams {
  platform?: "surflog" | "techlog" | "all";
}

const blogUtils = {
  getAllPosts: async ({ platform = "all" }: GetDatabaseParams) => {
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
  },
  getPostDetailByPageId: async (pageId: string) => {
    const response = await notion.pages.retrieve({ page_id: pageId });
    return response;
  },
  getPostDetailBySlug: async (slug: string) => {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: "Slug",
        formula: {
          string: {
            equals: slug,
          },
        },
      },
    });
    if (response?.results?.length) {
      return response?.results?.[0];
    }
    return {};
  },
};

export default blogUtils;
