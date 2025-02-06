// Room rate configurations
const ROOM_RATES = {
    deluxe: {
        adult: 2000,
        child: 1400,
        multiplier: 1
    },
    executive: {
        adult: 4000,
        child: 2800,
        multiplier: 2
    },
    presidential: {
        adult: 8000,
        child: 5600,
        multiplier: 4
    },
    family: {
        adult: 6000,
        child: 4200,
        multiplier: 3
    }
};

document.addEventListener('DOMContentLoaded', function() {
    let actualAadharNumber = '';

    // Phone number handling
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 10) {
            value = value.slice(0, 10);
        }
        
        if (value.length > 5) {
            e.target.value = value.slice(0, 5) + ' ' + value.slice(5);
        } else {
            e.target.value = value;
        }
    });

    // Aadhar card handling
    const aadharInput = document.getElementById('aadharCard');
    aadharInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.slice(0, 12);
        actualAadharNumber = value;

        let displayValue = '';
        for(let i = 0; i < value.length; i++) {
            if(i === 4 || i === 8) displayValue += ' ';
            if(i < 8) {
                displayValue += 'X';
            } else {
                displayValue += value[i];
            }
        }
        
        e.target.value = displayValue;
    });

    // Populate nights dropdown
    const nightsSelect = document.getElementById('nights');
    for(let i = 1; i <= 30; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i} Night${i > 1 ? 's' : ''}`;
        nightsSelect.appendChild(option);
    }

    // Date handling
    const checkInDate = document.getElementById('checkIn');
    const checkOutDate = document.getElementById('checkOut');
    
    const today = new Date().toISOString().split('T')[0];
    checkInDate.min = today;
    checkOutDate.min = today;

    checkInDate.addEventListener('change', function() {
        checkOutDate.min = this.value;
        calculateNights();
    });

    checkOutDate.addEventListener('change', calculateNights);

    // Add event listeners for price calculations
    document.getElementById('roomType').addEventListener('change', calculateTotalPrice);
    document.getElementById('adults').addEventListener('change', calculateTotalPrice);
    document.getElementById('children').addEventListener('change', calculateTotalPrice);
    document.getElementById('nights').addEventListener('change', calculateTotalPrice);
});

function calculateNights() {
    const checkIn = new Date(document.getElementById('checkIn').value);
    const checkOut = new Date(document.getElementById('checkOut').value);
    const nightsSelect = document.getElementById('nights');
    
    if(checkIn && checkOut) {
        const nights = Math.floor((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        if(nights > 0) {
            nightsSelect.value = nights;
            calculateTotalPrice();
        }
    }
}

function calculateTotalPrice() {
    const roomType = document.getElementById('roomType').value;
    const adults = parseInt(document.getElementById('adults').value) || 0;
    const children = parseInt(document.getElementById('children').value) || 0;
    const nights = parseInt(document.getElementById('nights').value) || 0;

    if (roomType && nights > 0) {
        const rates = ROOM_RATES[roomType];
        const adultsCost = adults * rates.adult;
        const childrenCost = children * rates.child;
        const totalPerNight = adultsCost + childrenCost;
        const totalAmount = totalPerNight * nights;

        document.getElementById('roomTypeRate').textContent = `₹${rates.adult}/adult, ₹${rates.child}/child`;
        document.getElementById('adultsCost').textContent = `₹${adultsCost}`;
        document.getElementById('childrenCost').textContent = `₹${childrenCost}`;
        document.getElementById('nightsCount').textContent = nights;
        document.getElementById('totalPrice').textContent = `₹${totalAmount}`;

        return totalAmount;
    }
    return 0;
}

function validateForm() {
    const phone = document.getElementById('phone').value.replace(/\D/g, '');
    const email = document.getElementById('email').value;
    const checkIn = new Date(document.getElementById('checkIn').value);
    const checkOut = new Date(document.getElementById('checkOut').value);

    if(phone.length !== 10) {
        alert('Please enter a valid 10-digit phone number');
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return false;
    }

    if(actualAadharNumber.length !== 12) {
        alert('Please enter a valid 12-digit Aadhar number');
        return false;
    }

    if(checkOut <= checkIn) {
        alert('Check-out date must be after check-in date');
        return false;
    }

    console.log('Full Aadhar Number for DB:', actualAadharNumber);
    console.log('Phone Number for DB:', phone);
    console.log('Total Price:', document.getElementById('totalPrice').textContent);

    alert('Booking submitted successfully!');
    return true;
}

// Prevent non-numeric input
document.getElementById('phone').addEventListener('keypress', function(e) {
    if(e.key < '0' || e.key > '9') {
        e.preventDefault();
    }
});

document.getElementById('aadharCard').addEventListener('keypress', function(e) {
    if(e.key < '0' || e.key > '9') {
        e.preventDefault();
    }
});
