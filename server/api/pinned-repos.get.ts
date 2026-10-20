const query = `
  query {
    user(login: "OxiiLB") {
      pinnedItems(first: 6, types: REPOSITORY) {
        nodes {
          ... on Repository {
            name
            description
            url
            stargazerCount
            forkCount
            primaryLanguage {
              name
              color
            }
          }
        }
      }
    }
  }
`;

export default defineEventHandler(async () => {
  const { githubToken } = useRuntimeConfig();

  const res = await $fetch<{ data: unknown }>("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${githubToken}`,
      "User-Agent": "portfolio",
    },
    body: { query },
  });

  return res.data;
});
