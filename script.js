document.addEventListener('DOMContentLoaded', function() {
  if (window.emailjs) {
    emailjs.init("LKSegN38ycoUfoq57"); // Your public key
  }

  const cartItems = [];
  const cartTable = document.getElementById('cart-items');
  const totalElement = document.getElementById('total-price');
  const bookingForm = document.getElementById('booking-form');

  // Add/remove services to cart
  document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', function() {
      const service = this.dataset.service;
      const price = parseFloat(this.dataset.price);
      const index = cartItems.findIndex(item => item.service === service);

      if (index === -1) {
        cartItems.push({ service, price });
        this.textContent = `Remove ${service}`;
        this.classList.add('remove-btn');
      } else {
        cartItems.splice(index, 1);
        this.textContent = `Add ${service} - ₹${price}`;
        this.classList.remove('remove-btn');
      }
      updateCart();
    });
  });

  // Update cart table
  function updateCart() {
    cartTable.innerHTML = '';
    let total = 0;
    cartItems.forEach((item, i) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${i + 1}</td>
        <td>${item.service}</td>
        <td>₹${item.price.toFixed(2)}</td>
        <td><button class="remove-item-btn" data-service="${item.service}">Remove</button></td>
      `;
      cartTable.appendChild(row);
      total += item.price;
    });
    totalElement.textContent = total.toFixed(2);

    // Remove button inside cart table
    document.querySelectorAll('.remove-item-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const service = this.dataset.service;
        const index = cartItems.findIndex(item => item.service === service);
        if (index !== -1) {
          cartItems.splice(index, 1);
          const btnInList = document.querySelector(`.add-to-cart-btn[data-service="${service}"]`);
          if (btnInList) {
            btnInList.textContent = `Add ${service} - ₹${btnInList.dataset.price}`;
            btnInList.classList.remove('remove-btn');
          }
          updateCart();
        }
      });
    });
  }

  // Prepare text for email
  function getCartItemsText() {
    if (cartItems.length === 0) return 'No items';
    // send plain numbers for EmailJS; formatting in template
    return cartItems.map((it, i) => `${i + 1}. ${it.service} - ${it.price}`).join('\n');
  }

  // Booking form submission
  bookingForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const userName = document.getElementById('name123').value.trim();
    const userEmail = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const totalPrice = totalElement.textContent;
    const itemsText = getCartItemsText();

    // Validate all fields
    if (!userName || !userEmail || !phone) {
      alert('Please fill all your details.');
      return;
    }
    if (cartItems.length === 0) {
      alert('Please add at least one service to your cart.');
      return;
    }

    // Prepare template parameters
    const templateParams = {
      customer_name: userName,
      customer_email: userEmail,
      customer_phone: phone,
      total_amount: totalPrice,
      items: itemsText,
      message: "Your booking is confirmed. Thank you for choosing our services!"
    };

    // Send email via EmailJS
    emailjs.send("service_nd3yr4a", "template_jb8g6qm", templateParams)
      .then(() => {
        alert(`✅ Booking successful! Confirmation email sent.\n\nBooking Details:\nName: ${userName}\nEmail: ${userEmail}\nPhone: ${phone}\nTotal Amount: ₹${totalPrice}\nItems:\n${itemsText}`);

        // Reset form and cart
        bookingForm.reset();
        cartItems.length = 0;
        updateCart();
        document.querySelectorAll('.add-to-cart-btn').forEach(b => {
          b.textContent = `Add ${b.dataset.service} - ₹${b.dataset.price}`;
          b.classList.remove('remove-btn');
        });
      })
      .catch(err => {
        console.error('EmailJS error:', err);
        if (err.text) console.error('Details:', err.text);
        alert('Booking saved, but email failed. Check console for details.');
      });
  });
});