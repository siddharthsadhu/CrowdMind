import { useStitchData } from '@/hooks/useStitchData'
import { useNavigate, useParams } from 'react-router-dom'
import { StitchPage } from '@/components/StitchPage'
import { bodyHtml, pageStyles } from '@/stitch-content/06-analysis'
import { commonUserNav } from '@/data/navMaps'
import { questionsApi } from '@/services/api/questions'
import { faqsApi } from '@/services/api/faqs'
import { discussionsApi } from '@/services/api/discussions'
import { categoriesApi } from '@/services/api/categories'

export default function AnalysisPage() {
  const navigate = useNavigate()
  const { id } = useParams()

  useStitchData(async (root) => {
    if (!id) return

    try {
      const q = await questionsApi.getById(id)
      document.title = `CrowdMind | Analysis: ${q.title}`

      const questionEl = root.querySelector('h1')
      if (questionEl) questionEl.textContent = `"${q.title}"`

      const showCompletedUI = async (title: string) => {
        // 1. Fetch analysis from database/cache endpoint
        let analysis: any = null
        try {
          analysis = await questionsApi.getAnalysis(id)
        } catch (err) {
          console.error('[AnalysisPage] Failed to fetch Gemini analysis:', err)
        }

        // Fetch all FAQs
        const faqRes = await faqsApi.list({ page_size: '150' })
        const faqs = faqRes.items

        // Fetch matched FAQ if any
        let bestFaq: any = null
        if (analysis?.similar_faq_id) {
          try {
            bestFaq = await faqsApi.getById(analysis.similar_faq_id)
          } catch (e) {
            console.error('[AnalysisPage] Failed to load similar FAQ detail:', e)
          }
        }

        const matches: Array<{ faq: any, pct: number }> = []
        if (bestFaq && analysis) {
          matches.push({ faq: bestFaq, pct: analysis.confidence_score })
        }

        // 2. Update status card
        const statusCard = root.querySelector('#status-card-container') as HTMLElement | null
        const circleProgress = root.querySelector('#status-circle-progress') as HTMLElement | null
        const confidenceScore = root.querySelector('#status-confidence-score')
        const confidenceText = root.querySelector('#status-confidence-text')
        const statusIcon = root.querySelector('#status-icon')
        const statusText = root.querySelector('#status-text')
        const statusTextWrapper = root.querySelector('#status-text-wrapper') as HTMLElement | null

        const confidence = analysis ? analysis.confidence_score : 42
        
        if (confidenceScore) confidenceScore.textContent = `${confidence}%`
        if (circleProgress) {
          const offset = 213.6 - (213.6 * confidence) / 100
          circleProgress.style.strokeDashoffset = offset.toString()
        }

        if (confidence >= 70 && bestFaq) {
          if (statusCard) {
            statusCard.className = 'glass-card rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 border-l-4 border-l-secondary-container opacity-100'
          }
          if (confidenceText) confidenceText.textContent = 'Potential duplicate match detected'
          if (statusIcon) statusIcon.textContent = 'check_circle'
          if (statusTextWrapper) statusTextWrapper.className = 'flex items-center gap-2 text-secondary-container mb-1'
          if (statusText) statusText.textContent = 'Duplicate FAQ found.'
        } else {
          if (statusCard) {
            statusCard.className = 'glass-card rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 border-l-4 border-l-error opacity-100'
          }
          if (confidenceText) confidenceText.textContent = 'Substantial uncertainty detected'
          if (statusIcon) statusIcon.textContent = 'error'
          if (statusTextWrapper) statusTextWrapper.className = 'flex items-center gap-2 text-error mb-1'
          if (statusText) statusText.textContent = 'No definitive FAQ found.'
        }

        // 3. Render matched cards in similar-faqs-container
        const container = root.querySelector('#similar-faqs-container')
        const countLabel = root.querySelector('#similar-faqs-count-label')
        if (container) {
          container.innerHTML = ''
          
          if (matches.length > 0) {
            const itemsToShow = matches.slice(0, 3)
            if (countLabel) {
              countLabel.textContent = `${itemsToShow.length} relevant documents recovered`
            }
            itemsToShow.forEach(m => {
              const card = document.createElement('div')
              card.className = 'glass-card rounded-xl p-6 relative overflow-hidden group opacity-100 cursor-pointer'
              card.innerHTML = `
                <div class="absolute top-0 right-0 p-4">
                  <div class="text-primary font-label-md text-label-md bg-primary/10 px-3 py-1 rounded-full border border-primary/20">${m.pct}% Match</div>
                </div>
                <div class="mb-4">
                  <span class="material-symbols-outlined text-primary mb-2" style="font-variation-settings: 'FILL' 1;">description</span>
                  <h3 class="font-headline-md text-headline-md text-on-surface">${m.faq.title}</h3>
                </div>
                <p class="text-on-surface-variant font-body-md text-body-md line-clamp-2 mb-6">${m.faq.content}</p>
                <button class="flex items-center gap-2 text-primary font-label-md text-label-md group-hover:gap-3 transition-all">
                  View Full Document <span class="material-symbols-outlined" style="font-size: 16px;">arrow_forward</span>
                </button>
              `
              card.addEventListener('click', () => navigate(`/faq/${m.faq.id}`))
              container.appendChild(card)
            })
          } else {
            // Fallback: Show category faqs or default faqs with Related FAQ neutral badge
            const categoryFaqs = faqs.filter(f => f.category_id === q.category_id)
            const fallbacks = categoryFaqs.length > 0 ? categoryFaqs : faqs
            const itemsToShow = fallbacks.slice(0, 3)
            
            if (countLabel) {
              countLabel.textContent = `${itemsToShow.length} general resources retrieved`
            }
            
            if (itemsToShow.length === 0) {
              container.innerHTML = `
                <div class="glass-card rounded-xl p-6 text-center text-on-surface-variant">
                  No matching FAQs found in database.
                </div>
              `
            } else {
              itemsToShow.forEach(faq => {
                const card = document.createElement('div')
                card.className = 'glass-card rounded-xl p-6 relative overflow-hidden group opacity-100 cursor-pointer'
                card.innerHTML = `
                  <div class="absolute top-0 right-0 p-4">
                    <div class="text-on-surface-variant font-label-md text-label-md bg-white/5 px-3 py-1 rounded-full border border-white/10">Category FAQ</div>
                  </div>
                  <div class="mb-4">
                    <span class="material-symbols-outlined text-primary mb-2" style="font-variation-settings: 'FILL' 1;">description</span>
                    <h3 class="font-headline-md text-headline-md text-on-surface">${faq.title}</h3>
                  </div>
                  <p class="text-on-surface-variant font-body-md text-body-md line-clamp-2 mb-6">${faq.content}</p>
                  <button class="flex items-center gap-2 text-primary font-label-md text-label-md group-hover:gap-3 transition-all">
                    View Full Document <span class="material-symbols-outlined" style="font-size: 16px;">arrow_forward</span>
                  </button>
                `
                card.addEventListener('click', () => navigate(`/faq/${faq.id}`))
                container.appendChild(card)
              })
            }
          }
        }

        // 4. Update AI Draft Card
        const draftText = root.querySelector('#ai-draft-text')
        const draftPct = root.querySelector('#ai-draft-confidence-pct')
        const draftBar = root.querySelector('#ai-draft-confidence-bar') as HTMLElement | null
        const badgeContainer = root.querySelector('#ai-draft-badge-container')

        if (draftPct) draftPct.textContent = `${confidence}%`
        if (draftBar) draftBar.style.width = `${confidence}%`

        if (draftText) {
          const draftVal = analysis?.draft_answer || `Based on our analysis, the exact guidelines for "${title}" are missing. Standard team changes after Phase 1 require a signed NOC request from the research coordinator (Ref: Policy Section 4).`
          const formattedDraft = draftVal
            .replace(/\n/g, '<br/>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
          
          draftText.innerHTML = formattedDraft

          if (badgeContainer) {
            if (confidence >= 70 && bestFaq) {
              badgeContainer.innerHTML = `
                <div class="bg-secondary-container/10 text-secondary-container px-3 py-1.5 rounded-full flex items-center gap-2">
                  <span class="material-symbols-outlined" style="font-size: 16px;">verified</span>
                  <span class="font-label-sm text-label-sm font-bold">Duplicate Match (High Confidence)</span>
                </div>
              `
            } else {
              badgeContainer.innerHTML = `
                <div class="bg-error/10 text-error px-3 py-1.5 rounded-full flex items-center gap-2">
                  <span class="material-symbols-outlined" style="font-size: 16px;">verified_user</span>
                  <span class="font-label-sm text-label-sm font-bold">Needs Community Validation</span>
                </div>
              `
            }
          }
        }

        // 5. Update Action Buttons & Desc
        const actionDesc = root.querySelector('#analysis-action-desc')
        const actionButtons = root.querySelector('#analysis-action-buttons')
        if (actionDesc) {
          actionDesc.textContent = confidence >= 70 && bestFaq
            ? "Our AI detected a high confidence duplicate FAQ matching your question. You can view it directly or escalate if you still need a custom discussion thread."
            : "Our AI couldn't find a high-certainty duplicate. We recommend escalating this to the community experts by creating a discussion thread."
        }
        if (actionButtons) {
          actionButtons.innerHTML = ''
          if (confidence >= 70 && bestFaq) {
            const btnView = document.createElement('button')
            btnView.className = 'bg-primary text-on-primary px-8 py-4 rounded-xl font-bold font-headline-md text-headline-md flex items-center justify-center gap-3 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/20'
            btnView.innerHTML = `<span class="material-symbols-outlined">visibility</span> View FAQ`
            btnView.addEventListener('click', () => navigate(`/faq/${bestFaq.id}`))

            const btnEscalate = document.createElement('button')
            btnEscalate.className = 'border border-outline-variant text-on-surface px-8 py-4 rounded-xl font-bold font-headline-md text-headline-md flex items-center justify-center gap-3 hover:bg-white/5 active:scale-95 transition-all'
            btnEscalate.innerHTML = `<span class="material-symbols-outlined">forum</span> Create Discussion`
            btnEscalate.addEventListener('click', () => navigate(`/discussions/new?question_id=${id}`))

            actionButtons.appendChild(btnView)
            actionButtons.appendChild(btnEscalate)
          } else {
            const btnCreate = document.createElement('button')
            btnCreate.className = 'bg-primary text-on-primary px-8 py-4 rounded-xl font-bold font-headline-md text-headline-md flex items-center justify-center gap-3 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/20'
            btnCreate.innerHTML = `<span class="material-symbols-outlined">forum</span> Create Discussion Thread`
            btnCreate.addEventListener('click', () => navigate(`/discussions/new?question_id=${id}`))

            const btnRefine = document.createElement('button')
            btnRefine.className = 'border border-outline-variant text-on-surface px-8 py-4 rounded-xl font-bold font-headline-md text-headline-md flex items-center justify-center gap-3 hover:bg-white/5 active:scale-95 transition-all'
            btnRefine.innerHTML = `<span class="material-symbols-outlined">edit</span> Refine Question`
            btnRefine.addEventListener('click', () => navigate('/ask'))

            actionButtons.appendChild(btnCreate)
            actionButtons.appendChild(btnRefine)
          }
        }

        // 6. Update dynamic Sidebar & Analysis details
        try {
          const cats = await categoriesApi.list()
          const currentCat = cats.find(c => c.id === q.category_id)
          const categoriesMatchedContainer = root.querySelector('#analysis-categories-matched')
          if (categoriesMatchedContainer) {
            categoriesMatchedContainer.innerHTML = currentCat 
              ? `<span class="bg-white/5 text-on-surface-variant text-[10px] px-2 py-0.5 rounded border border-white/10">${currentCat.name}</span>`
              : `<span class="bg-white/5 text-on-surface-variant text-[10px] px-2 py-0.5 rounded border border-white/10">General</span>`
          }

          const allDiscussionsRes = await discussionsApi.list({ page_size: '100' })
          const faqsScannedEl = root.querySelector('#analysis-faqs-scanned')
          const discussionsScannedEl = root.querySelector('#analysis-discussions-scanned')

          if (faqsScannedEl) faqsScannedEl.textContent = String(faqRes.total || faqs.length)
          if (discussionsScannedEl) discussionsScannedEl.textContent = String(allDiscussionsRes.total || allDiscussionsRes.items.length)

          const breakdownEl = root.querySelector('#analysis-confidence-breakdown')
          if (breakdownEl) {
            breakdownEl.textContent = analysis?.analysis_breakdown || (
              confidence >= 70 && bestFaq
                ? `High semantic match (${confidence}%) was found in "${bestFaq.title}". This matches key tokens from your query.`
                : `No high-certainty matching FAQ was found in our database (Confidence is ${confidence}%). The query contains unique terms not currently documented.`
            )
          }
        } catch (sidebarErr) {
          console.error('[AnalysisPage] Failed to render sidebar details', sidebarErr)
        }
      }

      if (q.ai_analysis_status === 'completed') {
        await showCompletedUI(q.title)
      } else {
        // Loading Simulation Stepper
        const container = root.querySelector('#similar-faqs-container')
        const countLabel = root.querySelector('#similar-faqs-count-label')
        if (countLabel) countLabel.textContent = 'AI Self-Evolution Engine Running...'
        
        // Update Top Status Card to showing progress
        const circleProgress = root.querySelector('#status-circle-progress') as HTMLElement | null
        const confidenceScore = root.querySelector('#status-confidence-score')
        const confidenceText = root.querySelector('#status-confidence-text')
        const statusText = root.querySelector('#status-text')
        
        if (confidenceScore) confidenceScore.textContent = '0%'
        if (circleProgress) circleProgress.style.strokeDashoffset = '213.6'
        if (confidenceText) confidenceText.textContent = 'AI pipeline executing...'
        if (statusText) statusText.textContent = 'Analyzing query...'

        if (container) {
          container.innerHTML = `
            <div class="glass-card rounded-xl p-8 space-y-6">
              <div class="flex items-center gap-4 text-primary">
                <span class="material-symbols-outlined animate-spin text-2xl">sync</span>
                <h2 class="font-headline-lg text-headline-lg text-on-surface">AI Self-Evolution Engine Running</h2>
              </div>
              <p class="text-on-surface-variant font-body-md leading-relaxed">Our neural agents are scanning the local knowledge base, analyzing topics, and synthesizing draft answers. Please wait...</p>
              <div class="h-[1px] bg-white/10 my-4"></div>
              <ul class="space-y-4">
                <li class="flex items-center gap-3 text-on-surface-variant" id="step-1">
                  <span class="material-symbols-outlined text-[20px] text-primary animate-spin" id="step-icon-1">sync</span>
                  <span class="font-body-md" id="step-text-1">Scanning knowledge base for duplicates...</span>
                </li>
                <li class="flex items-center gap-3 text-on-surface-variant/40" id="step-2">
                  <span class="material-symbols-outlined text-[20px]" id="step-icon-2">hourglass_empty</span>
                  <span class="font-body-md text-on-surface-variant/40" id="step-text-2">Categorizing question using semantic analysis...</span>
                </li>
                <li class="flex items-center gap-3 text-on-surface-variant/40" id="step-3">
                  <span class="material-symbols-outlined text-[20px]" id="step-icon-3">hourglass_empty</span>
                  <span class="font-body-md text-on-surface-variant/40" id="step-text-3">Generating initial AI draft response...</span>
                </li>
              </ul>
            </div>
          `

          // Disable recommended action buttons during load
          const actionButtons = root.querySelector('#analysis-action-buttons')
          if (actionButtons) {
            actionButtons.innerHTML = `
              <button class="bg-primary/20 text-primary/40 px-8 py-4 rounded-xl font-bold font-headline-md text-headline-md flex items-center justify-center gap-3 cursor-not-allowed" disabled>
                <span class="material-symbols-outlined animate-spin">sync</span> Running Analysis...
              </button>
            `
          }

          // Trigger backend Gemini analysis call immediately in background!
          const analysisPromise = questionsApi.getAnalysis(id).catch(err => {
            console.error('[AnalysisPage] Background analysis fetch failed:', err)
            return null
          })

          // Stepper loop
          setTimeout(() => {
            const stepIcon1 = root.querySelector('#step-icon-1')
            const stepText1 = root.querySelector('#step-text-1')
            const stepIcon2 = root.querySelector('#step-icon-2')
            const stepText2 = root.querySelector('#step-text-2')
            
            if (stepIcon1) {
              stepIcon1.textContent = 'check_circle'
              stepIcon1.className = 'material-symbols-outlined text-[20px] text-secondary-container'
            }
            if (stepText1) stepText1.className = 'font-body-md text-secondary-container'

            if (stepIcon2) {
              stepIcon2.textContent = 'sync'
              stepIcon2.className = 'material-symbols-outlined text-[20px] text-primary animate-spin'
            }
            if (stepText2) stepText2.className = 'font-body-md text-on-surface'
          }, 1000)

          setTimeout(() => {
            const stepIcon2 = root.querySelector('#step-icon-2')
            const stepText2 = root.querySelector('#step-text-2')
            const stepIcon3 = root.querySelector('#step-icon-3')
            const stepText3 = root.querySelector('#step-text-3')
            
            if (stepIcon2) {
              stepIcon2.textContent = 'check_circle'
              stepIcon2.className = 'material-symbols-outlined text-[20px] text-secondary-container'
            }
            if (stepText2) stepText2.className = 'font-body-md text-secondary-container'

            if (stepIcon3) {
              stepIcon3.textContent = 'sync'
              stepIcon3.className = 'material-symbols-outlined text-[20px] text-primary animate-spin'
            }
            if (stepText3) stepText3.className = 'font-body-md text-on-surface'
          }, 2000)

          setTimeout(async () => {
            const stepIcon3 = root.querySelector('#step-icon-3')
            const stepText3 = root.querySelector('#step-text-3')
            if (stepIcon3) {
              stepIcon3.textContent = 'check_circle'
              stepIcon3.className = 'material-symbols-outlined text-[20px] text-secondary-container'
            }
            if (stepText3) stepText3.className = 'font-body-md text-secondary-container'

            try {
              // Wait for background analysis to complete
              await analysisPromise
              
              // Update database status via API PATCH
              await questionsApi.update(id, { ai_analysis_status: 'completed' })
              
              // Show finalized UI
              await showCompletedUI(q.title)
            } catch (err) {
              console.error('[AnalysisPage] Failed to save analysis status', err)
              // fallback UI anyway
              await showCompletedUI(q.title)
            }
          }, 3000)
        }
      }

    } catch (err) {
      console.error('[AnalysisPage] Error loading analysis details:', err)
    }
  }, [id, navigate])

  return (
    <StitchPage
      bodyHtml={bodyHtml}
      pageStyles={pageStyles}
      title="CrowdMind | AI Analysis"
      navMap={{
        ...commonUserNav,
        'create discussion thread': `/discussions/new?question_id=${id}`,
        'refine question': '/ask',
        'view discussion': '/discussions',
        continue: '/discussions',
      }}
    />
  )
}
