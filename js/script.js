// Vision Optics - Master JavaScript

// Shared Business Config
const BUSINESS_CONFIG = Object.freeze({
    whatsappNumber: "919898174744",
    storeName: "Vision Optics"
});

// Timer references for memory leak prevention
let messageTimeoutId = null;
let messageRemoveTimeoutId = null;
let whatsappTimeoutId = null;

// Form validation helper
function validateForm() {
    const name = document.getElementById("name");
    const phone = document.getElementById("phone");
    const message = document.getElementById("message");
    
    if (!name || !phone) return false;
    
    let isValid = true;
    
    // Clear previous error states
    if (name) name.classList.remove('error', 'success');
    if (phone) phone.classList.remove('error', 'success');
    if (message) message.classList.remove('error', 'success');
    
    // Validate name
    if (!name.value.trim()) {
        name.classList.add('error');
        isValid = false;
    } else {
        name.classList.add('success');
    }
    
    // Validate phone
    const cleanPhone = phone.value.replace(/[^0-9]/g, "");
    const phoneError = document.getElementById("phone-error");
    
    // Check if intlTelInput is active
    if (window.iti) {
        if (window.iti.isValidNumber()) {
            phone.classList.add('success');
            if (phoneError) phoneError.style.display = "none";
        } else {
            phone.classList.add('error');
            if (phoneError) phoneError.style.display = "block";
            isValid = false;
        }
    } else {
        // Fallback standard 7-15 digit phone validation
        const phoneRegex = /^[0-9]{7,15}$/;
        if (!cleanPhone || !phoneRegex.test(cleanPhone)) {
            phone.classList.add('error');
            isValid = false;
        } else {
            phone.classList.add('success');
        }
    }
    
    // Message field validation (optional but success marked if filled)
    if (message && message.value.trim()) {
        message.classList.add('success');
    }
    
    return isValid;
}

// Show animated status message with timer cleanup to avoid memory leaks
function showMessage(text, type) {
    if (messageTimeoutId) clearTimeout(messageTimeoutId);
    if (messageRemoveTimeoutId) clearTimeout(messageRemoveTimeoutId);

    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageEl = document.createElement('div');
    messageEl.className = `form-message ${type}`;
    messageEl.textContent = text;
    
    const form = document.getElementById('enquiryForm');
    if (form && form.parentNode) {
        form.parentNode.insertBefore(messageEl, form.nextSibling);
    } else {
        document.body.appendChild(messageEl);
    }
    
    // Auto remove after 4 seconds
    messageTimeoutId = setTimeout(() => {
        if (messageEl.parentNode) {
            messageEl.style.animation = 'slideDown .4s ease reverse';
            messageRemoveTimeoutId = setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.remove();
                }
            }, 400);
        }
    }, 4000);
}

// WhatsApp Form Submission Handler
function sendToWhatsApp(e) {
    if (e && e.preventDefault) e.preventDefault();
    
    const form = document.getElementById("enquiryForm");
    const button = (form && form.querySelector('button[type="button"], button[type="submit"]')) || (e ? e.currentTarget : null);
    
    // Validate form
    if (!validateForm()) {
        showMessage('❌ Please enter a valid name and phone number', 'error');
        return;
    }
    
    const nameEl = document.getElementById("name");
    const phoneEl = document.getElementById("phone");
    const serviceEl = document.getElementById("service");
    const messageEl = document.getElementById("message");
    
    const name = nameEl ? nameEl.value.trim() : "";
    let phone = phoneEl ? phoneEl.value.trim() : "";
    if (window.iti && window.iti.isValidNumber()) {
        phone = window.iti.getNumber();
    }
    const service = serviceEl ? serviceEl.value : "General Enquiry";
    const message = messageEl ? messageEl.value.trim() : "";
    
    // Add loading state to button
    if (button) {
        button.classList.add('loading');
        button.disabled = true;
    }
    
    if (whatsappTimeoutId) clearTimeout(whatsappTimeoutId);

    whatsappTimeoutId = setTimeout(() => {
        const text = `Hello ${BUSINESS_CONFIG.storeName},\n\n` +
                     `*Name:* ${name}\n` +
                     `*Phone:* ${phone}\n` +
                     `*Service Required:* ${service}\n\n` +
                     `*Message:* ${message || 'No additional message'}`;
        
        const url = `https://wa.me/${BUSINESS_CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`;
        
        showMessage('✓ Opening WhatsApp...', 'success');
        
        if (button) {
            button.classList.remove('loading');
            button.disabled = false;
        }
        
        if (form) form.reset();
        
        window.open(url, "_blank");
    }, 600);
}

// Collection Filter & Mobile Navigation Setup
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('enquiryForm');

    // Clear validation state on user input using event delegation
    if (form) {
        form.addEventListener('focusin', function(e) {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                e.target.classList.remove('error', 'success');
            }
        });

        form.addEventListener('input', function(e) {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                e.target.classList.remove('error', 'success');
            }
        });

        // Enter key form submit
        form.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
                const btn = form.querySelector('button');
                if (btn) btn.click();
            }
        });
    }

    // Auto-close mobile menu when clicking nav links using event delegation
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (menuToggle && navLinks) {
        navLinks.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                menuToggle.checked = false;
            }
        });
    }

    // Interactive Collection Filter Tabs using event delegation (for collection.html)
    const filterContainer = document.querySelector('.filter-container');
    if (filterContainer) {
        const filterBtns = Array.from(filterContainer.querySelectorAll('.filter-btn'));
        const collectionItems = Array.from(document.querySelectorAll('.collection-card'));

        if (filterBtns.length > 0 && collectionItems.length > 0) {
            filterContainer.addEventListener('click', function(e) {
                const btn = e.target.closest('.filter-btn');
                if (!btn) return;

                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                collectionItems.forEach(item => {
                    const category = item.getAttribute('data-category');
                    if (filterValue === 'all' || category === filterValue) {
                        item.style.display = 'block';
                        item.style.animation = 'fadeIn 0.4s ease forwards';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        }
    }
});
