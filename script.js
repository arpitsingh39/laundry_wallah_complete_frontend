document.addEventListener('DOMContentLoaded', function() {
  if (window.emailjs) {
    emailjs.init("LKSegN38ycoUfoq57"); // your public key
  }

  const cartItems = [];
  const cartTable = document.getElementById('cart-items');
  const totalElement = document.getElementById('total-price');
  const bookingForm = document.getElementById('booking-form');

  document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', function() {
      const service = this.dataset.service;
      const price = parseFloat(this.dataset.price);
      const index = cartItems.findIndex(item => item.service === service);

      if (index === -1) {
        cartItems.push({ service, price });
        this.textContent = 'Remove Item';
        this.classList.add('remove-btn');
      } else {
        cartItems.splice(index, 1);
        this.textContent = 'Add Item';
        this.classList.remove('remove-btn');
      }
      updateCart();
    });
  });

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

    document.querySelectorAll('.remove-item-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const service = this.dataset.service;
        const index = cartItems.findIndex(item => item.service === service);
        if (index !== -1) {
          cartItems.splice(index, 1);
          const btnInList = document.querySelector(`.add-to-cart-btn[data-service="${service}"]`);
          if (btnInList) {
            btnInList.textContent = 'Add Item';
            btnInList.classList.remove('remove-btn');
          }
          updateCart();
        }
      });
    });
  }

  function getCartItemsText() {
    if (cartItems.length === 0) return 'No items';
    return cartItems.map((it, i) => `${i + 1}. ${it.service} - ₹${it.price}`).join('\n');
  }

  bookingForm.addEventListener('submit', function(e) {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert('Please add at least one service to your cart.');
      return;
    }

    const userName = document.getElementById('name123').value.trim();
    const userEmail = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const totalPrice = totalElement.textContent;
    const itemsText = getCartItemsText();

    const templateParams = {
      to_name: userName,
      customer_name: userName,
      customer_email: userEmail,
      customer_phone: phone,
      total_amount: totalPrice,
      items: itemsText,
      message: "Your booking is confirmed. Thank you for choosing our services!"
    };

    emailjs.send("service_nd3yr4a", "template_jb8g6qm", templateParams)
      .then(() => {
        alert(`✅ Booking successful! A confirmation email has been sent.
        
📌 Booking Details:
Name: ${userName}
Email: ${userEmail}
Phone: ${phone}
Total Amount: ₹${totalPrice}
Items:
${itemsText}`);
        
        bookingForm.reset();
        cartItems.length = 0;
        updateCart();
        document.querySelectorAll('.add-to-cart-btn').forEach(b => {
          b.textContent = 'Add Item';
          b.classList.remove('remove-btn');
        });
      })
      .catch(err => {
        console.error(err);
        alert('Booking saved, but email failed.');
      });
  });
});
