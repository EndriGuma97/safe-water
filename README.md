# Filtra Uji Website - 6-Stage RO Compact System

Modern, bilingual website for water filter rental business in Albania.

## 🚀 Features

### Design
- ✨ Extremely modern and beautiful UI/UX
- 🎨 Gradient color scheme with water theme (blues, teals)
- 📱 Fully responsive (mobile, tablet, desktop)
- ⚡ Smooth animations and transitions
- 🎭 Glassmorphism effects
- 💫 Floating cards and parallax effects

### Functionality
- 🌐 **Bilingual** - Albanian (default) and English
- 🔄 Language switcher with localStorage persistence
- 📜 Smooth scroll navigation
- 📊 Animated sections on scroll
- 📱 Mobile-responsive hamburger menu
- 🎯 Interactive CTA buttons

### Sections
1. **Hero Section** - Eye-catching introduction with statistics
2. **About Section** - System overview and key features
3. **System Section** - Detailed 6-phase filtration explanation
4. **Benefits Section** - Why rent the system
5. **Pricing Section** - Three pricing plans (Monthly, Yearly, Trial)
6. **Contact Section** - Contact info + Zoho form placeholder
7. **Footer** - Links and social media

## 📁 File Structure

```
Safe-Water/
├── index.html          # Main HTML file
├── logo.png           # Company logo
├── css/
│   └── style.css      # All styles and animations
├── js/
│   └── script.js      # All JavaScript functionality
├── info.txt           # Marketing strategy document
├── about.txt          # Product information
└── README.md          # This file
```

## 🔧 How to Use

### 1. Basic Setup
Simply open `index.html` in a web browser. The website works without any server.

### 2. Add Zoho Form
Replace the placeholder in `index.html` at the Contact section:

```html
<!-- Find this section -->
<div class="form-placeholder">
    <!-- Replace with your Zoho form embed code -->
</div>
```

### 3. Update Content
- **Prices**: Search for "XX" or "XXX" in `index.html` and replace with actual prices
- **Contact Info**: Update phone, email, address in the Contact section
- **Images**: Replace the image placeholders with actual product photos

### 4. Customize Colors
Edit CSS variables in `css/style.css`:

```css
:root {
    --primary-color: #00B4D8;
    --secondary-color: #0077B6;
    --accent-color: #90E0EF;
    /* ... */
}
```

## 🌐 Language Switching

The website supports Albanian (SQ) and English (EN):
- Default language: Albanian
- Click the language toggle button in navigation
- Language preference is saved in browser localStorage
- All content is translated including navigation, sections, and forms

## 📱 Responsive Breakpoints

- Desktop: > 1024px
- Tablet: 768px - 1024px
- Mobile: < 768px
- Small Mobile: < 480px

## 🎨 Color Scheme

- Primary: #00B4D8 (Cyan)
- Secondary: #0077B6 (Blue)
- Accent: #90E0EF (Light Blue)
- Dark: #03045E (Navy)
- Light: #CAF0F8 (Pale Blue)

## ⚡ Performance

- Lightweight and fast loading
- Optimized animations
- Debounced scroll events
- CSS transitions for smooth effects
- No external dependencies except Google Fonts

## 📋 TODO / Next Steps

- [ ] Replace placeholder prices with actual values
- [ ] Add Zoho form integration
- [ ] Add real product images
- [ ] Update contact information
- [ ] Test on all devices
- [ ] Add meta tags for SEO
- [ ] Add Open Graph tags for social sharing
- [ ] Consider adding Google Analytics

## 🛠️ Technologies Used

- HTML5
- CSS3 (with CSS Grid, Flexbox, Animations)
- Vanilla JavaScript (ES6+)
- Google Fonts (Poppins)

## 📄 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 👨‍💻 Development

No build process required. Edit HTML, CSS, and JS files directly.

To make changes:
1. Edit files in your preferred code editor
2. Refresh browser to see changes
3. Test on multiple devices/browsers

## 📞 Support

For questions or modifications, refer to the code comments in each file.

---

**Built with 💧 for Filtra Uji - Pure Water for Every Home**
