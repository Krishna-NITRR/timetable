// Deep Work Timetable Application JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initializeTimetable();
    
    // Add event listeners
    setupEventListeners();
    
    // Add accessibility enhancements
    enhanceAccessibility();
});

/**
 * Initialize the timetable application
 */
function initializeTimetable() {
    // Add current date to the header
    updateCurrentDate();
    
    // Calculate and display total study hours
    calculateStudyHours();
    
    // Add hover effects and interactions
    addInteractiveEffects();
}

/**
 * Setup event listeners for interactive elements
 */
function setupEventListeners() {
    // Print button functionality
    const printButton = document.querySelector('.print-btn');
    if (printButton) {
        printButton.addEventListener('click', printTimetable);
    }
    
    // Keyboard navigation for time slots
    const timeSlots = document.querySelectorAll('.time-slot');
    timeSlots.forEach(slot => {
        slot.setAttribute('tabindex', '0');
        slot.addEventListener('keydown', handleSlotKeydown);
    });
}

/**
 * Handle printing of the timetable
 */
function printTimetable() {
    // Prepare the page for printing
    document.body.classList.add('print-mode');
    
    // Add print-specific styles
    const printStyles = `
        <style id="print-styles">
            @page {
                size: A4 landscape;
                margin: 0.5in;
            }
            
            .print-mode .timetable-grid {
                font-size: 10px !important;
            }
            
            .print-mode .time-slot {
                padding: 6px !important;
                margin-bottom: 2px !important;
            }
            
            .print-mode .time {
                font-size: 9px !important;
            }
            
            .print-mode .activity {
                font-size: 10px !important;
            }
            
            .print-mode .description {
                font-size: 8px !important;
            }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', printStyles);
    
    // Trigger print dialog
    setTimeout(() => {
        window.print();
        
        // Clean up after printing
        document.body.classList.remove('print-mode');
        const printStyleElement = document.getElementById('print-styles');
        if (printStyleElement) {
            printStyleElement.remove();
        }
    }, 100);
}

/**
 * Update the header with current date information
 */
function updateCurrentDate() {
    const header = document.querySelector('.timetable-header');
    const currentDate = new Date();
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        weekday: 'long'
    };
    const formattedDate = currentDate.toLocaleDateString('en-US', options);
    
    // Create date element
    const dateElement = document.createElement('p');
    dateElement.className = 'current-date';
    dateElement.style.cssText = `
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
        margin-top: var(--space-8);
        font-weight: 500;
    `;
    dateElement.textContent = `Today: ${formattedDate}`;
    
    // Insert after subtitle
    const subtitle = header.querySelector('.subtitle');
    if (subtitle) {
        subtitle.insertAdjacentElement('afterend', dateElement);
    }
}

/**
 * Calculate and display total study hours
 */
function calculateStudyHours() {
    const scheduleData = {
        deepWorkHours: {
            'Monday': 9,     // 4 + 2 + 3
            'Tuesday': 6.5,  // 3.5 + 3
            'Wednesday': 5.5, // 2.5 + 3
            'Thursday': 11,  // 4 + 2 + 3 + 3
            'Friday': 9,     // 4 + 2 + 3
            'Saturday': 12,  // 4 + 2 + 3 + 3
            'Sunday': 12     // 4 + 2 + 3 + 3
        },
        classHours: {
            'Monday': 3.33,  // 2:10-5:30
            'Tuesday': 7.67, // 9:50-5:30
            'Wednesday': 8.25, // 9:15-5:30
            'Thursday': 0,   // Optional
            'Friday': 3.5,   // 2:00-5:30
            'Saturday': 0,
            'Sunday': 0
        },
        secondaryHours: {
            'Monday': 1,
            'Tuesday': 1,
            'Wednesday': 1,
            'Thursday': 1,
            'Friday': 1,
            'Saturday': 1,
            'Sunday': 1
        }
    };
    
    // Calculate totals
    const totalDeepWork = Object.values(scheduleData.deepWorkHours).reduce((a, b) => a + b, 0);
    const totalClasses = Object.values(scheduleData.classHours).reduce((a, b) => a + b, 0);
    const totalSecondary = Object.values(scheduleData.secondaryHours).reduce((a, b) => a + b, 0);
    
    // Create summary element
    const summaryElement = document.createElement('div');
    summaryElement.className = 'hours-summary';
    summaryElement.style.cssText = `
        display: flex;
        justify-content: center;
        gap: var(--space-24);
        margin-top: var(--space-16);
        padding: var(--space-12);
        background: var(--color-bg-1);
        border-radius: var(--radius-base);
        font-size: var(--font-size-sm);
        font-weight: 500;
    `;
    
    summaryElement.innerHTML = `
        <div class="summary-item">
            <span style="color: #2563eb;">📚 Deep Work:</span> ${totalDeepWork}h/week
        </div>
        <div class="summary-item">
            <span style="color: #6b7280;">🏫 Classes:</span> ${totalClasses.toFixed(1)}h/week
        </div>
        <div class="summary-item">
            <span style="color: #ea580c;">💼 Secondary:</span> ${totalSecondary}h/week
        </div>
    `;
    
    // Add to header
    const header = document.querySelector('.timetable-header');
    header.appendChild(summaryElement);
}

/**
 * Add interactive effects to time slots
 */
function addInteractiveEffects() {
    const timeSlots = document.querySelectorAll('.time-slot');
    
    timeSlots.forEach(slot => {
        // Add focus indicator
        slot.addEventListener('focus', function() {
            this.style.outline = '3px solid var(--color-focus-ring)';
            this.style.outlineOffset = '2px';
        });
        
        slot.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
        
        // Add click feedback
        slot.addEventListener('click', function() {
            // Create ripple effect
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (event.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (event.clientY - rect.top - size / 2) + 'px';
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add CSS animation for ripple effect
    if (!document.getElementById('ripple-animation')) {
        const style = document.createElement('style');
        style.id = 'ripple-animation';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Handle keyboard navigation for time slots
 */
function handleSlotKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        this.click();
        
        // Provide audio feedback for screen readers
        announceSlot(this);
    }
}

/**
 * Announce slot details for accessibility
 */
function announceSlot(slot) {
    const time = slot.querySelector('.time')?.textContent || '';
    const activity = slot.querySelector('.activity')?.textContent || '';
    const description = slot.querySelector('.description')?.textContent || '';
    
    const announcement = `${time}, ${activity}, ${description}`;
    
    // Create temporary announcement element for screen readers
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.style.cssText = `
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
    `;
    announcer.textContent = announcement;
    
    document.body.appendChild(announcer);
    setTimeout(() => announcer.remove(), 1000);
}

/**
 * Enhance accessibility features
 */
function enhanceAccessibility() {
    // Add aria-labels to time slots
    const timeSlots = document.querySelectorAll('.time-slot');
    timeSlots.forEach(slot => {
        const time = slot.querySelector('.time')?.textContent || '';
        const activity = slot.querySelector('.activity')?.textContent || '';
        const description = slot.querySelector('.description')?.textContent || '';
        
        slot.setAttribute('aria-label', `${time}: ${activity} - ${description}`);
        slot.setAttribute('role', 'button');
    });
    
    // Add navigation instructions
    const instructions = document.createElement('div');
    instructions.className = 'sr-only';
    instructions.textContent = 'Use Tab to navigate between time slots. Press Enter or Space to interact with a slot.';
    document.body.insertBefore(instructions, document.body.firstChild);
    
    // Add landmark roles
    const header = document.querySelector('.timetable-header');
    const main = document.querySelector('.timetable-grid');
    const footer = document.querySelector('.quotes-section');
    
    if (header) header.setAttribute('role', 'banner');
    if (main) main.setAttribute('role', 'main');
    if (footer) footer.setAttribute('role', 'contentinfo');
}

/**
 * Utility function to get current week dates
 */
function getCurrentWeekDates() {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const monday = new Date(today);
    monday.setDate(today.getDate() - currentDay + (currentDay === 0 ? -6 : 1));
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);
        weekDates.push(date);
    }
    
    return weekDates;
}

/**
 * Highlight current day if viewing current week
 */
function highlightCurrentDay() {
    const today = new Date();
    const currentDayName = today.toLocaleDateString('en-US', { weekday: 'long' });
    
    const dayHeaders = document.querySelectorAll('.day-header');
    dayHeaders.forEach(header => {
        if (header.textContent === currentDayName) {
            header.style.background = 'var(--color-success)';
            header.style.position = 'relative';
            header.innerHTML += '<span style="position: absolute; top: 2px; right: 8px; font-size: 12px;">TODAY</span>';
        }
    });
}

// Initialize current day highlighting
document.addEventListener('DOMContentLoaded', highlightCurrentDay);

// Export functions for testing purposes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        printTimetable,
        calculateStudyHours,
        getCurrentWeekDates,
        highlightCurrentDay
    };
}