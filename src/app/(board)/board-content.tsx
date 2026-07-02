"use client"

import { ArchiveIcon, MessageCircleIcon } from "lucide-react"
import { Section } from "@/components/section"
import { Card } from "@/components/card"
import { Button } from "@/components/button"
import type z from "zod"
import type { IssuesListResponseSchema } from "@/api/routes/list-issues"
import { useQuery } from "@tanstack/react-query"
import { getIssueInteractions } from "@/http/get-issue-interactions"
import { useMemo } from "react"
import { LikeButton } from "@/components/like-button"

interface BoardContentProps {
  issues: z.infer<typeof IssuesListResponseSchema>
}

export function BoardContent({ issues }: BoardContentProps) {
  const allIssuesIds = [
    ...issues.backlog.map((issue) => issue.id),
    ...issues.todo.map((issue) => issue.id),
    ...issues.in_progress.map((issue) => issue.id),
    ...issues.done.map((issue) => issue.id),
  ]

  const { data: interactionsData, isLoading: isLoadingInteractions } = useQuery(
    {
      queryKey: ["issue-likes", allIssuesIds.sort().join(",")],
      queryFn: () => getIssueInteractions({ issueIds: allIssuesIds }),
    },
  )

  const interactions = useMemo(() => {
    if (!interactionsData) {
      return new Map<string, { isLiked: boolean; likesCount: number }>()
    }

    return new Map<string, { isLiked: boolean; likesCount: number }>(
      interactionsData.interactions.map((interaction) => [
        interaction.issueId,
        {
          isLiked: interaction.isLiked,
          likesCount: interaction.likesCount,
        },
      ]),
    )
  }, [interactionsData])

  return (
    <main className="grid grid-cols-4 gap-5 flex-1 items-stretch">
      <Section.Root>
        <Section.Header>
          <Section.Title>
            <ArchiveIcon className="size-3" />
            Backlog
          </Section.Title>

          <Section.IssueCount>{issues.backlog.length}</Section.IssueCount>
        </Section.Header>

        {/* Content */}
        <Section.Content>
          {issues.backlog.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-center">
              <p className="text-sm text-navy-300">
                No issues matching your filters
              </p>
            </div>
          ) : (
            issues.backlog.map((issue) => {
              const interaction = interactions.get(issue.id)

              return (
                <Card.Root href={`/issues/${issue.id}`} key={issue.id}>
                  <Card.Header>
                    <Card.Number>ISS-{issue.issueNumber}</Card.Number>
                    <Card.Title>{issue.title}</Card.Title>
                  </Card.Header>
                  <Card.Footer>
                    <LikeButton
                      issueId={issue.id}
                      initialLikes={interaction?.likesCount ?? 0}
                      initialLiked={interaction?.isLiked ?? false}
                    />

                    <Button>
                      <MessageCircleIcon className="size-3" />
                      <span className="text-sm">{issue.comments}</span>
                    </Button>
                  </Card.Footer>
                </Card.Root>
              )
            })
          )}
        </Section.Content>
      </Section.Root>

      <Section.Root>
        <Section.Header>
          <Section.Title>
            <ArchiveIcon className="size-3" />
            To-do
          </Section.Title>

          <Section.IssueCount>{issues.todo.length}</Section.IssueCount>
        </Section.Header>

        {/* Content */}
        <Section.Content>
          {issues.todo.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-center">
              <p className="text-sm text-navy-300">
                No issues matching your filters
              </p>
            </div>
          ) : (
            issues.todo.map((issue) => {
              const interaction = interactions.get(issue.id)

              return (
                <Card.Root href={`/issues/${issue.id}`} key={issue.id}>
                  <Card.Header>
                    <Card.Number>ISS-{issue.issueNumber}</Card.Number>
                    <Card.Title>{issue.title}</Card.Title>
                  </Card.Header>
                  <Card.Footer>
                    <LikeButton
                      issueId={issue.id}
                      initialLikes={interaction?.likesCount ?? 0}
                      initialLiked={interaction?.isLiked ?? false}
                    />

                    <Button>
                      <MessageCircleIcon className="size-3" />
                      <span className="text-sm">{issue.comments}</span>
                    </Button>
                  </Card.Footer>
                </Card.Root>
              )
            })
          )}
        </Section.Content>
      </Section.Root>

      <Section.Root>
        <Section.Header>
          <Section.Title>
            <ArchiveIcon className="size-3" />
            In progress
          </Section.Title>

          <Section.IssueCount>{issues.in_progress.length}</Section.IssueCount>
        </Section.Header>

        {/* Content */}
        <Section.Content>
          {issues.in_progress.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-center">
              <p className="text-sm text-navy-300">
                No issues matching your filters
              </p>
            </div>
          ) : (
            issues.in_progress.map((issue) => {
              const interaction = interactions.get(issue.id)
              return (
                <Card.Root href={`/issues/${issue.id}`} key={issue.id}>
                  <Card.Header>
                    <Card.Number>ISS-{issue.issueNumber}</Card.Number>
                    <Card.Title>{issue.title}</Card.Title>
                  </Card.Header>
                  <Card.Footer>
                    <LikeButton
                      issueId={issue.id}
                      initialLikes={interaction?.likesCount ?? 0}
                      initialLiked={interaction?.isLiked ?? false}
                    />

                    <Button>
                      <MessageCircleIcon className="size-3" />
                      <span className="text-sm">{issue.comments}</span>
                    </Button>
                  </Card.Footer>
                </Card.Root>
              )
            })
          )}
        </Section.Content>
      </Section.Root>

      <Section.Root>
        <Section.Header>
          <Section.Title>
            <ArchiveIcon className="size-3" />
            Done
          </Section.Title>

          <Section.IssueCount>{issues.done.length}</Section.IssueCount>
        </Section.Header>

        {/* Content */}
        <Section.Content>
          {issues.done.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-center">
              <p className="text-sm text-navy-300">
                No issues matching your filters
              </p>
            </div>
          ) : (
            issues.done.map((issue) => {
              const interaction = interactions.get(issue.id)

              return (
                <Card.Root href={`/issues/${issue.id}`} key={issue.id}>
                  <Card.Header>
                    <Card.Number>ISS-{issue.issueNumber}</Card.Number>
                    <Card.Title>{issue.title}</Card.Title>
                  </Card.Header>
                  <Card.Footer>
                    <LikeButton
                      issueId={issue.id}
                      initialLikes={interaction?.likesCount ?? 0}
                      initialLiked={interaction?.isLiked ?? false}
                    />

                    <Button>
                      <MessageCircleIcon className="size-3" />
                      <span className="text-sm">{issue.comments}</span>
                    </Button>
                  </Card.Footer>
                </Card.Root>
              )
            })
          )}
        </Section.Content>
      </Section.Root>
    </main>
  )
}