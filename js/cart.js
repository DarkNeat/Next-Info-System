jQuery(function($) {
  // Cart state
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");

  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function updateCartUI() {
    const $badge = $("#cart-count-badge");
    let totalQty = cart.reduce((acc, item) => acc + item.qty, 0);
    if (totalQty) {
      $badge.text(totalQty).show();
    } else {
      $badge.hide();
    }
    renderCartItems();
    $("#cart-total-items").text(totalQty); // <-- update total items
  }

  function renderCartItems() {
    const $cartItems = $("#cart-items");
    $cartItems.empty();
    if (cart.length === 0) {
      $cartItems.html('<p class="text-muted">Your cart is empty.</p>');
      $("#cart-total-items").text("0");
      return;
    }
    cart.forEach((item, i) => {
      const itemDiv = $(`
        <div class="cart-item d-flex justify-content-between align-items-center border-bottom py-2">
          <div><strong>${item.name}</strong><br />Qty: ${item.qty}</div>
          <div>
            $${(item.price * item.qty).toFixed(2)}
            <button class="btn btn-sm btn-danger ms-2" aria-label="Remove ${item.name}" data-index="${i}">&times;</button>
          </div>
        </div>`);
      $cartItems.append(itemDiv);
    });
    $cartItems.find("button").on("click", function() {
      const idx = $(this).data("index");
      cart.splice(idx, 1);
      saveCart();
      updateCartUI();
    });
  }

  // Open/close cart
  $("#cart-btn").on("click", function() {
    $("#side-cart").addClass("open");
    $("#cart-overlay").show();
  });
  $("#close-cart, #cart-overlay, #continue-shopping-btn").on("click", function() {
    $("#side-cart").removeClass("open");
    $("#cart-overlay").hide();
  });

  // Add to cart
  $(document).on("click", ".add-to-cart-btn", function() {
    const id = $(this).data("id");
    const name = $(this).data("name");
    const price = parseFloat($(this).data("price")) || 0;
    if (!id || !name) return;
    const found = cart.find(item => item.id === id && item.name === name);
    if (found) {
      found.qty++;
    } else {
      cart.push({ id, name, price, qty: 1 });
    }
    saveCart();
    updateCartUI();
    $("#side-cart").addClass("open");
    $("#cart-overlay").show();
  });

  // Initialize cart UI on page load
  updateCartUI();
});