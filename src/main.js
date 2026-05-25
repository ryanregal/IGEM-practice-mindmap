import './main.css'

// Function to fetch sensor data from backend
async function fetchSensorData() {
  try {
    const response = await fetch('/api/sensor-data', { cache: 'no-store' });
    const data = await response.json();
    updateSensorDisplay(data);
  } catch (error) {
    console.error('Error fetching sensor data:', error);
  }
}

// Function to update sensor display on page
function updateSensorDisplay(data) {
  const waterLevelEl = document.getElementById('waterLevel');
  const temperatureEl = document.getElementById('temperature');
  const rainfallEl = document.getElementById('rainfall');
  const alertEl = document.getElementById('alert');

  if (waterLevelEl) waterLevelEl.textContent = `${data.waterLevel.toFixed(2)} cm`;
  if (temperatureEl) temperatureEl.textContent = `${data.temperature.toFixed(2)} °C`;
  if (rainfallEl) rainfallEl.textContent = `${data.rainfall.toFixed(2)} mm`;
  if (alertEl) {
    alertEl.textContent = data.alert;
    alertEl.className = data.alert === 'Flood Alert' ? 'text-red-500 font-bold' : 'text-green-500';
  }
}

// App initialization
document.addEventListener('DOMContentLoaded', () => {
  console.log('APP initialized')

  const hasSensorDisplay = ['waterLevel', 'temperature', 'rainfall', 'alert']
    .some(id => document.getElementById(id))

  if (hasSensorDisplay) {
    // Fetch initial sensor data
    fetchSensorData();

    // Update sensor data every 3 seconds
    setInterval(fetchSensorData, 3000);
  }
  
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

  const correctIcon = `
    <svg class="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
    </svg>
  `

  const wrongIcon = `
    <svg class="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
    </svg>
  `

  function setFrontMessage(card, message = '') {
    let messageEl = card.querySelector('.quiz-front-message')
    const button = card.querySelector('[data-input]')

    if (!messageEl && button) {
      messageEl = document.createElement('p')
      messageEl.className = 'quiz-front-message mt-3 text-sm font-medium text-red-600'
      button.insertAdjacentElement('beforebegin', messageEl)
    }

    if (messageEl) {
      messageEl.textContent = message
      messageEl.classList.toggle('hidden', !message)
    }
  }

  function updateCardBack(cardId, inputName, correctValue, correctText, explanation) {
    const card = document.getElementById(cardId)
    if (!card) return false

    const selected = document.querySelector(`input[name="${inputName}"]:checked`)
    if (!selected) {
      setFrontMessage(card, 'Please choose an answer before checking.')
      return false
    }

    const feedbackText = card.querySelector('.quiz-back-feedback')
    const correctLabel = card.querySelector('.quiz-back-correct')
    const resultTitle = card.querySelector('.quiz-result-title')
    const resultIcon = card.querySelector('.quiz-result-icon')
    const isCorrect = selected.value === correctValue

    setFrontMessage(card)

    if (resultIcon) {
      resultIcon.innerHTML = isCorrect ? correctIcon : wrongIcon
    }

    if (resultTitle) {
      resultTitle.textContent = isCorrect ? 'Correct!' : 'Not quite yet'
      resultTitle.classList.toggle('text-green-600', isCorrect)
      resultTitle.classList.toggle('text-red-600', !isCorrect)
    }

    if (correctLabel) {
      correctLabel.textContent = `Correct answer: ${correctText}`
    }

    if (feedbackText) {
      feedbackText.textContent = isCorrect
        ? `Nice work! ${explanation}`
        : `Good try. ${explanation} Keep going and complete the full quiz so you can check your overall flood preparedness.`
      feedbackText.classList.remove('text-red-600')
      feedbackText.classList.add('text-text-dark')
    }

    return true
  }

  const quizCardOrder = ['card-1', 'card-2', 'card-3']
  document.querySelectorAll('.quiz-flip-btn').forEach(button => {
    button.addEventListener('click', () => {
      const cardId = button.dataset.card
      const card = document.getElementById(cardId)
      const inputName = button.dataset.input

      if (!card) return
      const isFront = !card.classList.contains('flipped')

      if (isFront && inputName) {
        const settings = Object.values(cardSettings).find(setting => setting.inputName === inputName)
        if (settings) {
          const canFlip = updateCardBack(cardId, settings.inputName, settings.correctValue, settings.correctText, settings.explanation)
          if (!canFlip) return
        }

        card.classList.add('flipped')

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
      } else {
        card.classList.remove('flipped')
      }
    })
  })

  document.querySelectorAll('.flip-card input[type="radio"]').forEach(input => {
    input.addEventListener('change', () => {
      const card = input.closest('.flip-card')
      if (card) setFrontMessage(card)
    })
  })

  const quizReset = document.getElementById('quiz-reset')
  if (quizReset) {
    quizReset.addEventListener('click', () => {
      document.querySelectorAll('.flip-card').forEach(card => card.classList.remove('flipped'))
      document.querySelectorAll('input[type="radio"]').forEach(input => (input.checked = false))
      document.querySelectorAll('.quiz-front-message').forEach(message => {
        message.textContent = ''
        message.classList.add('hidden')
      })
      document.querySelectorAll('.quiz-result-icon').forEach(icon => {
        icon.innerHTML = correctIcon
      })
      document.querySelectorAll('.quiz-result-title').forEach(title => {
        title.textContent = 'Correct!'
        title.classList.remove('text-red-600')
        title.classList.add('text-green-600')
      })
      document.querySelectorAll('.quiz-back-feedback').forEach(feedback => {
        feedback.textContent = 'Choose an answer and check your response.'
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
