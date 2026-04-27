# Quick Reference - Royal Indian Heritage Theme

## 🎨 Color Palette

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| **Imperial Crimson** | `#720e0e` | Headings, navbar, primary buttons, important text |
| **Antique Gold** | `#D4AF37` | Borders, links, icons, highlights, accents |
| **Parchment** | `#FCF5E5` | Page backgrounds, section backgrounds |
| **Ivory** | `#FFFFF0` | Card backgrounds, input fields |
| **Deep Charcoal** | `#1a1a1a` | Body text, secondary text |

## 📝 Typography

| Element | Font | Weight | Transform | Letter Spacing |
|---------|------|--------|-----------|----------------|
| **Headings (h1-h6)** | Cinzel | 600 | - | 0.05em |
| **Nav Links** | Cinzel | 400-600 | UPPERCASE | 0.1em |
| **Body Text** | Lora | 400 | - | normal |
| **Buttons** | Cinzel | 500 | - | normal |

## 🎯 CSS Classes

### Text Effects
```css
.gold-foil-text          /* Gold gradient text effect */
.font-display            /* Cinzel font */
.font-serif              /* Lora font */
.font-royal              /* Cinzel font (alias) */
```

### Components
```css
.card                    /* Ivory card with corner accents */
.vintage-card            /* Parchment-style card */
.seal-of-authenticity    /* Gold wax seal icon */
.btn-royal               /* Royal crimson button with gold border */
.btn-primary             /* Primary gradient button */
.btn-outline             /* Transparent button with gold border */
.input-field             /* Ivory input with gold border */
```

### Backgrounds
```css
bg-ivory                 /* #FFFFF0 */
bg-parchment             /* #FCF5E5 */
bg-primary-600           /* #720e0e */
bg-accent-500            /* #D4AF37 */
```

### Text Colors
```css
text-crimson             /* #720e0e */
text-gold                /* #D4AF37 */
text-charcoal            /* #1a1a1a */
```

### Borders
```css
border-accent-500        /* Gold border */
border-primary-600       /* Crimson border */
```

## 🔧 Common Patterns

### Hero Section with Gold Foil Text
```jsx
<h1 className="text-4xl md:text-6xl font-bold font-display gold-foil-text">
  Royal Heritage Title
</h1>
```

### Card with Corner Accents
```jsx
<div className="card bg-ivory">
  <div className="p-6">
    <h3 className="font-display" style={{ color: '#720e0e' }}>Title</h3>
    <p className="font-serif text-gray-700">Content</p>
  </div>
</div>
```

### Seal of Authenticity
```jsx
{site.verified && (
  <div className="seal-of-authenticity" title="Verified Heritage Site"></div>
)}
```

### Royal Button
```jsx
<button className="btn-royal">
  Explore Heritage
</button>
```

### Navbar Style
```jsx
<nav 
  className="border-b-2 border-accent-500" 
  style={{ backgroundColor: '#720e0e' }}
>
  <a className="text-xs font-display uppercase tracking-widest text-white hover:text-accent-500">
    Link
  </a>
</nav>
```

### Input Field
```jsx
<input 
  className="input-field" 
  placeholder="Enter text..."
/>
```

## 🎨 Inline Styles (When Needed)

### Crimson Text
```jsx
style={{ color: '#720e0e' }}
```

### Gold Text
```jsx
style={{ color: '#D4AF37' }}
```

### Parchment Background
```jsx
style={{ backgroundColor: '#FCF5E5' }}
```

### Ivory Background
```jsx
style={{ backgroundColor: '#FFFFF0' }}
```

### Crimson Background
```jsx
style={{ backgroundColor: '#720e0e' }}
```

### Gold Border
```jsx
style={{ border: '1px solid #D4AF37' }}
```

### Deep Glow Shadow
```jsx
style={{ boxShadow: '0 4px 20px rgba(114, 14, 14, 0.08)' }}
```

## 📐 Spacing & Sizing

### Border Radius
- Cards: `1rem` (16px)
- Buttons: `0.5rem` (8px)
- Inputs: `0.5rem` (8px)

### Shadows
- Card default: `0 4px 20px rgba(114, 14, 14, 0.08)`
- Card hover: `0 8px 30px rgba(114, 14, 14, 0.15)`
- Button hover: `0 0 20px rgba(212, 175, 55, 0.3)`

### Borders
- Standard: `1px solid #D4AF37`
- Navbar: `2px solid #D4AF37`
- Emphasis: `2px solid #D4AF37`

## 🖼️ Patterns & Overlays

### Mandala Pattern (5% opacity)
```jsx
<div 
  className="absolute inset-0" 
  style={{
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.05'%3E%3Cpath d='M30 30c0-2.21-1.79-4-4-4s-4 1.79-4 4 1.79 4 4 4 4-1.79 4-4zm0-10c0-2.21-1.79-4-4-4s-4 1.79-4 4 1.79 4 4 4 4-1.79 4-4zm10 0c0-2.21-1.79-4-4-4s-4 1.79-4 4 1.79 4 4 4 4-1.79 4-4zm0 10c0-2.21-1.79-4-4-4s-4 1.79-4 4 1.79 4 4 4 4-1.79 4-4zm-10 10c0-2.21-1.79-4-4-4s-4 1.79-4 4 1.79 4 4 4 4-1.79 4-4zm10 0c0-2.21-1.79-4-4-4s-4 1.79-4 4 1.79 4 4 4 4-1.79 4-4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    backgroundSize: '60px 60px'
  }}
></div>
```

### Crimson Overlay (50% opacity)
```jsx
<div 
  className="absolute inset-0" 
  style={{ backgroundColor: 'rgba(114, 14, 14, 0.5)' }}
></div>
```

## 🎭 Component Examples

### Feature Card
```jsx
<div className="card bg-ivory group hover:scale-105 transition-transform duration-300">
  <div className="relative h-48 overflow-hidden rounded-t-2xl">
    <img src={image} alt={title} className="w-full h-full object-cover" />
  </div>
  <div className="p-6">
    <h3 className="text-xl font-display font-semibold mb-2" style={{ color: '#720e0e' }}>
      {title}
    </h3>
    <p className="font-serif text-gray-700 mb-4">
      {description}
    </p>
    <a href="#" className="inline-flex items-center font-medium" style={{ color: '#D4AF37' }}>
      Learn More →
    </a>
  </div>
</div>
```

### Stat Box
```jsx
<div 
  className="text-center p-4 rounded-lg" 
  style={{ backgroundColor: '#FCF5E5', border: '1px solid #D4AF37' }}
>
  <span className="block text-2xl font-bold font-display" style={{ color: '#720e0e' }}>
    150
  </span>
  <span className="text-sm text-gray-600 font-serif">Heritage Sites</span>
</div>
```

### Badge
```jsx
<span 
  className="px-3 py-1 rounded-full text-sm font-medium font-display" 
  style={{ backgroundColor: '#720e0e', color: 'white' }}
>
  Verified
</span>
```

## 🔍 Quick Checks

### Is it Royal Heritage?
- [ ] Uses Cinzel for headings
- [ ] Uses Lora for body text
- [ ] Has parchment or ivory background
- [ ] Uses Imperial Crimson (#720e0e) for headings
- [ ] Has Antique Gold (#D4AF37) borders/accents
- [ ] Has subtle rounded corners (not sharp)
- [ ] Has deep glow shadows (not harsh)
- [ ] Includes ornate details (corner accents, patterns)

### Common Mistakes to Avoid
- ❌ Using sharp corners (0px border-radius)
- ❌ Using bright modern colors
- ❌ Using sans-serif fonts for headings
- ❌ Using flat white backgrounds
- ❌ Using harsh black shadows
- ❌ Missing gold accents
- ❌ Forgetting uppercase for nav links

## 📱 Responsive Considerations

All components are responsive by default. Key breakpoints:
- `sm:` - 640px and up
- `md:` - 768px and up
- `lg:` - 1024px and up
- `xl:` - 1280px and up

Example:
```jsx
<h1 className="text-2xl md:text-4xl lg:text-6xl font-display gold-foil-text">
  Responsive Title
</h1>
```

---

**Quick Tip**: When in doubt, use:
- Cinzel for headings
- Lora for content
- #720e0e for important text
- #D4AF37 for accents
- Subtle rounding and gold borders
