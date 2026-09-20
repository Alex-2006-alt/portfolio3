export interface GithubRepo {
  name: string;
  description: string | null;
  html_url: string;
  updated_at: string;
  fork: boolean;
}

export async function getGithubProjects(githubUrl: string) {
  try {
    if (!githubUrl) return [];

    // Extract username from URL (e.g. https://github.com/username)
    const username = githubUrl.split("/").pop();
    if (!username) return [];

    // Fetch repos sorted by updated date
    const res = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&direction=desc&per_page=100`,
      {
        next: { revalidate: 3600 }, // Cache for 1 hour to avoid rate limits
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    if (!res.ok) {
      console.error("Failed to fetch GitHub repos:", await res.text());
      return [];
    }

    const repos: GithubRepo[] = await res.json();

    // Filter out forks (shows all non-fork public repos)
    const validRepos = repos.filter((repo) => !repo.fork);

    // Map to expected format
    return validRepos.map((repo) => ({
      title: repo.name,
      description: repo.description || "No description provided.",
      link: repo.html_url,
      imageUrl: null, // Will be overridden if matched in DB
      order: 0,
      isGithubLive: true,
    }));
  } catch (error) {
    console.error("Error fetching GitHub projects:", error);
    return [];
  }
}
