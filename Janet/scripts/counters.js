document.addEventListener('DOMContentLoaded', () => {
  const counters = document.querySelectorAll('.counter-number');
  const canvas   = document.getElementById('counters-confetti');

  // Maak een confetti‑instance gebonden aan dit specifieke canvas
  const myConfetti = confetti.create(canvas, {
    resize: true,  // canvas schaalt mee met viewport
    useWorker: true
  });

  let completed = 0;
  const total   = counters.length;

  const animateCount = el => {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 2000;
    let startTime  = null;

    const step = timestamp => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const value    = Math.min(
        Math.floor((progress / duration) * target),
        target
      );
      el.textContent = `${value}%`;

      if (progress < duration) {
        requestAnimationFrame(step);
      } else {
        el.textContent = `${target}%`;
        completed += 1;

        // Zodra alle counters klaar zijn, confetti los!
        if (completed === total) {
  // eerste burst relatief laag
  myConfetti({
    particleCount: 60,
    spread:        80,
    origin:       { x: 0.3, y: 1.2 }
  });
  // tweede burst iets breder en laag
  myConfetti({
    particleCount: 60,
    spread:        80,
    origin:       { x: 0.7, y: 1 }
  });
}

      }
    };

    requestAnimationFrame(step);
  };

  // IntersectionObserver start de animatie zodra counters in beeld komen
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, {
    root:       null,
    threshold:  0
  });

  counters.forEach(counter => observer.observe(counter));
});
