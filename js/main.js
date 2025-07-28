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
        0: {
          items: 1,
        },
        576: {
          items: 1,
        },
        768: {
          items: 2,
        },
        992: {
          items: 3,
        },
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
        0: {
          items: 2,
        },
        576: {
          items: 4,
        },
        768: {
          items: 6,
        },
        992: {
          items: 8,
        },
      },
    });
  }

  /*** Service Boxes Interactions ***/

  // Services data - adjust these as needed in your project
  var services = [
    {
      title: "Cyber Security",
      description:
        "Protect your business with cutting-edge cybersecurity solutions to safeguard your data and network.",
      images: [
        "img/services/cybersec1.jpg",
        "img/services/cybersec2.jpg",
        "img/services/cybersec3.jpg",
      ],
    },
    {
      title: "Data Analytics",
      description:
        "Harness your data potential to drive better decision-making and business growth through analytics.",
      images: ["img/services/data1.jpg", "img/services/data2.jpg", "img/services/data3.jpg"],
    },
    {
      title: "Web Development",
      description: "Create responsive, SEO-friendly, and engaging websites tailored for your needs.",
      images: [
        "img/services/webdev1.jpg",
        "img/services/webdev2.jpg",
        "img/services/webdev3.jpg",
      ],
    },
    {
      title: "Apps Development",
      description:
        "Develop stunning and functional mobile apps on Android and iOS platforms.",
      images: ["img/services/apps1.jpg", "img/services/apps2.jpg", "img/services/apps3.jpg"],
    },
    {
      title: "SEO Optimization",
      description:
        "Boost your online presence and improve search rankings with our SEO strategies.",
      images: ["img/services/seo1.jpg", "img/services/seo2.jpg", "img/services/seo3.jpg"],
    },
    {
      title: "Cloud Services",
      description:
        "Scale with reliable and secure cloud computing services customized for your business.",
      images: ["img/services/cloud1.jpg", "img/services/cloud2.jpg", "img/services/cloud3.jpg"],
    },
    {
      title: "IT Consultancy",
      description: "Expert advice to optimize your IT infrastructure and strategy.",
      images: [
        "img/services/consultancy1.jpg",
        "img/services/consultancy2.jpg",
        "img/services/consultancy3.jpg",
      ],
    },
    {
      title: "Mobile Marketing",
      description:
        "Engage customers effectively with targeted mobile marketing campaigns.",
      images: ["img/services/marketing1.jpg", "img/services/marketing2.jpg", "img/services/marketing3.jpg"],
    },
    {
      title: "Customer Support",
      description:
        "Provide excellent 24/7 customer support tailored to your business operations.",
      images: ["img/services/support1.jpg", "img/services/support2.jpg", "img/services/support3.jpg"],
    },
  ];

  // Cache references to detail panel and carousel inner area
  var $detailPanel = $("#serviceDetail");
  var $detailTitle = $("#serviceDetailTitle");
  var $detailDescription = $("#serviceDetailDescription");
  var $carouselInner = $("#serviceCarousel .carousel-inner");
  var bsCarousel = null;

  // Function to show service details panel
  function showServiceDetail(index) {
    var service = services[index];

    $detailTitle.text(service.title);
    $detailDescription.text(service.description);
    $detailPanel.attr("aria-hidden", "false").show();
    $detailPanel.attr("data-current", index); // mark current

    // Build carousel items
    $carouselInner.empty();
    service.images.forEach(function (img, i) {
      var activeClass = i === 0 ? "active" : "";
      var item = `<div class="carousel-item ${activeClass}">
                          <img src="${img}" alt="${service.title} image ${
        i + 1
      }" class="d-block w-100 rounded">
                      </div>`;
      $carouselInner.append(item);
    });

    // Initialize or refresh bootstrap carousel
    if (bsCarousel) {
      bsCarousel.dispose();
    }
    bsCarousel = new bootstrap.Carousel(document.getElementById("serviceCarousel"));

    // Optional: scroll to detail panel smoothly
    // Uncomment if needed:
    // $('html, body').animate({ scrollTop: $detailPanel.offset().top - 80 }, 600);
  }

  // Function to hide service detail panel
  function hideServiceDetail() {
    $detailPanel.attr("aria-hidden", "true").hide();
    $detailPanel.removeAttr("data-current");
    if (bsCarousel) {
      bsCarousel.dispose();
      bsCarousel = null;
    }
  }

  // Click and keyboard events for service boxes
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
})(jQuery);

/*** Centralized Cart Amount Manager ***/
(function () {
  "use strict";

  let cartTotalAmount = 0;

  function formatAmount(amount) {
    return amount.toFixed(3);
  }

  function updateCartAmountUI() {
    const cartAmountEl = document.getElementById("cart-amount");
    if (cartAmountEl) {
      cartAmountEl.textContent = `Amount: $${formatAmount(cartTotalAmount)}`;
    }
  }

  function setCartAmount(amount) {
    if (typeof amount !== "number" || isNaN(amount)) {
      console.warn("CartManager.setCartAmount: invalid amount:", amount);
      return;
    }
    cartTotalAmount = amount < 0 ? 0 : amount;
    updateCartAmountUI();
  }

  function addToCartAmount(amount) {
    if (typeof amount !== "number" || isNaN(amount)) {
      console.warn("CartManager.addToCartAmount: invalid amount:", amount);
      return;
    }
    cartTotalAmount += amount;
    cartTotalAmount = cartTotalAmount < 0 ? 0 : cartTotalAmount;
    updateCartAmountUI();
  }

  function resetCartAmount() {
    cartTotalAmount = 0;
    updateCartAmountUI();
  }

  function getCartAmount() {
    return cartTotalAmount;
  }

  document.addEventListener("DOMContentLoaded", function () {
    updateCartAmountUI();
  });

  window.CartManager = {
    setCartAmount,
    addToCartAmount,
    resetCartAmount,
    getCartAmount,
  };


  (function ($) {
  "use strict";

  // --- Product category filtering ---
  $(document).ready(function () {
    const $categoryLinks = $(".category-link");
    const $productArticles = $(".col-lg-9 article");

    // Helper to show/hide products by category
    function filterProducts(category) {
      if (category === "ALL") {
        $productArticles.show();
      } else {
        $productArticles.each(function () {
          const cats = $(this).data("category"); // e.g. "T-Shirts ALL"
          if (typeof cats === "string" && cats.includes(category)) {
            $(this).show();
          } else {
            $(this).hide();
          }
        });
      }
    }

    // On category link click
    $categoryLinks.on("click", function (e) {
      e.preventDefault();

      const selectedCategory = $(this).text().trim();

      // Update active class on categories
      $categoryLinks.removeClass("active");
      $(this).addClass("active");

      // Filter products
      filterProducts(selectedCategory);

      // Optional: scroll to product list top
      $("section.col-lg-9").get(0).scrollIntoView({ behavior: "smooth" });
    });

    // Trigger click on 'ALL' to initialize product display
    $categoryLinks.each(function () {
      if ($(this).text().trim() === "ALL") {
        $(this).trigger("click");
        return false; // break loop
      }
    });
  });

  // --- Add to Cart button handlers ---
  $(document).ready(function () {
    // Assuming you will store cart items and update the total amount somewhere else
    // For demo, we'll update CartManager total amount on each add-to-cart click

    // Find all add to cart buttons inside the product cards
    $(".card-product .btn-outline-primary").on("click", function () {
      // Get price text from sibling p.text-primary
      const $cardBody = $(this).closest(".card-body");
      const priceText = $cardBody.find("p.text-primary").text().trim(); // e.g. "$21.99"
      const price = parseFloat(priceText.replace(/\$/g, ""));

      if (!isNaN(price)) {
        // Add this amount to CartManager
        if (window.CartManager && typeof window.CartManager.addToCartAmount === "function") {
          window.CartManager.addToCartAmount(price);
          // Optionally, you can show feedback or open cart panel here
          // e.g., console.log("Added to cart:", price);
        }
      }
    });

    // Optionally, add handlers for "View Product" buttons if needed
  });

})(jQuery);

})();
