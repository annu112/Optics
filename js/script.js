// Form validation helper
function validateForm() {
    const name = document.getElementById("name");
    const phone = document.getElementById("phone");
    const message = document.getElementById("message");
    
    let isValid = true;
    
    // Clear previous error states
    [name, phone, message].forEach(el => el.classList.remove('error', 'success'));
    
    // Validate name
    if (!name.value.trim()) {
        name.classList.add('error');
        isValid = false;
    } else {
        name.classList.add('success');
    }
    
    // Validate phone
    const phoneRegex = /^[0-9]{10}$/;
    if (!phone.value.trim() || !phoneRegex.test(phone.value.trim())) {
        phone.classList.add('error');
        isValid = false;
    } else {
        phone.classList.add('success');
    }
    
    // Optional: Validate message
    if (message.value.trim()) {
        message.classList.add('success');
    }
    
    return isValid;
}

// Show message with animation
function showMessage(text, type) {
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageEl = document.createElement('div');
    messageEl.className = `form-message ${type}`;
    messageEl.textContent = text;
    
    const form = document.getElementById('enquiryForm');
    form.parentNode.insertBefore(messageEl, form.nextSibling);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        if (messageEl.parentNode) {
            messageEl.style.animation = 'slideDown .4s ease reverse';
            setTimeout(() => messageEl.remove(), 400);
        }
    }, 4000);
}

// Clear form validation states on input
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('#enquiryForm input, #enquiryForm textarea');
    
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.classList.remove('error', 'success');
        });
        
        input.addEventListener('input', function() {
            this.classList.remove('error', 'success');
        });
    });
});

function sendToWhatsApp() {
    // Validate form
    if (!validateForm()) {
        showMessage('❌ Please fill in all required fields correctly', 'error');
        return;
    }
    
    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const service = document.getElementById("service").value;
    const message = document.getElementById("message").value.trim();
    const button = event.target;
    
    // Add loading state
    button.classList.add('loading');
    button.disabled = true;
    
    // Simulate processing (to show loading animation)
    setTimeout(() => {
        const whatsappNumber = "918999398569";
        
        const text = `Hello Lens Frame,

Name: ${name}
Phone: ${phone}

Service Required:
${service}

Message:
${message || 'No message'}`;
        
        const url = "https://wa.me/" + whatsappNumber + "?text=" + encodeURIComponent(text);
        
        // Show success message
        showMessage('✓ Opening WhatsApp...', 'success');
        
        // Remove loading state and redirect
        button.classList.remove('loading');
        button.disabled = false;
        
        // Clear form
        document.getElementById("enquiryForm").reset();
        
        // Open WhatsApp
        window.open(url, "_blank");
    }, 800);
}

// Allow form submission with Enter key
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('enquiryForm');
    if (form) {
        form.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
                document.querySelector('#enquiryForm button').click();
            }
        });
    }
});
