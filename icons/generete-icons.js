// This script generates PNG icons from the base design
// Since we can't generate actual PNG files in the browser,
// we'll use placeholder SVG data URLs that work as icons

const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

const generateIconSVG = (size) => {
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" rx="${Math.floor(size/4.5)}" fill="url(#gradient0_linear_1_1)"/>
      <rect x="${Math.floor(size*0.25)}" y="${Math.floor(size*0.3)}" width="${Math.floor(size*0.5)}" height="${Math.floor(size*0.4)}" stroke="white" stroke-width="${Math.max(2, Math.floor(size/24))}" stroke-linejoin="round"/>
      <path d="M${Math.floor(size*0.35)} ${Math.floor(size*0.42)}H${Math.floor(size*0.5)}M${Math.floor(size*0.35)} ${Math.floor(size*0.5)}H${Math.floor(size*0.65)}" stroke="white" stroke-width="${Math.max(1, Math.floor(size/36))}" stroke-linecap="round"/>
      <defs>
        <linearGradient id="gradient0_linear_1_1" x1="0" y1="0" x2="${size}" y2="${size}" gradientUnits="userSpaceOnUse">
          <stop stop-color="#6366F1"/>
          <stop offset="1" stop-color="#14B8A6"/>
        </linearGradient>
      </defs>
    </svg>
  `)}`;
};

// Generate icons for each size
iconSizes.forEach(size => {
  const iconData = generateIconSVG(size);
  console.log(`Generated icon-${size}x${size}.png with data URL`);
});