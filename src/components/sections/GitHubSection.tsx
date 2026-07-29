"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiGithub, FiStar, FiUsers, FiBox } from "react-icons/fi";
import { GITHUB_USERNAME } from "@/lib/github";

interface GithubUser {
  public_repos: number;
  followers: number;
  html_url: string;
}

interface GithubRepo {
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
}

export default function GitHubSection() {
  const [user, setUser] = useState<GithubUser | null>(null);
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [userRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${GITHUB_USERNAME}`),
          fetch(
            `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`
          ),
        ]);
        if (!userRes.ok || !reposRes.ok) throw new Error("GitHub fetch failed");
        const userData = await userRes.json();
        const reposData = await reposRes.json();
        if (cancelled) return;
        setUser(userData);
        setRepos(Array.isArray(reposData) ? reposData : []);
      } catch {
        if (!cancelled) setError(true);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const languageCounts = repos.reduce<Record<string, number>>((acc, repo) => {
    if (repo.language) acc[repo.language] = (acc[repo.language] ?? 0) + 1;
    return acc;
  }, {});
  const topLanguages = Object.entries(languageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const maxLangCount = topLanguages[0]?.[1] ?? 1;

  const topRepos = [...repos]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 4);

  return (
    <section
      id="github"
      className="relative w-full bg-background px-6 py-28 sm:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-5xl">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
          className="font-display text-4xl font-semibold text-text-primary sm:text-5xl"
        >
          GitHub
        </motion.h2>

        {error && (
          <p className="mt-6 text-sm text-text-secondary">
            Couldn&apos;t load live GitHub stats for &quot;{GITHUB_USERNAME}
            &quot; — update{" "}
            <code className="mx-1 rounded bg-surface px-1.5 py-0.5">
              GITHUB_USERNAME
            </code>{" "}
            in{" "}
            <code className="rounded bg-surface px-1.5 py-0.5">
              src/lib/github.ts
            </code>
            .
          </p>
        )}

        {user && (
          <>
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <StatTile
                icon={<FiBox />}
                label="Public repos"
                value={user.public_repos}
              />
              <StatTile
                icon={<FiUsers />}
                label="Followers"
                value={user.followers}
              />
              <StatTile
                icon={<FiStar />}
                label="Total stars"
                value={repos.reduce((sum, r) => sum + r.stargazers_count, 0)}
              />
            </div>

            <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium uppercase tracking-widest text-text-secondary">
                  Language breakdown
                </h3>
                <div className="mt-4 flex flex-col gap-3">
                  {topLanguages.map(([lang, count]) => (
                    <div key={lang}>
                      <div className="mb-1 flex justify-between text-xs text-text-secondary">
                        <span>{lang}</span>
                        <span>{count}</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
                        <motion.div
                          className="h-full bg-accent"
                          initial={{ width: 0 }}
                          whileInView={{
                            width: `${(count / maxLangCount) * 100}%`,
                          }}
                          viewport={{ once: true, amount: 0.6 }}
                          transition={{ duration: 0.7, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium uppercase tracking-widest text-text-secondary">
                  Repo highlights
                </h3>
                <div className="mt-4 flex flex-col gap-3">
                  {topRepos.map((repo, i) => (
                    <motion.a
                      key={repo.name}
                      href={repo.html_url}
                      data-cursor-hover
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{ duration: 0.4, delay: i * 0.08 }}
                      className="block rounded-xl border border-border bg-surface px-4 py-3 hover:border-accent/40"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-text-primary">
                          {repo.name}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-text-secondary">
                          <FiStar /> {repo.stargazers_count}
                        </span>
                      </div>
                      {repo.description && (
                        <p className="mt-1 text-xs text-text-secondary">
                          {repo.description}
                        </p>
                      )}
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>

            <motion.div
              className="mt-12 overflow-hidden rounded-xl border border-border"
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5 }}
            >
              {/* External generated chart image — not a next/image-optimizable asset */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://ghchart.rshah.org/D62839/${GITHUB_USERNAME}`}
                alt={`${GITHUB_USERNAME}'s GitHub contribution graph`}
                className="w-full"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            </motion.div>

            <a
              href={user.html_url}
              data-cursor-hover
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-text-primary hover:text-accent"
            >
              <FiGithub /> View full profile
            </a>
          </>
        )}
      </div>
    </section>
  );
}

function StatTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.4 }}
      className="rounded-xl border border-border bg-surface p-4"
    >
      <div className="flex items-center gap-2 text-text-secondary">
        {icon}
        <span className="text-xs uppercase tracking-widest">{label}</span>
      </div>
      <p className="mt-2 font-display text-2xl text-text-primary">{value}</p>
    </motion.div>
  );
}
