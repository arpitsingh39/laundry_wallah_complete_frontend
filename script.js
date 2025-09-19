// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Ensure EmailJS SDK is loaded (the SDK must be included in the HTML before this file)
    if (window.emailjs) {
        // Initialize with your public key
        emailjs.init("LKSegN38ycoUfoq57");
    } else {
        console.warn('EmailJS SDK not found. Make sure <script src="https://cdn.emailjs.com/sdk/3.11.0/email.min.js"></script> is included BEFORE script.js');
    }

    const cartItems = [];
    const cartTable = document.getElementById('cart-items');
    const totalElement = document.getElementById('total-price');
    const bookingForm = document.getElementById('booking-form');

    // Defensive: check required elements exist
    if (!cartTable || !totalElement || !bookingForm) {
        console.error('One or more required DOM elements are missing:', { cartTable, totalElement, bookingForm });
        return;
    }

    // Add to cart functionality
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', function() {
            const service = this.dataset.service;
            const price = parseFloat(this.dataset.price) || 0;
            const index = cartItems.findIndex(item => item.service === service);

            if (index === -1) {
                // Add new item to cart
                cartItems.push({ service, price, quantity: 1 });
                this.textContent = 'Remove Item';
                this.classList.add('remove-btn');
            } else {
                // Remove item from cart
                cartItems.splice(index, 1);
                this.textContent = 'Add Item';
                this.classList.remove('remove-btn');
            }

            updateCart();
        });
    });

    // Update cart display
    function updateCart() {
        cartTable.innerHTML = '';
        let total = 0;

        cartItems.forEach((item, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${item.service}</td>
                <td>&#8377;${item.price.toFixed(2)}</td>
                <td><button class="remove-item-btn" data-service="${item.service}">Remove</button></td>
            `;
            cartTable.appendChild(row);
            total += item.price;
        });

        totalElement.textContent = total.toFixed(2);

        // Add event listeners to remove buttons (re-bind after DOM changes)
        document.querySelectorAll('.remove-item-btn').forEach(button => {
            button.addEventListener('click', function() {
                const service = this.dataset.service;
                const index = cartItems.findIndex(item => item.service === service);

                if (index !== -1) {
                    cartItems.splice(index, 1);

                    // Update the add button in services list if it exists
                    const serviceButton = document.querySelector(`.add-to-cart-btn[data-service="${service}"]`);
                    if (serviceButton) {
                        serviceButton.textContent = 'Add Item';
                        serviceButton.classList.remove('remove-btn');
                    }

                    updateCart();
                }
            });
        });
    }

    // Helper: create a newline list of cart items for email body
    function getCartItemsText() {
        if (cartItems.length === 0) return 'No items';
        return cartItems.map((it, idx) => `${idx + 1}. ${it.service} - ₹${it.price.toFixed(2)}`).join('\n');
    }

    // Form submission
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();

        if (cartItems.length === 0) {
            alert('Please add at least one service to your cart before booking.');
            return;
        }

        // Use IDs from your HTML
        const userName = (document.getElementById('name') || {}).value?.trim() || 'Customer';
        const userEmail = (document.getElementById('email') || {}).value?.trim() || '';
        const phone = (document.getElementById('phone') || {}).value?.trim() || '';
        const totalPrice = totalElement.textContent;
        const itemsText = getCartItemsText();

        // If EmailJS isn't available, still process booking but inform user
        if (!window.emailjs) {
            alert('✅ Booking successful! (Email not sent because EmailJS SDK is missing.)');

            // Reset form and cart
            bookingForm.reset();
            cartItems.length = 0;
            updateCart();
            document.querySelectorAll('.add-to-cart-btn').forEach(button => {
                button.textContent = 'Add Item';
                button.classList.remove('remove-btn');
            });
            return;
        }

        // Prepare template params — make sure your EmailJS template uses these variable names:
        // e.g. {{to_name}}, {{to_email}}, {{phone}}, {{total}}, {{items}}, {{message}}
        const templateParams = {
            to_name: userName,
            to_email: userEmail,
            phone: phone,
            total: totalPrice,
            items: itemsText,
            message: "Your booking is confirmed. Thank you for choosing our services!"
        };

        emailjs.send("service_nd3yr4a", "template_jb8g6qm", templateParams)
            .then(function(response) {
                alert('✅ Booking successful! A confirmation email has been sent.');
            }, function(error) {
                console.error('EmailJS error:', error);
                alert('✅ Booking successful! But failed to send confirmation email.');
            })
            .finally(() => {
                // Reset form and cart regardless of email result
                bookingForm.reset();
                cartItems.length = 0;
                updateCart();
                document.querySelectorAll('.add-to-cart-btn').forEach(button => {
                    button.textContent = 'Add Item';
                    button.classList.remove('remove-btn');
                });
            });
    });

});
