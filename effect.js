document.addEventListener("DOMContentLoaded", () => {
  // Animate the header on page load
  anime({
    targets: '.header',
    translateY: [-50, 0],
    opacity: [0, 1],
    duration: 1000,
    easing: 'easeOutQuart'
  });

  // Add hover effect to buttons
  const buttons = document.querySelectorAll('button, .download-link');
  buttons.forEach(button => {
    button.addEventListener('mouseenter', () => {
      anime({
        targets: button,
        scale: 1.05,
        duration: 200,
        easing: 'easeInOutQuad'
      });
    });

    button.addEventListener('mouseleave', () => {
      anime({
        targets: button,
        scale: 1,
        duration: 200,
        easing: 'easeInOutQuad'
      });
    });
  });
});