/**
 * DUNE 18 - INTERACTIVE LOGIC
 * Connected via <script src="script.js" defer></script> in index.html
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNav();
  initDishCarousel();
  initMenuFilters();
  initPickupBag();
  initReservationModal();
  initForms();
  initDynamicYear();
});

/**
 * 1. Sticky Header Scroll State
 */
function initStickyHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  });
}

/**
 * 2. Mobile Navigation Drawer
 */
function initMobileNav() {
  const mobileDrawer = document.getElementById('mobile-drawer');
  const openBtn = document.getElementById('mobile-menu-btn');
  const closeBtn = document.getElementById('close-mobile-drawer');
  if (!mobileDrawer || !openBtn || !closeBtn) return;

  openBtn.addEventListener('click', () => {
    mobileDrawer.classList.add('open');
    openBtn.setAttribute('aria-expanded', 'true');
  });

  const closeMenu = () => {
    mobileDrawer.classList.remove('open');
    openBtn.setAttribute('aria-expanded', 'false');
  };

  closeBtn.addEventListener('click', closeMenu);
  document.querySelectorAll('.mobile-nav-item').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
      closeMenu();
    }
  });
}

/**
 * 3. Signature Dishes Carousel Controls
 */
function initDishCarousel() {
  const track = document.getElementById('signature-track');
  const nextBtn = document.getElementById('dish-next');
  const prevBtn = document.getElementById('dish-prev');
  if (!track || !nextBtn || !prevBtn) return;

  nextBtn.addEventListener('click', () => {
    if (track.firstElementChild) {
      track.appendChild(track.firstElementChild);
    }
  });

  prevBtn.addEventListener('click', () => {
    if (track.lastElementChild) {
      track.prepend(track.lastElementChild);
    }
  });
}

/**
 * 4. Dinner Menu Category Filtering
 */
function initMenuFilters() {
  const filterPills = document.querySelectorAll('.pill-tab');
  const menuCards = document.querySelectorAll('#dune-menu-list .menu-row-card');
  if (filterPills.length === 0) return;

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const category = pill.getAttribute('data-cat');
      menuCards.forEach(card => {
        const matches = category === 'all' || card.getAttribute('data-category') === category;
        card.classList.toggle('hidden', !matches);
      });
    });
  });
}

/**
 * 5. Takeout Pickup Order Bag & Toast Notifications
 */
function initPickupBag() {
  const bag = [];
  const bagDrawer = document.getElementById('bag-drawer');
  const bagCount = document.getElementById('bag-count');
  const bagList = document.getElementById('bag-items-list');
  const bagTotal = document.getElementById('bag-total');
  const toast = document.getElementById('toast');

  const showToast = (msg) => {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2200);
  };

  const renderBag = () => {
    if (!bagCount || !bagList || !bagTotal) return;
    bagCount.textContent = bag.length;

    if (bag.length === 0) {
      bagList.innerHTML = '<p class="bag-empty-msg">Your pickup order is currently empty.</p>';
      bagTotal.textContent = '$0.00';
      return;
    }

    let total = 0;
    bagList.innerHTML = bag.map((item, idx) => {
      total += item.price;
      return `
        <div class="bag-item-row">
          <div>
            <strong>${item.name}</strong><br>
            <span class="bag-item-price">$${item.price.toFixed(2)}</span>
          </div>
          <button type="button" class="bag-remove-btn" data-remove-idx="${idx}">Remove</button>
        </div>
      `;
    }).join('');

    bagTotal.textContent = `$${total.toFixed(2)}`;

    bagList.querySelectorAll('[data-remove-idx]').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.getAttribute('data-remove-idx'), 10);
        bag.splice(index, 1);
        renderBag();
      });
    });
  };

  document.querySelectorAll('.add-to-bag').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.getAttribute('data-name');
      const price = parseFloat(btn.getAttribute('data-price'));
      bag.push({ name, price });
      renderBag();
      showToast(`Added "${name}" to pickup order`);
    });
  });

  const openBagBtn = document.getElementById('open-bag-btn');
  const closeBagBtn = document.getElementById('close-bag-btn');
  const checkoutBtn = document.getElementById('checkout-pickup-btn');

  if (openBagBtn && bagDrawer) {
    openBagBtn.addEventListener('click', () => bagDrawer.classList.add('open'));
  }
  if (closeBagBtn && bagDrawer) {
    closeBagBtn.addEventListener('click', () => bagDrawer.classList.remove('open'));
  }
  if (checkoutBtn && bagDrawer) {
    checkoutBtn.addEventListener('click', () => {
      if (bag.length === 0) {
        showToast('Add dishes from the menu first!');
        return;
      }
      bag.length = 0;
      renderBag();
      bagDrawer.classList.remove('open');
      showToast('Pickup request sent to Dune 18 kitchen!');
    });
  }
}

/**
 * 6. Table Reservation Modal
 */
function initReservationModal() {
  const reserveModal = document.getElementById('reserve-modal');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const closeBtn = document.getElementById('close-reserve-modal');
  if (!reserveModal) return;

  const openModal = () => {
    if (mobileDrawer) mobileDrawer.classList.remove('open');
    reserveModal.classList.add('open');
    reserveModal.setAttribute('aria-hidden', 'false');
  };

  const closeModal = () => {
    reserveModal.classList.remove('open');
    reserveModal.setAttribute('aria-hidden', 'true');
  };

  document.querySelectorAll('.open-reserve-modal').forEach(btn => {
    btn.addEventListener('click', openModal);
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  reserveModal.addEventListener('click', (e) => {
    if (e.target === reserveModal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && reserveModal.classList.contains('open')) {
      closeModal();
    }
  });
}

/**
 * 7. Form Submissions (Reservation & Contact)
 */
function initForms() {
  const resForm = document.getElementById('reservation-form');
  if (resForm) {
    resForm.addEventListener('submit', (e) => {
      e.preventDefault();
      resForm.innerHTML = `
        <div class="form-confirmation">
          <h4>Table Request Received!</h4>
          <p>We look forward to welcoming you to Dune 18 at 1916 Long Beach Blvd.</p>
        </div>
      `;
    });
  }

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      contactForm.innerHTML = `
        <div class="form-confirmation">
          <h4>Message Sent</h4>
          <p>Thank you for reaching out to Dune 18. Our team will reply shortly.</p>
        </div>
      `;
    });
  }
}

/**
 * 8. Dynamic Copyright Year
 */
function initDynamicYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}