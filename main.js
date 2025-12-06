// --- 1. Initialization & UI Logic ---
document.addEventListener('DOMContentLoaded', () => {
    
    // Initialize AOS Animation
    AOS.init({
        offset: 120,
        duration: 800,
    });

    // Load Bookings from Storage
    loadBookings();
});

// Mobile Navbar Toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// --- 2. BMI Calculator Logic ---
function calculateBMI() {
    const weight = document.getElementById('weight').value;
    const height = document.getElementById('height').value;
    const result = document.getElementById('bmiResult');

    if (weight === '' || height === '' || weight <= 0 || height <= 0) {
        result.innerHTML = "Please enter valid positive numbers!";
        result.style.color = "red";
        return;
    }

    const heightInMeters = height / 100;
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(2);
    let message = '';
    let color = '';

    if (bmi < 18.5) { message = 'Underweight'; color = '#ffeb3b'; }
    else if (bmi < 24.9) { message = 'Normal Weight'; color = '#00e676'; }
    else if (bmi < 29.9) { message = 'Overweight'; color = '#ff9800'; }
    else { message = 'Obese'; color = '#f44336'; }

    result.innerHTML = `Your BMI: ${bmi} <br> <span style="color:${color}">${message}</span>`;
}

// --- 3. Booking System (CRUD + Local Storage) ---

const gymForm = document.getElementById('gymForm');
const bookingTableBody = document.getElementById('bookingTableBody');
const noBookingMsg = document.getElementById('noBookingMsg');
const submitBtn = document.getElementById('submitBtn');

// Handle Form Submit (Add or Edit)
gymForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('userName').value;
    const classType = document.getElementById('classType').value;
    const date = document.getElementById('classDate').value;
    const editIndex = document.getElementById('editIndex').value;

    if(name && classType && date) {
        const bookingData = { name, classType, date };
        let bookings = getBookingsFromStorage();

        if (editIndex === "") {
            // Create New
            bookings.push(bookingData);
        } else {
            // Update Existing
            bookings[editIndex] = bookingData;
            document.getElementById('editIndex').value = ""; // Reset index
            submitBtn.innerText = "Book Now";
            submitBtn.style.backgroundColor = "var(--primary-color)";
        }

        localStorage.setItem('gymBookings', JSON.stringify(bookings));
        gymForm.reset();
        loadBookings();
    }
});

// Get Data from Local Storage
function getBookingsFromStorage() {
    return localStorage.getItem('gymBookings') ? JSON.parse(localStorage.getItem('gymBookings')) : [];
}

// Render Table (Read)
function loadBookings() {
    const bookings = getBookingsFromStorage();
    bookingTableBody.innerHTML = '';

    if (bookings.length === 0) {
        noBookingMsg.style.display = 'block';
    } else {
        noBookingMsg.style.display = 'none';
        bookings.forEach((booking, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${booking.name}</td>
                <td>${booking.classType}</td>
                <td>${booking.date}</td>
                <td>
                    <button class="action-btn edit-btn" onclick="editBooking(${index})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" onclick="deleteBooking(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            bookingTableBody.appendChild(row);
        });
    }
}

// Delete Booking
function deleteBooking(index) {
    if(confirm('Are you sure you want to delete this booking?')) {
        let bookings = getBookingsFromStorage();
        bookings.splice(index, 1);
        localStorage.setItem('gymBookings', JSON.stringify(bookings));
        
        // Reset form if we were editing the deleted item
        if(document.getElementById('editIndex').value == index) {
            gymForm.reset();
            document.getElementById('editIndex').value = "";
            submitBtn.innerText = "Book Now";
        }
        
        loadBookings();
    }
}

// Edit Booking
function editBooking(index) {
    let bookings = getBookingsFromStorage();
    const booking = bookings[index];

    // Populate form
    document.getElementById('userName').value = booking.name;
    document.getElementById('classType').value = booking.classType;
    document.getElementById('classDate').value = booking.date;
    document.getElementById('editIndex').value = index;

    // Change button style
    submitBtn.innerText = "Update Class";
    submitBtn.style.backgroundColor = "#00e676"; // Green color for update

    // Scroll to form
    document.querySelector('.booking-section').scrollIntoView({ behavior: 'smooth' });
}