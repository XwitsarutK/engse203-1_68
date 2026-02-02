# Mini E-Commerce Store

A simple, responsive e-commerce website built with vanilla HTML, CSS, and JavaScript.

## Features

- 📦 Product catalog with filtering and sorting
- 🛒 Shopping cart functionality
- 💾 Persistent cart using localStorage
- 📱 Responsive design for mobile and desktop
- 🎨 Clean and modern UI
- ⚡ Fast and lightweight (no frameworks required)

## Project Structure

```
mini-ecommerce/
├── index.html          # Main HTML file
├── js/
│   ├── main.js        # JavaScript logic
│   └── products.json  # Product data
├── css/
│   └── style.css      # Styling
└── README.md          # Documentation
```

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local web server (optional, but recommended)

### Installation

1. Clone or download this repository
2. Navigate to the project directory

### Running the Application

#### Option 1: Using a Local Server (Recommended)

Using Python 3:
```bash
python3 -m http.server 8000
```

Using Node.js (http-server):
```bash
npx http-server -p 8000
```

Then open your browser and navigate to `http://localhost:8000`

#### Option 2: Direct File Access

Simply open `index.html` in your web browser. Note that some browsers may restrict loading JSON files from the local file system.

## Features Overview

### Product Filtering
- Filter products by category (Electronics, Home, Sports)
- Sort products by name or price

### Shopping Cart
- Add products to cart
- Adjust quantities with +/- buttons
- Remove items from cart
- View real-time total
- Cart persists across browser sessions

### Responsive Design
- Mobile-friendly layout
- Optimized for various screen sizes
- Touch-friendly controls

## Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with Flexbox and Grid
- **JavaScript (ES6+)**: Vanilla JS with async/await
- **LocalStorage**: Client-side data persistence

## Customization

### Adding Products

Edit `js/products.json` to add or modify products:

```json
{
    "id": 11,
    "name": "Product Name",
    "price": 99.99,
    "category": "Category",
    "description": "Product description",
    "image": "image-url"
}
```

### Styling

Modify `css/style.css` to customize:
- Colors
- Fonts
- Layout
- Spacing

### Functionality

Edit `js/main.js` to add features such as:
- Product search
- User reviews
- Wishlist
- Multiple payment methods

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- [ ] User authentication
- [ ] Product search functionality
- [ ] Product detail pages
- [ ] Wishlist feature
- [ ] Order history
- [ ] Payment integration
- [ ] Backend API integration
- [ ] User reviews and ratings

## License

This project is open source and available for educational purposes.

## Author

Created as a mini project for ENGSE203.

## Contributing

Feel free to fork this project and submit pull requests for any improvements.
