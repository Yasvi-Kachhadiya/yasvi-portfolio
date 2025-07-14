// Make sure this runs *after* DOM is loaded
window.onload = function () {
  const scrollTopBtn = document.getElementById("scrollTopBtn");

  window.onscroll = function () {
    if (
      document.body.scrollTop > 300 ||
      document.documentElement.scrollTop > 300
    ) {
      scrollTopBtn.style.display = "block";
    } else {
      scrollTopBtn.style.display = "none";
    }
  };
};

// Smooth scroll to top
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}
