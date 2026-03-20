/* ============================================================
   42 West Design — chat.js
   Floating chat widget
   ============================================================ */

(function () {
  'use strict';

  /* ----- Inject Chat HTML ----- */
  const chatHTML = `
    <button id="chat-bubble" aria-label="Open Chat">
      <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 2H4C2.897 2 2 2.897 2 4v13c0 1.103.897 2 2 2h3v3l4.333-3H20c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zm0 15H10.667L7 19.5V17H4V4h16v13z"/>
      </svg>
      <span id="chat-badge">1</span>
    </button>

    <div id="chat-panel" role="dialog" aria-label="Chat with 42 West Design">
      <div class="chat-header">
        <div class="chat-avatar">42</div>
        <div class="chat-header-info">
          <strong>42 West Design</strong>
          <span>
            <span class="chat-online-dot"></span>
            Online Now
          </span>
        </div>
        <button class="chat-close-btn" aria-label="Close chat">&times;</button>
      </div>
      <div class="chat-messages" id="chat-messages"></div>
      <div class="chat-input-area">
        <input type="text" class="chat-input" id="chat-input" placeholder="Type a message…" autocomplete="off" />
        <button class="chat-send-btn" id="chat-send" aria-label="Send message">
          <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>
    </div>
  `;

  const container = document.createElement('div');
  container.innerHTML = chatHTML;
  document.body.appendChild(container);

  /* ----- References ----- */
  const bubble = document.getElementById('chat-bubble');
  const panel = document.getElementById('chat-panel');
  const badge = document.getElementById('chat-badge');
  const messagesContainer = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send');
  const closeBtn = panel.querySelector('.chat-close-btn');

  let chatOpened = false;
  let badgeTimer = null;

  /* ----- Show badge after 5s if not opened ----- */
  badgeTimer = setTimeout(() => {
    if (!chatOpened && badge) {
      badge.classList.add('show');
    }
  }, 5000);

  /* ----- Toggle Panel ----- */
  bubble.addEventListener('click', () => {
    chatOpened = true;
    badge.classList.remove('show');
    clearTimeout(badgeTimer);
    panel.classList.add('open');
    chatInput.focus();

    // Show greeting on first open
    if (messagesContainer.children.length === 0) {
      setTimeout(() => {
        addBotMessage("Hi! 👋 I'm here to help. What can 42 West Design create for you today?", true);
      }, 400);
    }
  });

  closeBtn.addEventListener('click', () => {
    panel.classList.remove('open');
  });

  /* ----- Add Messages ----- */
  function addBotMessage(text, showQuickReplies) {
    const msg = document.createElement('div');
    msg.className = 'chat-msg bot';

    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble-msg';
    bubble.textContent = text;
    msg.appendChild(bubble);

    if (showQuickReplies) {
      const qr = document.createElement('div');
      qr.className = 'chat-quick-replies';

      const replies = [
        { label: 'Website Design', value: 'website' },
        { label: 'Brand Identity', value: 'brand' },
        { label: 'Get a Quote', value: 'quote' },
        { label: 'See Portfolio', value: 'portfolio' }
      ];

      replies.forEach(reply => {
        const btn = document.createElement('button');
        btn.className = 'quick-reply-btn';
        btn.textContent = reply.label;
        btn.addEventListener('click', () => handleQuickReply(reply.value, reply.label));
        qr.appendChild(btn);
      });

      msg.appendChild(qr);
    }

    messagesContainer.appendChild(msg);
    scrollToBottom();
  }

  function addUserMessage(text) {
    const msg = document.createElement('div');
    msg.className = 'chat-msg user';
    const bbl = document.createElement('div');
    bbl.className = 'chat-bubble-msg';
    bbl.textContent = text;
    msg.appendChild(bbl);
    messagesContainer.appendChild(msg);
    scrollToBottom();
  }

  function showTyping() {
    const typing = document.createElement('div');
    typing.className = 'chat-msg bot';
    typing.id = 'typing-indicator';
    const inner = document.createElement('div');
    inner.className = 'chat-typing';
    inner.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
    typing.appendChild(inner);
    messagesContainer.appendChild(typing);
    scrollToBottom();
    return typing;
  }

  function removeTyping() {
    const t = document.getElementById('typing-indicator');
    if (t) t.remove();
  }

  function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  /* ----- Handle Quick Replies ----- */
  function handleQuickReply(value, label) {
    addUserMessage(label);

    // Remove quick reply buttons after selection
    const qrContainers = messagesContainer.querySelectorAll('.chat-quick-replies');
    qrContainers.forEach(qr => qr.remove());

    const typing = showTyping();
    setTimeout(() => {
      removeTyping();
      let response = '';
      switch (value) {
        case 'website':
          response = "We build stunning, high-converting websites! 🖥️ Our Web Design & Development service includes custom design, responsive development, SEO optimization, and CMS setup. Perfect for brands ready to make an impact online. Want to discuss your project?";
          break;
        case 'brand':
          response = "Brand identity is our passion! ✨ We craft logo systems, typography, color palettes, brand guidelines, and the full visual language your company needs to stand out. We've rebranded 150+ companies with measurable results. Ready to transform your brand?";
          break;
        case 'quote':
          response = "We'd love to give you a free, no-obligation quote! 📋 Every project is priced based on scope and timeline. Most brand identity projects start at $3,500 and website projects from $5,500. Fill out our contact form for an accurate quote: <a href='contact.html' style='color:var(--gold)'>Contact Us</a>";
          break;
        case 'portfolio':
          response = "Our portfolio showcases 500+ projects across branding, web, print, social, and more! 🎨 Check out our latest work and see how we've helped brands in Miami, New York, and San Diego grow. <a href='portfolio.html' style='color:var(--gold)'>View Portfolio →</a>";
          break;
        default:
          response = getFallbackResponse();
      }
      addBotMessage(response, false);
    }, 1200);
  }

  /* ----- Handle User Message ----- */
  function handleUserMessage(text) {
    if (!text.trim()) return;
    addUserMessage(text);
    chatInput.value = '';

    const typing = showTyping();
    setTimeout(() => {
      removeTyping();
      const lower = text.toLowerCase();
      let response = '';

      if (lower.match(/web|website|design|develop|site/)) {
        response = "Great! Our web design team creates beautiful, high-performance websites. We handle everything from design to development. Would you like to discuss your project? Email us at hello@42westdesign.com";
      } else if (lower.match(/brand|logo|identity/)) {
        response = "Brand identity is one of our specialties! We create complete brand systems that make lasting impressions. Ready to build something iconic together?";
      } else if (lower.match(/price|cost|budget|quote|how much/)) {
        response = "Pricing depends on the scope! Most projects range from $2,500–$25,000+. We offer free consultations to provide accurate quotes. Visit our contact page or email hello@42westdesign.com";
      } else if (lower.match(/portfolio|work|project|example/)) {
        response = "We'd love to show you our work! Browse our portfolio at 42westdesign.com/portfolio.html — 500+ projects across branding, web, print, and more.";
      } else if (lower.match(/location|miami|new york|san diego|office|where/)) {
        response = "We have studios in Miami (100 SE 2nd St), New York (350 5th Ave), and San Diego (600 B St). We also work with clients globally — location is never a barrier!";
      } else if (lower.match(/hi|hello|hey|good/)) {
        response = "Hello! 👋 Great to hear from you. What kind of design project can we help you with today?";
      } else if (lower.match(/thank|thanks/)) {
        response = "You're welcome! We're always here to help. Don't hesitate to reach out anytime. 😊";
      } else {
        response = getFallbackResponse();
      }

      addBotMessage(response, false);
    }, 1500);
  }

  function getFallbackResponse() {
    return "Thanks for reaching out! One of our designers will respond shortly. In the meantime, feel free to browse our work or send us an email at hello@42westdesign.com 📩";
  }

  /* ----- Send Button ----- */
  sendBtn.addEventListener('click', () => {
    handleUserMessage(chatInput.value);
  });

  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleUserMessage(chatInput.value);
    }
  });

})();
