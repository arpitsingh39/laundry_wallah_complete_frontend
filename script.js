document.addEventListener('DOMContentLoaded', function() {
            const cartItems = [];
            const cartTable = document.getElementById('cart-items');
            const totalElement = document.getElementById('total-price');
            const bookingForm = document.getElementById('booking-form');
            
            // Add to cart functionality
            document.querySelectorAll('.add-to-cart-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const service = this.dataset.service;
                    const price = parseFloat(this.dataset.price);
                    const index = cartItems.findIndex(item => item.service === service);
                    
                    if (index === -1) {
                        // Add new item to cart
                        cartItems.push({service, price, quantity: 1});
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
                
                // Add event listeners to remove buttons
                document.querySelectorAll('.remove-item-btn').forEach(button => {
                    button.addEventListener('click', function() {
                        const service = this.dataset.service;
                        const index = cartItems.findIndex(item => item.service === service);
                        
                        if (index !== -1) {
                            cartItems.splice(index, 1);
                            
                            // Update the add button in services list
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
            
            // Form submission
            bookingForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                if (cartItems.length === 0) {
                    alert('Please add at least one service to your cart before booking.');
                    return;
                }
                
                alert('Booking successful! Thank you for choosing our services.');
                
                // Reset form and cart
                bookingForm.reset();
                cartItems.length = 0;
                updateCart();
                
                // Reset all add to cart buttons
                document.querySelectorAll('.add-to-cart-btn').forEach(button => {
                    button.textContent = 'Add Item';
                    button.classList.remove('remove-btn');
                });
            });
        });