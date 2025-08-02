(function ($) {
  "use strict";

  // Spinner loader
  var spinner = function () {
    setTimeout(function () {
      if ($("#spinner").length) {
        $("#spinner").removeClass("show");
      }
    }, 1);
  };
  spinner();

  // Initialize WOW.js animations
  new WOW().init();

  // Sticky Navbar on scroll
  $(window).on("scroll", function () {
    if ($(this).scrollTop() > 45) {
      $(".navbar").addClass("sticky-top shadow-sm");
    } else {
      $(".navbar").removeClass("sticky-top shadow-sm");
    }
  });

  // Dropdown on hover for desktop only
  const $dropdown = $(".dropdown");
  const $dropdownToggle = $(".dropdown-toggle");
  const $dropdownMenu = $(".dropdown-menu");
  const showClass = "show";

  $(window).on("load resize", function () {
    if (window.matchMedia("(min-width: 992px)").matches) {
      $dropdown.hover(
        function () {
          const $this = $(this);
          $this.addClass(showClass);
          $this.find($dropdownToggle).attr("aria-expanded", "true");
          $this.find($dropdownMenu).addClass(showClass);
        },
        function () {
          const $this = $(this);
          $this.removeClass(showClass);
          $this.find($dropdownToggle).attr("aria-expanded", "false");
          $this.find($dropdownMenu).removeClass(showClass);
        }
      );
    } else {
      $dropdown.off("mouseenter mouseleave");
    }
  });

  // Facts counter animation
  $('[data-toggle="counter-up"]').counterUp({
    delay: 10,
    time: 2000,
  });

  // Back to top button
  $(window).on("scroll", function () {
    if ($(this).scrollTop() > 100) {
      $(".back-to-top").fadeIn("slow");
    } else {
      $(".back-to-top").fadeOut("slow");
    }
  });
  $(".back-to-top").on("click", function () {
    $("html, body").animate({ scrollTop: 0 }, 1500, "easeInOutExpo");
    return false;
  });

  // Testimonial carousel
  if ($(".testimonial-carousel").length) {
    $(".testimonial-carousel").owlCarousel({
      autoplay: true,
      smartSpeed: 1500,
      dots: true,
      loop: true,
      center: true,
      responsive: {
        0: { items: 1 },
        576: { items: 1 },
        768: { items: 2 },
        992: { items: 3 },
      },
    });
  }

  // Vendor carousel
  if ($(".vendor-carousel").length) {
    $(".vendor-carousel").owlCarousel({
      loop: true,
      margin: 45,
      dots: false,
      autoplay: true,
      smartSpeed: 1000,
      responsive: {
        0: { items: 2 },
        576: { items: 4 },
        768: { items: 6 },
        992: { items: 8 },
      },
    });
  }

  // --- Centralized Cart Manager ---
  (function () {
    const CART_KEY = "cart";

    // Cache DOM elements
    const $sideCart = $("#side-cart");
    const $cartOverlay = $("#cart-overlay");
    const $cartItemsDiv = $("#cart-items");
    const $cartBtn = $("#cart-btn");
    const $closeCartBtn = $("#close-cart");
    const $continueShoppingBtn = $("#cart-continue-btn");
    const $cartCountBadge = $("#cart-count-badge");

    // Load cart from localStorage or initialize empty
    let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];

    // Save cart to localStorage
    function saveCart() {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }

    // Calculate total items in cart
    function getTotals() {
      return cart.reduce((total, item) => total + (item.qty || 1), 0);
    }

    // Update cart badge UI
    function updateCartUI() {
      const totalItems = getTotals();
      if ($cartCountBadge.length) {
        if (totalItems > 0) {
          $cartCountBadge.text(totalItems).show();
        } else {
          $cartCountBadge.hide();
        }
      }
    }

    // Render cart sidebar content
    function renderCartSidebar() {
      if (!$cartItemsDiv.length) return;

      $cartItemsDiv.empty();

      if (cart.length === 0) {
        $cartItemsDiv.html('<p class="text-muted">Your cart is empty.</p>');
        return;
      }

      cart.forEach((item, index) => {
        const itemHTML = `
          <div class="cart-item d-flex justify-content-between align-items-center border-bottom py-2" data-index="${index}">
            <div><strong>${item.name}</strong><br>Qty: ${item.qty}</div>
            <div>
              <button class="btn btn-sm btn-outline-danger remove-item" data-index="${index}" title="Remove item">&times;</button>
            </div>
          </div>`;
        $cartItemsDiv.append(itemHTML);
      });

      // Attach remove item event handlers
      $cartItemsDiv.find(".remove-item").off("click").on("click", function () {
        const idx = $(this).data("index");
        if (typeof idx !== "undefined") {
          cart.splice(idx, 1);
          saveCart();
          updateCartUI();
          renderCartSidebar();
        }
      });
    }

    // Open the cart sidebar
    function openCart() {
      renderCartSidebar();
      $sideCart.addClass("open").attr("aria-hidden", "false");
      $cartOverlay.show();
    }

    // Close the cart sidebar
    function closeCart() {
      $sideCart.removeClass("open").attr("aria-hidden", "true");
      $cartOverlay.hide();
    }

    // Add an item to the cart or increment quantity if exists
    function addToCart(id, name, price = 0) {
      const existingItem = cart.find((item) => item.id === id && item.name === name);
      if (existingItem) {
        existingItem.qty++;
      } else {
        cart.push({ id, name, price, qty: 1 });
      }
      saveCart();
      updateCartUI();
      openCart();
    }

    // Initialize event handlers
    function init() {
      if ($cartBtn.length) $cartBtn.on("click", openCart);
      if ($closeCartBtn.length) $closeCartBtn.on("click", closeCart);
      if ($cartOverlay.length) $cartOverlay.on("click", closeCart);
      if ($continueShoppingBtn.length) $continueShoppingBtn.on("click", closeCart);

      // Delegate click on add-to-cart buttons
      $(document).on("click", ".add-to-cart-btn", function () {
        const id = $(this).data("id");
        const name = $(this).data("name") || $(this).attr("data-name");
        const price = parseFloat($(this).data("price"));
        if (id && name && !isNaN(price)) {
          addToCart(id, name, price);
        }
      });

      // Initial UI update
      updateCartUI();
      renderCartSidebar();
    }

    // Initialize on script load
    $(document).ready(init);

    // Expose cart functionality if needed
    window.CartManager = {
      addToCart,
      saveCart,
      updateCartUI,
      renderCartSidebar,
      openCart,
      closeCart,
      getCartData: () => cart,
    };
  })();
})(jQuery);
