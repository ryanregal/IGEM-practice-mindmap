import './main.css'

// App initialization
document.addEventListener('DOMContentLoaded', () => {
  console.log('APP initialized')
  
  // Navigation menu toggle
  const navToggle = document.querySelector('.nav-toggle')
  const navMenu = document.querySelector('.nav-menu')
  
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navMenu?.classList.toggle('active')
    })
  }
  
  // Close mobile menu when a link is clicked
  document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu?.classList.remove('active')
    })
  })

  // Quizlet-style flip cards handling
  const cardSettings = {
    card1: {
      inputName: 'q1',
      correctValue: 'b',
      correctText: 'Move to higher ground immediately',
      explanation: 'During a flood warning, moving to higher ground keeps you safe and gives rescue teams room to help.'
    },
    card2: {
      inputName: 'q2',
      correctValue: 'a',
      correctText: 'Bottled water and first aid supplies',
      explanation: 'A solid emergency kit should include clean water, first aid, and essential supplies.'
    },
    card3: {
      inputName: 'q3',
      correctValue: 'a',
      correctText: 'Stay calm and act proactively',
      explanation: 'A calm mindset helps you make safer decisions and avoid panic during flood preparation.'
    }
  }

  function updateCardBack(cardId, inputName, correctValue, correctText, explanation) {
    const card = document.getElementById(cardId)
    if (!card) return

    const selected = document.querySelector(`input[name="${inputName}"]:checked`)
    const feedbackText = card.querySelector('.quiz-back-feedback')
    const correctLabel = card.querySelector('.quiz-back-correct')

    if (selected && selected.value === correctValue) {
      correctLabel.textContent = `Correct: ${correctText}`
      feedbackText.textContent = `Nice work! ${explanation}`
      feedbackText.classList.remove('text-red-600')
      feedbackText.classList.add('text-text-dark')
    } else if (selected) {
      correctLabel.textContent = `Correct: ${correctText}`
      feedbackText.textContent = `That option is not the best choice. ${explanation}`
      feedbackText.classList.remove('text-text-dark')
      feedbackText.classList.add('text-red-600')
    } else {
      correctLabel.textContent = `Correct: ${correctText}`
      feedbackText.textContent = `No answer selected. Choose one answer and flip the card again to check it.`
      feedbackText.classList.remove('text-red-600')
      feedbackText.classList.add('text-text-dark')
    }
  }

  const quizCardOrder = ['card-1', 'card-2', 'card-3']
  document.querySelectorAll('.quiz-flip-btn').forEach(button => {
    button.addEventListener('click', () => {
      const cardId = button.dataset.card
      const card = document.getElementById(cardId)
      const inputName = button.dataset.input

      if (!card) return
      const isFront = !card.classList.contains('flipped')
      card.classList.toggle('flipped')

      if (isFront && inputName) {
        const settings = Object.values(cardSettings).find(setting => setting.inputName === inputName)
        if (settings) {
          updateCardBack(cardId, settings.inputName, settings.correctValue, settings.correctText, settings.explanation)
        }

        const currentIndex = quizCardOrder.indexOf(cardId)
        const nextCardId = quizCardOrder[currentIndex + 1]
        if (nextCardId) {
          window.setTimeout(() => {
            const nextCard = document.getElementById(nextCardId)
            const nextButton = nextCard?.querySelector('[data-input]')
            nextCard?.scrollIntoView({ behavior: 'smooth', block: 'center' })
            nextButton?.focus()
          }, 300)
        }
      }
    })
  })

  const quizReset = document.getElementById('quiz-reset')
  if (quizReset) {
    quizReset.addEventListener('click', () => {
      document.querySelectorAll('.flip-card').forEach(card => card.classList.remove('flipped'))
      document.querySelectorAll('input[type="radio"]').forEach(input => (input.checked = false))
      document.querySelectorAll('.quiz-back-feedback').forEach(feedback => {
        feedback.textContent = 'Flip the card and choose an answer to check your response.'
        feedback.classList.remove('text-red-600')
        feedback.classList.add('text-text-dark')
      })
    })
  }
})

// Export utility functions
export const utils = {
  // DOM helpers
  query: (selector) => document.querySelector(selector),
  queryAll: (selector) => document.querySelectorAll(selector),
  
  // Class helpers
  addClass: (el, className) => el?.classList.add(className),
  removeClass: (el, className) => el?.classList.remove(className),
  toggleClass: (el, className) => el?.classList.toggle(className),
  
  // Loading animation control
  showLoading() {
    const overlay = document.getElementById('loading-overlay')
    const video = document.getElementById('loading-video')
    
    if (overlay) {
      overlay.classList.add('active')
    }
    
    if (video) {
      video.play().catch(e => console.log('Video play failed:', e))
    }
  },
  
  hideLoading() {
    const overlay = document.getElementById('loading-overlay')
    const video = document.getElementById('loading-video')
    
    if (overlay) {
      overlay.classList.remove('active')
    }
    
    if (video) {
      video.pause()
      video.currentTime = 0 // Reset to start
    }
  },
  
  // Loading wrapper for async operations
  async withLoading(asyncFn, minDuration = 4000) {
    this.showLoading()
    const startTime = Date.now()
    
    try {
      const result = await asyncFn()
      const elapsed = Date.now() - startTime
      const remaining = Math.max(0, minDuration - elapsed)
      
      if (remaining > 0) {
        await new Promise(resolve => setTimeout(resolve, remaining))
      }
      
      return result
    } finally {
      this.hideLoading()
    }
  },
  
  // API 数据获取
  async fetchData(url) {
    try {
      const response = await fetch(url)
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error('Fetch error:', error)
      throw error
    }
  }
}
