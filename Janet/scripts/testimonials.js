document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.testimonial-card');

  cards.forEach(card => {
    const handleMouseMove = e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const halfWidth  = rect.width / 2;
      const halfHeight = rect.height / 2;
      // Normalized [-1,1]
      const xNorm = (x - halfWidth)  / halfWidth;
      const yNorm = (y - halfHeight) / halfHeight;
      const maxTilt = 10; // degrees
      const tiltY =  xNorm * maxTilt;
      const tiltX = -yNorm * maxTilt;
      card.style.transform = `
        rotateX(${tiltX}deg)
        rotateY(${tiltY}deg)
      `;
    };

    const handleMouseLeave = () => {
      card.style.transform = '';
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
  });
});
