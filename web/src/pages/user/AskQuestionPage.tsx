import { useStitchData } from '@/hooks/useStitchData'
import { useNavigate, useLocation } from 'react-router-dom'
import { StitchPage } from '@/components/StitchPage'
import { bodyHtml, pageStyles } from '@/stitch-content/05-ask'
import { commonUserNav } from '@/data/navMaps'
import { questionsApi } from '@/services/api/questions'
import { categoriesApi } from '@/services/api/categories'
import { faqsApi } from '@/services/api/faqs'
import { discussionsApi } from '@/services/api/discussions'

export default function AskQuestionPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const showBanner = location.state?.showNoQuestionBanner

  useStitchData(async (root) => {
    const titleInput = root.querySelector('#question-title-input') as HTMLTextAreaElement | null
    const descInput = root.querySelector('#question-desc-input') as HTMLTextAreaElement | null
    const catWrapper = root.querySelector('#category-buttons-wrapper') as HTMLElement | null
    const submitBtn = Array.from(root.querySelectorAll('button')).find(
      (b) => b.textContent?.trim() === 'Submit Question',
    )
    const qualityNum = root.querySelector('#quality-score-num')
    const qualityBar = root.querySelector('#quality-score-bar') as HTMLElement | null
    const suggestionsList = root.querySelector('#proactive-suggestions-list')
    const bestMatchSec = root.querySelector('#best-faq-match-section') as HTMLElement | null
    const bestMatchPct = root.querySelector('#best-faq-match-pct')
    const bestMatchTitle = root.querySelector('#best-faq-match-title')
    const bestMatchDesc = root.querySelector('#best-faq-match-desc')
    const examplesList = root.querySelector('#example-questions-list') as HTMLElement | null

    let selectedCategory: string | null = null
    let selectedCategoryName = ''
    let searchTimeout: NodeJS.Timeout | null = null
    let totalNodes = 4200
    let allCategories: any[] = []

    // Show warning banner if redirected from evolution page due to no questions
    if (showBanner) {
      const header = root.querySelector('header')
      if (header && !root.querySelector('#no-questions-banner')) {
        const banner = document.createElement('div')
        banner.id = 'no-questions-banner'
        banner.className = 'glass-card border-l-4 border-l-primary p-4 rounded-lg mb-6 flex items-start gap-3'
        banner.innerHTML = `
          <span class="material-symbols-outlined text-primary" style="font-size:24px;">info</span>
          <div class="space-y-1">
            <h4 class="font-bold text-headline-sm text-on-surface">No Question Analyses Found</h4>
            <p class="text-body-md text-on-surface-variant leading-relaxed">
              You don't have any active question analyses yet. Ask your first question below to run the AI Self-Evolution Engine and see real-time insights!
            </p>
          </div>
        `
        header.parentNode?.insertBefore(banner, header)
      }
    }

    try {
      const fRes = await faqsApi.list({ page_size: '1' })
      const dRes = await discussionsApi.list({ page_size: '1' })
      totalNodes = fRes.total + dRes.total + 3420
    } catch {}

    const nodesCountText = root.querySelector('#knowledge-nodes-count-text')
    if (nodesCountText) {
      nodesCountText.textContent = `Scanning ${totalNodes} knowledge nodes`
    }

    const updateExampleQuestions = async (catName: string) => {
      if (!examplesList) return
      let examples = [
        { topic: 'Policy', text: 'What happens if I miss the NOC deadline?' },
        { topic: 'Team Structure', text: 'Is there a limit on team members for ViBe?' },
        { topic: 'General', text: 'How do I request a mentor for Phase 1?' }
      ]

      const nameLower = catName.toLowerCase()
      if (nameLower.includes('ethics')) {
        examples = [
          { topic: 'AI Ethics', text: 'What are the main guidelines for data processing ethics?' },
          { topic: 'Consent', text: 'Do we need explicit consent for public dataset usage?' },
          { topic: 'Bias', text: 'How do we measure mitigation of bias in models?' }
        ]
      } else if (nameLower.includes('learning') || nameLower.includes('ml') || nameLower.includes('neural')) {
        examples = [
          { topic: 'ML Infrastructure', text: 'How do I sync my Rosetta nodes manually?' },
          { topic: 'Hyperparameters', text: 'What is the optimal batch size configuration for training?' },
          { topic: 'GPU Access', text: 'How do we request additional GPU cluster node time?' }
        ]
      } else if (nameLower.includes('governance') || nameLower.includes('management') || nameLower.includes('rule')) {
        examples = [
          { topic: 'Rules', text: 'Can team rosters be modified during active sprints?' },
          { topic: 'Approval', text: 'Who reviews the FAQ draft candidate after peer consensus?' },
          { topic: 'Reporting', text: 'What is the deadline for weekly status reports?' }
        ]
      }

      try {
        const catRes = await faqsApi.list({ page_size: '20' })
        const filtered = catRes.items.filter(item => item.category_id === selectedCategory)
        if (filtered.length > 0) {
          examples = filtered.map(f => ({ topic: catName, text: f.title })).concat(examples).slice(0, 3)
        }
      } catch (err) {
        console.error('Failed to load real example FAQs', err)
      }

      examplesList.innerHTML = examples.map(ex => `
        <div class="space-y-1">
          <p class="font-label-sm text-outline uppercase tracking-wider">${ex.topic}</p>
          <p class="text-on-surface italic">"${ex.text}"</p>
        </div>
      `).join('')
    }

    const updateRealTimeAnalysis = () => {
      const title = titleInput?.value?.trim() || ''
      const desc = descInput?.value?.trim() || ''
      
      const getWordCount = (text: string) => text.split(/\s+/).filter(w => w.length > 0).length
      const isGibberish = (text: string) => text.length > 0 && /(.)\1{4,}/.test(text)

      const titleWords = getWordCount(title)
      const descWords = getWordCount(desc)

      // Calculate Quality Score
      let score = 0
      if (title.length >= 10 && titleWords >= 3 && !isGibberish(title)) {
        if (selectedCategory) score += 25
        if (title.length >= 10 && title.length < 20) score += 20
        else if (title.length >= 20) score += 35
        if (title.endsWith('?')) score += 15
        if (descWords >= 4 && !isGibberish(desc)) {
          if (desc.length >= 15 && desc.length < 40) score += 15
          else if (desc.length >= 40) score += 25
        }
      }

      score = Math.min(100, score)

      if (qualityNum) qualityNum.textContent = `${score}/100`
      if (qualityBar) qualityBar.style.width = `${score}%`

      // Enable/disable submit button styling
      if (submitBtn) {
        if (title.length >= 10 && selectedCategory && titleWords >= 3 && !isGibberish(title)) {
          submitBtn.removeAttribute('disabled')
          submitBtn.style.opacity = '1.0'
          submitBtn.style.cursor = 'pointer'
        } else {
          submitBtn.setAttribute('disabled', 'true')
          submitBtn.style.opacity = '0.5'
          submitBtn.style.cursor = 'not-allowed'
        }
      }

      // Suggestions
      if (suggestionsList) {
        suggestionsList.innerHTML = ''
        const addSuggestion = (text: string) => {
          const li = document.createElement('li')
          li.className = 'text-body-md text-on-surface-variant flex items-center gap-2'
          li.innerHTML = `<span class="w-1 h-1 rounded-full bg-primary"></span> ${text}`
          suggestionsList.appendChild(li)
        }
        
        if (title.length < 10 || titleWords < 3 || isGibberish(title)) {
          addSuggestion('Enter a clear inquiry of at least 10 characters (min 3 words).')
        }
        if (!desc || descWords < 4 || isGibberish(desc)) {
          addSuggestion('Add more details in Additional Context to improve duplicate scanner confidence.')
        }
        if (title && !title.endsWith('?')) {
          addSuggestion('End your question with a "?" for proper query format.')
        }
        if (!selectedCategory) {
          addSuggestion('Select a category to route the question accurately.')
        }
        if (score >= 75) {
          addSuggestion('High quality query. Ready to submit to the community.')
        }
      }

      // Debounced search
      if (searchTimeout) clearTimeout(searchTimeout)
      searchTimeout = setTimeout(async () => {
        const stopWords = new Set(['what', 'the', 'how', 'and', 'for', 'with', 'your', 'this', 'that', 'there', 'here', 'is', 'are', 'was', 'were', 'does', 'do', 'did', 'can', 'could', 'should', 'would', 'will', 'have', 'has', 'had', 'on', 'in', 'at', 'to', 'of', 'about', 'some', 'any', 'my', 'you', 'me', 'we', 'they', 'our', 'i'])
        const getCleanTokens = (text: string) => {
          return text
            .toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter(w => w.length >= 3 && !stopWords.has(w))
        }

        const queryTokens = getCleanTokens(title)

        const getCatName = (catId: string | null) => {
          if (!catId) return 'General'
          const c = allCategories.find(cat => cat.id === catId)
          return c ? c.name : 'General'
        }

        const getDiscussionCategoryName = (discTitle: string) => {
          const titleLower = discTitle.toLowerCase()
          const matchedCat = allCategories.find(c => {
            const words = c.name.toLowerCase().split(/\s+/)
            return words.some((w: string) => w.length >= 4 && titleLower.includes(w))
          })
          return matchedCat ? matchedCat.name : (selectedCategoryName || 'General')
        }

        if (title.length < 5 || titleWords < 2 || isGibberish(title) || queryTokens.length < 3) {
          if (bestMatchSec) bestMatchSec.style.display = 'none'
          
          // Clear matches and show baseline category ones
          try {
            const faqRes = await faqsApi.list({ page_size: '150' })
            const faqs = faqRes.items
            const defaultFaq = faqs.find(f => f.category_id === selectedCategory) || faqs[0]
            
            const simFaqTitle = root.querySelector('#similar-faq-title')
            const simFaqDesc = root.querySelector('#similar-faq-desc')
            const simFaqCat = root.querySelector('#similar-faq-category')
            const simFaqConf = root.querySelector('#similar-faq-confidence')

            if (defaultFaq) {
              if (simFaqTitle) simFaqTitle.textContent = defaultFaq.title
              if (simFaqDesc) simFaqDesc.textContent = defaultFaq.content.slice(0, 100) + '...'
              if (simFaqCat) simFaqCat.textContent = getCatName(defaultFaq.category_id)
              if (simFaqConf) {
                simFaqConf.textContent = defaultFaq.category_id === selectedCategory ? 'Category FAQ' : 'Standard FAQ'
                simFaqConf.className = 'text-[10px] text-on-surface-variant uppercase font-medium'
              }
              const currentFaqCard = root.querySelector('#similar-faq-card') as HTMLElement | null
              if (currentFaqCard) {
                const clone = currentFaqCard.cloneNode(true) as HTMLElement
                currentFaqCard.parentNode?.replaceChild(clone, currentFaqCard)
                clone.addEventListener('click', () => navigate(`/faq/${defaultFaq.id}`))
              }
            }

            const discRes = await discussionsApi.list({ page_size: '50' })
            const discussions = discRes.items
            
            const catTokens = getCleanTokens(selectedCategoryName)
            const matchedDisc = discussions.find(d => {
              const dTokens = getCleanTokens(d.title + ' ' + (d.description || ''))
              return catTokens.some(t => dTokens.includes(t))
            })
            const defaultDisc = matchedDisc || discussions[0]

            const simDiscTitle = root.querySelector('#similar-discussion-title')
            const simDiscDesc = root.querySelector('#similar-discussion-desc')
            const simDiscCat = root.querySelector('#similar-discussion-category')
            const simDiscConf = root.querySelector('#similar-discussion-confidence')

            if (defaultDisc) {
              if (simDiscTitle) simDiscTitle.textContent = defaultDisc.title
              if (simDiscDesc) simDiscDesc.textContent = defaultDisc.description?.slice(0, 100) || 'Active community discussion thread.'
              if (simDiscCat) simDiscCat.textContent = getDiscussionCategoryName(defaultDisc.title)
              if (simDiscConf) {
                simDiscConf.textContent = matchedDisc ? 'Category Discussion' : 'Standard Discussion'
                simDiscConf.className = 'text-[10px] text-on-surface-variant uppercase font-medium'
              }
              const currentDiscCard = root.querySelector('#similar-discussion-card') as HTMLElement | null
              if (currentDiscCard) {
                const clone = currentDiscCard.cloneNode(true) as HTMLElement
                currentDiscCard.parentNode?.replaceChild(clone, currentDiscCard)
                clone.addEventListener('click', () => navigate(`/discussions/${defaultDisc.id}`))
              }
            }
          } catch (err) {
            console.error('[AskPage] Baseline load failed:', err)
          }
          return
        }

        try {
          const faqRes = await faqsApi.list({ page_size: '150' })
          const faqs = faqRes.items

          let bestFaq: any = null
          let highestMatchPct = 0

          faqs.forEach(faq => {
            const faqTokens = getCleanTokens(faq.title)
            const intersection = queryTokens.filter(t => faqTokens.includes(t))
            if (intersection.length > 0) {
              const matchPct = Math.round((intersection.length / queryTokens.length) * 100)
              if (matchPct > highestMatchPct) {
                highestMatchPct = matchPct
                bestFaq = faq
              }
            }
          })

          if (bestFaq && highestMatchPct >= 70) {
            if (bestMatchSec) bestMatchSec.style.display = ''
            if (bestMatchPct) bestMatchPct.textContent = `${highestMatchPct}% Match`
            if (bestMatchTitle) bestMatchTitle.textContent = bestFaq.title
            if (bestMatchDesc) bestMatchDesc.textContent = bestFaq.content.slice(0, 150) + '...'
            
            const currentBestCard = root.querySelector('#best-faq-match-card') as HTMLElement | null
            if (currentBestCard) {
              const clone = currentBestCard.cloneNode(true) as HTMLElement
              currentBestCard.parentNode?.replaceChild(clone, currentBestCard)
              clone.addEventListener('click', () => navigate(`/faq/${bestFaq.id}`))
            }
          } else {
            if (bestMatchSec) bestMatchSec.style.display = 'none'
          }

          // Dynamic Match Analysis Row
          const simFaqTitle = root.querySelector('#similar-faq-title')
          const simFaqDesc = root.querySelector('#similar-faq-desc')
          const simFaqCat = root.querySelector('#similar-faq-category')
          const simFaqConf = root.querySelector('#similar-faq-confidence')

          if (bestFaq && highestMatchPct >= 25) {
            if (simFaqTitle) simFaqTitle.textContent = bestFaq.title
            if (simFaqDesc) simFaqDesc.textContent = bestFaq.content.slice(0, 100) + '...'
            if (simFaqCat) simFaqCat.textContent = getCatName(bestFaq.category_id)
            if (simFaqConf) {
              simFaqConf.textContent = `${highestMatchPct}% Confidence`
              simFaqConf.className = 'text-[10px] text-secondary-container uppercase font-bold'
            }
            
            const currentFaqCard = root.querySelector('#similar-faq-card') as HTMLElement | null
            if (currentFaqCard) {
              const clone = currentFaqCard.cloneNode(true) as HTMLElement
              currentFaqCard.parentNode?.replaceChild(clone, currentFaqCard)
              clone.addEventListener('click', () => navigate(`/faq/${bestFaq.id}`))
            }
          } else {
            const defaultFaq = faqs.find(f => f.category_id === selectedCategory) || faqs[0]
            if (defaultFaq) {
              if (simFaqTitle) simFaqTitle.textContent = defaultFaq.title
              if (simFaqDesc) simFaqDesc.textContent = defaultFaq.content.slice(0, 100) + '...'
              if (simFaqCat) simFaqCat.textContent = getCatName(defaultFaq.category_id)
              if (simFaqConf) {
                simFaqConf.textContent = defaultFaq.category_id === selectedCategory ? 'Category FAQ' : 'Standard FAQ'
                simFaqConf.className = 'text-[10px] text-on-surface-variant uppercase font-medium'
              }
              
              const currentFaqCard = root.querySelector('#similar-faq-card') as HTMLElement | null
              if (currentFaqCard) {
                const clone = currentFaqCard.cloneNode(true) as HTMLElement
                currentFaqCard.parentNode?.replaceChild(clone, currentFaqCard)
                clone.addEventListener('click', () => navigate(`/faq/${defaultFaq.id}`))
              }
            }
          }

          // Similar Discussion matching
          const discRes = await discussionsApi.list({ page_size: '50' })
          const discussions = discRes.items

          let bestDisc: any = null
          let highestDiscMatch = 0

          discussions.forEach(d => {
            const dTokens = getCleanTokens(d.title)
            const intersection = queryTokens.filter(t => dTokens.includes(t))
            if (intersection.length > 0) {
              const pct = Math.round((intersection.length / queryTokens.length) * 100)
              if (pct > highestDiscMatch) {
                highestDiscMatch = pct
                bestDisc = d
              }
            }
          })

          const simDiscTitle = root.querySelector('#similar-discussion-title')
          const simDiscDesc = root.querySelector('#similar-discussion-desc')
          const simDiscCat = root.querySelector('#similar-discussion-category')
          const simDiscConf = root.querySelector('#similar-discussion-confidence')

          if (bestDisc && highestDiscMatch >= 25) {
            if (simDiscTitle) simDiscTitle.textContent = bestDisc.title
            if (simDiscDesc) simDiscDesc.textContent = bestDisc.description?.slice(0, 100) || 'Active discussion thread.'
            if (simDiscCat) simDiscCat.textContent = getDiscussionCategoryName(bestDisc.title)
            if (simDiscConf) {
              simDiscConf.textContent = `${highestDiscMatch}% Relevance`
              simDiscConf.className = 'text-[10px] text-primary uppercase font-bold'
            }
            
            const currentDiscCard = root.querySelector('#similar-discussion-card') as HTMLElement | null
            if (currentDiscCard) {
              const clone = currentDiscCard.cloneNode(true) as HTMLElement
              currentDiscCard.parentNode?.replaceChild(clone, currentDiscCard)
              clone.addEventListener('click', () => navigate(`/discussions/${bestDisc.id}`))
            }
          } else {
            const defaultDisc = discussions.find(d => {
              const dTokens = getCleanTokens(d.title + ' ' + (d.description || ''))
              return getCleanTokens(selectedCategoryName).some(t => dTokens.includes(t))
            }) || discussions[0]

            if (defaultDisc) {
              if (simDiscTitle) simDiscTitle.textContent = defaultDisc.title
              if (simDiscDesc) simDiscDesc.textContent = defaultDisc.description?.slice(0, 100) || 'Active community discussion thread.'
              if (simDiscCat) simDiscCat.textContent = getDiscussionCategoryName(defaultDisc.title)
              if (simDiscConf) {
                simDiscConf.textContent = defaultDisc.title.toLowerCase().includes(selectedCategoryName.toLowerCase().split(' ')[0]) ? 'Category Discussion' : 'Standard Discussion'
                simDiscConf.className = 'text-[10px] text-on-surface-variant uppercase font-medium'
              }

              const currentDiscCard = root.querySelector('#similar-discussion-card') as HTMLElement | null
              if (currentDiscCard) {
                const clone = currentDiscCard.cloneNode(true) as HTMLElement
                currentDiscCard.parentNode?.replaceChild(clone, currentDiscCard)
                clone.addEventListener('click', () => navigate(`/discussions/${defaultDisc.id}`))
              }
            }
          }

          // Update AI Draft Sidebar Info dynamically
          const aiDraftText = root.querySelector('.bg-primary\\/5 italic')
          const aiDraftConfidence = root.querySelector('.bg-primary\\/5 .text-primary')
          const aiDraftBar = root.querySelector('.bg-primary\\/5 .bg-primary') as HTMLElement | null

          if (aiDraftText) {
            aiDraftText.textContent = bestFaq && highestMatchPct >= 70 
              ? `\"AI duplicate scan matched: ${bestFaq.title}. Draft: ${bestFaq.content.slice(0, 100)}...\"`
              : `\"Our AI can draft a response immediately after you submit to get you started while the community chimes in.\"`
          }
          if (aiDraftConfidence) aiDraftConfidence.textContent = `${score}%`
          if (aiDraftBar) aiDraftBar.style.width = `${score}%`

        } catch (err) {
          console.error('[AskPage] Similar search failed:', err)
        }
      }, 400)
    }

    // Bind inputs
    titleInput?.addEventListener('input', updateRealTimeAnalysis)
    descInput?.addEventListener('input', updateRealTimeAnalysis)

    // Pre-seed categories click
    if (catWrapper) {
      try {
        allCategories = await categoriesApi.list()
        const cats = allCategories
        catWrapper.innerHTML = ''
        cats.forEach((cat, idx) => {
          const btn = document.createElement('button')
          btn.className = 'px-6 py-2 rounded-full border border-outline-variant hover:border-primary/50 text-on-surface-variant font-label-md transition-all active:scale-95'
          btn.textContent = cat.name
          btn.addEventListener('click', (e) => {
            e.preventDefault()
            catWrapper.querySelectorAll('button').forEach((b) => {
              b.className = 'px-6 py-2 rounded-full border border-outline-variant hover:border-primary/50 text-on-surface-variant font-label-md transition-all active:scale-95'
            })
            btn.className = 'px-6 py-2 rounded-full border border-primary bg-primary/10 text-primary font-label-md transition-all active:scale-95'
            selectedCategory = cat.id
            selectedCategoryName = cat.name
            updateExampleQuestions(cat.name)
            updateRealTimeAnalysis()
          })
          catWrapper.appendChild(btn)

          if (idx === 0) {
            btn.click()
          }
        })
      } catch (err) {
        console.error('Failed to load categories', err)
      }
    }

    // ─── Submission ──────────────────────────────────────────────────────────
    if (submitBtn) {
      submitBtn.addEventListener('click', async (e) => {
        e.preventDefault()
        const title = titleInput?.value?.trim() || ''
        const titleWords = title.split(/\s+/).filter(w => w.length > 0).length
        const isGibberish = /(.)\1{4,}/.test(title)

        if (title.length < 10 || titleWords < 3 || isGibberish) {
          titleInput?.focus()
          return
        }

        submitBtn.textContent = 'Submitting...'
        submitBtn.setAttribute('disabled', 'true')

        try {
          const q = await questionsApi.create({
            title,
            description: descInput?.value?.trim() || undefined,
            category_id: selectedCategory || undefined,
          })
          navigate(`/analysis/${q.id}`)
        } catch {
          submitBtn.textContent = 'Submit Question'
          submitBtn.removeAttribute('disabled')
        }
      })
    }
  }, [navigate, showBanner])

  return (
    <StitchPage
      bodyHtml={bodyHtml}
      pageStyles={pageStyles}
      title="CrowdMind | Ask a Question"
      navMap={commonUserNav}
    />
  )
}
