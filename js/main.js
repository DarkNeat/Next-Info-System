(function ($) {
  "use strict";

  /*** Spinner ***/
  var spinner = function () {
    setTimeout(function () {
      if ($("#spinner").length > 0) {
        $("#spinner").removeClass("show");
      }
    }, 1);
  };
  spinner();

  /*** Init WOW.js ***/
  new WOW().init();

  /*** Sticky Navbar ***/
  $(window).scroll(function () {
    if ($(this).scrollTop() > 45) {
      $(".navbar").addClass("sticky-top shadow-sm");
    } else {
      $(".navbar").removeClass("sticky-top shadow-sm");
    }
  });

  /*** Dropdown on mouse hover for desktop only ***/
  const $dropdown = $(".dropdown");
  const $dropdownToggle = $(".dropdown-toggle");
  const $dropdownMenu = $(".dropdown-menu");
  const showClass = "show";

  $(window).on("load resize", function () {
    if (this.matchMedia("(min-width: 992px)").matches) {
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

  /*** Facts Counter ***/
  $('[data-toggle="counter-up"]').counterUp({
    delay: 10,
    time: 2000,
  });

  /*** Back to top button ***/
  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      $(".back-to-top").fadeIn("slow");
    } else {
      $(".back-to-top").fadeOut("slow");
    }
  });
  $(".back-to-top").click(function () {
    $("html, body").animate({ scrollTop: 0 }, 1500, "easeInOutExpo");
    return false;
  });

  /*** Testimonial carousel ***/
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

  /*** Vendor carousel ***/
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

  // --- Centralized Cart Manager (without prices) ---
  (function () {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    function saveCart() {
      localStorage.setItem("cart", JSON.stringify(cart));
    }

    function getTotals() {
      let totalItems = 0;
      cart.forEach((item) => {
        totalItems += item.qty;
      });
      return { totalItems };
    }

    function updateCartUI() {
      const { totalItems } = getTotals();
      const $cartCountBadge = $("#cart-count-badge");

      // Remove amount display if any
      $("#cart-amount").remove();

      if ($cartCountBadge.length) {
        if (totalItems > 0) {
          $cartCountBadge.text(totalItems).show();
        } else {
          $cartCountBadge.hide();
        }
      }
    }

    // Add to cart by id/name, increment qty if exists
    function addToCart(id, name) {
      const existing = cart.find((item) => item.id === id && item.name === name);
      if (existing) {
        existing.qty++;
      } else {
        cart.push({ id, name, qty: 1 });
      }
      saveCart();
      updateCartUI();
      openCart();
    }

    // Cart sidebar & overlay references
    const $sideCart = $("#side-cart");
    const $cartOverlay = $("#cart-overlay");
    const $cartItemsDiv = $("#cart-items");
    const $cartBtn = $("#cart-btn");
    const $closeCartBtn = $("#cart-close-btn");
    const $continueShoppingBtn = $("#cart-continue-btn");

    function renderCartSidebar() {
      if (!$cartItemsDiv.length) return;
      $cartItemsDiv.empty();

      if (cart.length === 0) {
        $cartItemsDiv.html('<p class="text-muted">Your cart is empty.</p>');
        return;
      }
      cart.forEach((item, index) => {
        const itemHtml = `
          <div class="cart-item d-flex justify-content-between align-items-center border-bottom py-2" data-index="${index}">
            <div><strong>${item.name}</strong><br>Qty: ${item.qty}</div>
            <div>
              <button class="btn btn-sm btn-outline-danger remove-item mt-1" data-index="${index}" title="Remove item">&times;</button>
            </div>
          </div>`;
        $cartItemsDiv.append(itemHtml);
      });

      // Attach remove handlers
      $cartItemsDiv.find(".remove-item").on("click", function () {
        const idx = $(this).data("index");
        if (idx !== undefined) {
          cart.splice(idx, 1);
          saveCart();
          updateCartUI();
          renderCartSidebar();
        }
      });
    }

    function openCart() {
      if ($sideCart.length && $cartOverlay.length) {
        $sideCart.addClass("open").attr("aria-hidden", "false");
        $cartOverlay.show();
      }
    }
    function closeCart() {
      if ($sideCart.length && $cartOverlay.length) {
        $sideCart.removeClass("open").attr("aria-hidden", "true");
        $cartOverlay.hide();
      }
    }

    if ($cartBtn.length && $closeCartBtn.length && $cartOverlay.length && $continueShoppingBtn.length) {
      $cartBtn.on("click", openCart);
      $closeCartBtn.on("click", closeCart);
      $cartOverlay.on("click", closeCart);
      $continueShoppingBtn.on("click", closeCart);
    }

    // Bind add-to-cart button click (ignore price)
    $(document).on("click", ".add-to-cart-btn", function () {
      const id = $(this).data("id");
      const name = $(this).attr("data-name") || $(this).data("name");
      if (id && name) {
        addToCart(id, name);
        renderCartSidebar();
      }
    });

    $(document).ready(function () {
      updateCartUI();
      renderCartSidebar();
    });

    // Expose CartManager globally if needed
    window.CartManager = {
      addToCart,
      saveCart,
      updateCartUI,
      renderCartSidebar,
      openCart,
      closeCart,
    };
  })();

})(jQuery);
