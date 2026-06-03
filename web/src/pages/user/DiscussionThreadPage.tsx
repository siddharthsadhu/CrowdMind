import { useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { StitchPage } from '@/components/StitchPage'
import { bodyHtml, pageStyles } from '@/stitch-content/08-thread'
import { commonUserNav } from '@/data/navMaps'
import { discussionsApi } from '@/services/api/discussions'
import { repliesApi } from '@/services/api/replies'
import { usersApi, UserResponse } from '@/services/api/users'
import { votesApi } from '@/services/api/votes'

export default function DiscussionThreadPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const timer = setTimeout(() => {
      if (!id) return
      const root = document.querySelector('.stitch-page-root')
      if (!root) return

      const loadThreadData = async () => {
        try {
          const disc = await discussionsApi.getById(id)
          document.title = `CrowdMind | ${disc.title}`

          const titleEl = root.querySelector('h1')
          const catEl = root.querySelector('.bg-secondary-container\\/10')
          const viewsEl = root.querySelector('.flex.items-center.gap-1.font-label-md span + span')
          const authorEl = root.querySelector('.font-label-md.text-label-md.text-on-surface-variant')

          if (titleEl) titleEl.textContent = disc.title
          if (catEl) catEl.textContent = disc.status ?? 'General'
          if (viewsEl && viewsEl.parentElement) {
            viewsEl.parentElement.innerHTML = `<span class="material-symbols-outlined text-[18px]">visibility</span> ${disc.view_count} views`
          }
          if (authorEl) authorEl.textContent = disc.created_by?.slice(0, 8) ?? 'Anonymous'

          // Check if AI draft card should be visible
          const aiDraftCard = root.querySelector('section.border-l-primary') as HTMLElement | null
          if (aiDraftCard) {
            if (disc.question_id) {
              aiDraftCard.style.display = 'block'
              const aiHelpfulBtn = aiDraftCard.querySelector('button:first-of-type')
              const aiNotHelpfulBtn = aiDraftCard.querySelector('button:last-of-type')
              if (aiHelpfulBtn && !aiHelpfulBtn.getAttribute('data-wired')) {
                aiHelpfulBtn.setAttribute('data-wired', 'true')
                aiHelpfulBtn.addEventListener('click', () => {
                  aiHelpfulBtn.classList.toggle('text-primary')
                  aiNotHelpfulBtn?.classList.remove('text-error')
                })
              }
              if (aiNotHelpfulBtn && !aiNotHelpfulBtn.getAttribute('data-wired')) {
                aiNotHelpfulBtn.setAttribute('data-wired', 'true')
                aiNotHelpfulBtn.addEventListener('click', () => {
                  aiNotHelpfulBtn.classList.toggle('text-error')
                  aiHelpfulBtn?.classList.remove('text-primary')
                })
              }
            } else {
              aiDraftCard.style.display = 'none'
            }
          }

          const replies = await repliesApi.listByDiscussion(id)
          const replyFeed = root.querySelector('.md\\:col-span-8.space-y-gutter')
          if (replyFeed) {
            // Remove existing static reply cards (non-AI Draft ones)
            const sections = Array.from(replyFeed.querySelectorAll(':scope > section'))
            sections.forEach((sec) => {
              if (!sec.classList.contains('border-l-primary')) {
                sec.remove()
              }
            })

            // Get or create replies container
            let repliesContainer = replyFeed.querySelector('.cm-replies-list') as HTMLElement | null
            if (!repliesContainer) {
              repliesContainer = document.createElement('div')
              repliesContainer.className = 'cm-replies-list space-y-gutter mt-6'
              const inputArea = replyFeed.querySelector('.mt-12')
              if (inputArea) {
                replyFeed.insertBefore(repliesContainer, inputArea)
              } else {
                replyFeed.appendChild(repliesContainer)
              }
            }

            repliesContainer.innerHTML = ''

            // Fetch unique users concurrently
            const uniqueUserIds = Array.from(new Set(replies.items.map((r) => r.user_id)))
            const fetchedUsers = await Promise.all(
              uniqueUserIds.map(async (uid) => {
                try {
                  const u = await usersApi.getById(uid)
                  return [uid, u] as const
                } catch {
                  return [uid, null] as const
                }
              })
            )
            const userMap = Object.fromEntries(fetchedUsers.filter(([_, u]) => u !== null)) as Record<string, UserResponse>

            // Render replies
            replies.items.forEach((reply) => {
              const user = userMap[reply.user_id] || {
                full_name: 'Contributor',
                username: `user_${reply.user_id.slice(0, 4)}`,
                role: 'user',
                reputation_score: 100,
                avatar_url: null,
              }

              const score = reply.upvote_count - reply.downvote_count
              const scoreText = score >= 0 ? `+${score}` : `${score}`
              const userAvatar = user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name || user.username)}&background=b0c6ff&color=002d6e&bold=true`

              const replyCard = document.createElement('section')
              if (reply.is_accepted) {
                replyCard.className = 'glass-card rounded-xl p-8 border border-secondary-container/30 glow-border'
              } else {
                replyCard.className = 'glass-card rounded-xl p-8 opacity-90 hover:opacity-100 transition-opacity border border-white/5'
              }

              replyCard.innerHTML = `
                <div class="flex items-start justify-between mb-6">
                  <div class="flex items-center gap-4">
                    <img alt="${user.full_name} Avatar" class="w-12 h-12 rounded-full border-2 border-secondary-container/50 p-0.5" src="${userAvatar}">
                    <div>
                      <div class="flex items-center gap-2">
                        <span class="font-headline-md text-headline-md text-on-surface">${user.full_name || user.username}</span>
                        ${user.role === 'admin' ? '<span class="bg-secondary-container text-on-secondary-container font-label-sm text-label-sm px-2 py-0.5 rounded-full uppercase tracking-tighter">Moderator</span>' : ''}
                      </div>
                      <p class="font-label-sm text-label-sm text-on-surface-variant">${new Date(reply.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                  ${reply.is_accepted ? `
                  <div class="flex items-center gap-2 px-4 py-2 bg-secondary-container/10 border border-secondary-container/30 rounded-full">
                    <span class="material-symbols-outlined text-secondary-fixed-dim" style="font-variation-settings: 'FILL' 1;">check_circle</span>
                    <span class="text-secondary-fixed-dim font-label-md text-label-md">Accepted Answer</span>
                  </div>` : ''}
                </div>
                <div class="font-body-md text-body-md text-on-surface mb-8 whitespace-pre-wrap">${reply.content}</div>
                <div class="flex items-center justify-between">
                  <div class="flex items-center bg-surface-container rounded-full p-1 border border-white/5">
                    <button class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-variant transition-colors text-on-surface-variant cm-upvote-btn">
                      <span class="material-symbols-outlined">expand_less</span>
                    </button>
                    <span class="px-4 font-label-md text-label-md font-bold text-on-surface">${scoreText}</span>
                    <button class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-variant transition-colors text-on-surface-variant cm-downvote-btn">
                      <span class="material-symbols-outlined">expand_more</span>
                    </button>
                  </div>
                  <div class="flex gap-4">
                    <button class="text-on-surface-variant hover:text-on-surface transition-colors font-label-md text-label-md cm-reply-btn">Reply</button>
                  </div>
                </div>
              `

              const upvoteBtn = replyCard.querySelector('.cm-upvote-btn')
              const downvoteBtn = replyCard.querySelector('.cm-downvote-btn')

              upvoteBtn?.addEventListener('click', async () => {
                try {
                  await votesApi.createOrUpdate({
                    target_type: 'reply',
                    target_id: reply.id,
                    vote_type: 'UPVOTE',
                  })
                  loadThreadData()
                } catch (err) {
                  console.error(err)
                }
              })

              downvoteBtn?.addEventListener('click', async () => {
                try {
                  await votesApi.createOrUpdate({
                    target_type: 'reply',
                    target_id: reply.id,
                    vote_type: 'DOWNVOTE',
                  })
                  loadThreadData()
                } catch (err) {
                  console.error(err)
                }
              })

              const innerReplyBtn = replyCard.querySelector('.cm-reply-btn')
              innerReplyBtn?.addEventListener('click', () => {
                const textInput = root.querySelector('textarea')
                if (textInput) {
                  textInput.focus()
                  textInput.value = `@${user.username || user.full_name} ` + textInput.value
                }
              })

              repliesContainer?.appendChild(replyCard)
            })

            // Update Discussion Insights
            const totalAnswersEl = Array.from(root.querySelectorAll('.glass-card.rounded-xl.p-6')).find(card => 
              card.querySelector('h3')?.textContent?.includes('Discussion Insights')
            )
            if (totalAnswersEl) {
              const stats = totalAnswersEl.querySelectorAll('.p-4')
              if (stats.length >= 3) {
                const totalAnsVal = stats[0].querySelector('span + span')
                if (totalAnsVal) totalAnsVal.textContent = replies.items.length.toString()

                const totalVotesVal = stats[1].querySelector('span + span')
                if (totalVotesVal) {
                  const totalVotes = replies.items.reduce((sum, r) => sum + r.upvote_count + r.downvote_count, 0)
                  totalVotesVal.textContent = totalVotes.toString()
                }

                const partLevelVal = stats[2].querySelector('span + span')
                if (partLevelVal) {
                  const count = replies.items.length
                  const level = count > 5 ? 'High' : count > 2 ? 'Medium' : 'Low'
                  partLevelVal.textContent = level
                  partLevelVal.className = `font-label-md text-label-md font-bold uppercase tracking-widest ${
                    level === 'High' ? 'text-secondary-fixed-dim' : level === 'Medium' ? 'text-primary' : 'text-on-surface-variant'
                  }`
                }
              }
            }

            // Update AI Consensus
            const aiConsensusEl = Array.from(root.querySelectorAll('.glass-card.rounded-xl.p-6')).find(card => 
              card.querySelector('h3')?.textContent?.includes('AI Consensus')
            )
            if (aiConsensusEl) {
              const items = aiConsensusEl.querySelectorAll('.flex.justify-between.items-center')
              if (items.length >= 2) {
                const totalAnalyzed = items[0].querySelector('span + span')
                if (totalAnalyzed) totalAnalyzed.textContent = replies.items.length.toString()

                const agreementVal = items[1].querySelector('span + span')
                if (agreementVal) {
                  const score = disc.consensus_score ? Math.round(disc.consensus_score * 100) : 88
                  agreementVal.textContent = `${score}%`
                }
              }

              const conclusionText = aiConsensusEl.querySelector('.py-2 p')
              if (conclusionText) {
                const acceptedReply = replies.items.find(r => r.is_accepted)
                const topReply = replies.items.slice().sort((a,b) => (b.upvote_count - b.downvote_count) - (a.upvote_count - a.downvote_count))[0]
                if (acceptedReply) {
                  conclusionText.textContent = acceptedReply.content.slice(0, 100) + (acceptedReply.content.length > 100 ? '...' : '')
                } else if (topReply) {
                  conclusionText.textContent = topReply.content.slice(0, 100) + (topReply.content.length > 100 ? '...' : '')
                } else {
                  conclusionText.textContent = 'No conclusions established yet. Peer review is in progress.'
                }
              }

              const confidenceVal = aiConsensusEl.querySelector('.p-3 span + span')
              const confidenceBar = aiConsensusEl.querySelector('.p-3 .h-full') as HTMLElement | null
              if (confidenceVal) {
                const score = disc.consensus_score ? Math.round(disc.consensus_score * 100) : 92
                confidenceVal.textContent = `${score}%`
                if (confidenceBar) {
                  confidenceBar.style.width = `${score}%`
                }
              }
            }

            // Update Top Contributors
            const topContrEl = Array.from(root.querySelectorAll('.glass-card.rounded-xl.p-6')).find(card => 
              card.querySelector('h3')?.textContent?.includes('Top Contributors')
            )
            if (topContrEl) {
              const container = topContrEl.querySelector('.space-y-4')
              if (container) {
                container.innerHTML = ''
                const usersList = Object.values(userMap).slice(0, 3)
                if (usersList.length === 0) {
                  container.innerHTML = '<p class="text-label-sm text-on-surface-variant italic">No contributors yet</p>'
                } else {
                  usersList.forEach((u) => {
                    const uAvatar = u.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.full_name || u.username)}&background=b0c6ff&color=002d6e&bold=true`
                    const userDiv = document.createElement('div')
                    userDiv.className = 'flex items-center gap-3 border-t border-white/5 pt-4 first:border-t-0 first:pt-0'
                    userDiv.innerHTML = `
                      <img alt="Avatar" class="w-8 h-8 rounded-full" src="${uAvatar}">
                      <div class="flex-1">
                        <p class="text-label-md font-medium text-on-surface">${u.full_name || u.username}</p>
                        <p class="text-label-sm text-on-surface-variant">${u.role === 'admin' ? 'Moderator' : 'Contributor'}</p>
                      </div>
                      <span class="text-secondary-fixed-dim font-label-sm">+${u.reputation_score || 100}</span>
                    `
                    container.appendChild(userDiv)
                  })
                }
              }
            }
          }

          // Wire add answer form
          const textarea = root.querySelector('textarea') as HTMLTextAreaElement | null
          const postBtn = Array.from(root.querySelectorAll('button')).find(
            (b) => b.textContent?.trim() === 'Post Answer',
          )

          if (postBtn && textarea && !postBtn.getAttribute('data-wired')) {
            postBtn.setAttribute('data-wired', 'true')
            postBtn.addEventListener('click', async (e) => {
              e.preventDefault()
              const content = textarea.value.trim()
              if (!content || content.length < 5) return

              postBtn.textContent = 'Posting...'
              postBtn.setAttribute('disabled', 'true')

              try {
                await repliesApi.create(id, { content })
                textarea.value = ''
                loadThreadData()
              } catch (err) {
                console.error('Failed to post reply', err)
              } finally {
                postBtn.textContent = 'Post Answer'
                postBtn.removeAttribute('disabled')
              }
            })
          }

        } catch (err) {
          console.error(err)
        }
      }

      loadThreadData()
    }, 100)

    return () => clearTimeout(timer)
  }, [id, navigate])

  return (
    <StitchPage
      bodyHtml={bodyHtml}
      pageStyles={pageStyles}
      title="CrowdMind | Discussion Thread"
      navMap={{
        ...commonUserNav,
        back: '/discussions',
        'all discussions': '/discussions',
      }}
    />
  )
}
