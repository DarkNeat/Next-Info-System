// main.js
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

  /*** Service Boxes Interactions ***/
  var services = [
    // your existing services data here, unchanged
  ];

  var $detailPanel = $("#serviceDetail");
  var $detailTitle = $("#serviceDetailTitle");
  var $detailDescription = $("#serviceDetailDescription");
  var $carouselInner = $("#serviceCarousel .carousel-inner");
  var bsCarousel = null;

  function showServiceDetail(index) {
    var service = services[index];

    $detailTitle.text(service.title);
    $detailDescription.text(service.description);
    $detailPanel.attr("aria-hidden", "false").show();
    $detailPanel.attr("data-current", index);

    $carouselInner.empty();
    service.images.forEach(function (img, i) {
      var activeClass = i === 0 ? "active" : "";
      var item = `<div class="carousel-item ${activeClass}">
                    <img src="${img}" alt="${service.title} image ${i+1}" class="d-block w-100 rounded">
                  </div>`;
      $carouselInner.append(item);
    });

    if (bsCarousel) bsCarousel.dispose();
    bsCarousel = new bootstrap.Carousel(document.getElementById("serviceCarousel"));
  }

  function hideServiceDetail() {
    $detailPanel.attr("aria-hidden", "true").hide();
    $detailPanel.removeAttr("data-current");
    if (bsCarousel) {
      bsCarousel.dispose();
      bsCarousel = null;
    }
  }

  $("#servicesGrid article.service-box").each(function () {
    $(this).on("click keydown", function (e) {
      if (
        e.type === "click" ||
        (e.type === "keydown" && (e.key === "Enter" || e.key === " "))
      ) {
        e.preventDefault();
        var index = parseInt($(this).attr("data-index"), 10);
        var current = $detailPanel.attr("data-current");

        if ($detailPanel.is(":hidden") || current !== String(index)) {
          showServiceDetail(index);
        } else {
          hideServiceDetail();
        }
      }
    });
  });

  // --- Product category filtering ---
  $(document).ready(function () {
    const $categoryLinks = $(".category-link");
    const $products = $(".col-lg-9 article");

    function filterProducts(category) {
      if (category === "ALL") {
        $products.show();
      } else {
        $products.each(function () {
          const cats = $(this).data("category");
          if (typeof cats === "string" && cats.split(" ").includes(category)) {
            $(this).show();
          } else {
            $(this).hide();
          }
        });
      }
    }

    $categoryLinks.on("click", function (e) {
      e.preventDefault();
      const selectedCategory = $(this).text().trim();

      $categoryLinks.removeClass("active");
      $(this).addClass("active");

      filterProducts(selectedCategory);

      $("section.col-lg-9").get(0).scrollIntoView({ behavior: "smooth" });
    });

    $categoryLinks.each(function () {
      if ($(this).text().trim() === "ALL") {
        $(this).trigger("click");
        return false;
      }
    });
  });

  // --- Centralized Cart Manager without prices (for "Request for Quote" only) ---
  (function () {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    function saveCart() {
      localStorage.setItem("cart", JSON.stringify(cart));
    }

    function getTotals() {
      let totalItems = 0;
      cart.forEach(item => {
        totalItems += item.qty;
      });
      return { totalItems };
    }

    function updateCartUI() {
      const { totalItems } = getTotals();
      const $cartCountBadge = $("#cart-count-badge");

      // Remove amount display entirely (if present)
      $("#cart-amount").remove();

      if ($cartCountBadge.length) {
        if (totalItems > 0) {
          $cartCountBadge.text(totalItems).show();
        } else {
          $cartCountBadge.hide();
        }
      }
    }

    // Add to cart by id/name, increment quantity if exists
    function addToCart(id, name) {
      const existing = cart.find(item => item.id === id);
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
    const $closeCartBtn = $("#close-cart");
    const $continueShoppingBtn = $("#continue-shopping-btn");

    // Render the cart sidebar items—no prices, just product name & qty
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
            <div>
              <strong>${item.name}</strong>
              <br>Qty: ${item.qty}
            </div>
            <div>
              <button class="btn btn-sm btn-outline-danger remove-item mt-1" data-index="${index}" title="Remove item">&times;</button>
            </div>
          </div>
        `;
        $cartItemsDiv.append(itemHtml);
      });

      // Attach event to remove buttons
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

    // Open/Close cart functions
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

    // Bind add-to-cart buttons click (ignore price entirely)
    $(document).on("click", ".add-to-cart-btn", function () {
      const id = $(this).data("id");
      const name = $(this).data("name");
      if (id && name) {
        addToCart(id, name);
        renderCartSidebar();
      }
    });

    // Initialize on DOM ready
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
      closeCart
    };
  })();

})(jQuery);
