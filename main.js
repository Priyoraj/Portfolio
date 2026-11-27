// Sections opened from the navigation bar stop just below it, however tall the bar is
function setNavHeight() {
  document.documentElement.style.setProperty('--nav-height', document.querySelector('.nav-bar').offsetHeight + 'px');
}
setNavHeight();
window.addEventListener('resize', setNavHeight);

// About / Skills / Education tabs: show the chosen panel and highlight its button
const tabs = document.querySelectorAll(".nav-tabs .btn");
tabs.forEach(function (tab) {
  tab.onclick = function () {
    tabs.forEach(function (other) {
      other.classList.toggle("active", other === tab);
      document.getElementById(other.dataset.target).style.display = other === tab ? "block" : "none";
    });
  };
});

document.addEventListener('DOMContentLoaded', function() {
  const typedTextElement = document.getElementById('typed-text');
  const data = JSON.parse(typedTextElement.getAttribute('data-type'));
  const period = parseInt(typedTextElement.getAttribute('data-period'), 10);

  let index = 0;
  let letterIndex = 0;

  function typeText() {
    if (letterIndex <= data[index].length) {
      typedTextElement.textContent = data[index].substring(0, letterIndex);
      letterIndex++;
      setTimeout(typeText, 100); // Adjust the delay between letters
    } else {
      setTimeout(eraseText, period);
    }
  }

  function eraseText() {
    if (letterIndex >= 0) {
      typedTextElement.textContent = data[index].substring(0, letterIndex);
      letterIndex--;
      setTimeout(eraseText, 30); // Adjust the delay between erased letters
    } else {
      index = (index + 1) % data.length;
      setTimeout(typeText, 300); // Adjust the delay before typing the next text
    }
  }

  setTimeout(typeText, 300); // Adjust the delay before starting the typing animation

  // Keep the copyright year current
  document.getElementById('year').textContent = new Date().getFullYear();
});


// Add an event listener to handle the scroll
window.addEventListener('scroll', function() {
  // Get the #second element
  var secondElement = document.getElementById('second');

  // Get the position of the #second element relative to the viewport
  var rect = secondElement.getBoundingClientRect();

  // Check if the #second element is in the viewport
  if (rect.top <= window.innerHeight && rect.bottom >= 0) {
      // Add the hover-effect class if it's in the viewport
      secondElement.classList.add('hover-effect');
  } else {
      // Remove the hover-effect class if it's not in the viewport
      secondElement.classList.remove('hover-effect');
  }
});

// Light / dark switch; the choice is remembered on this device
var themeButton = document.getElementById('theme-toggle');

function showTheme(theme) {
  var next = theme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', theme);
  themeButton.innerHTML = '<i class="fa-solid fa-' + (theme === 'dark' ? 'sun' : 'moon') + '" aria-hidden="true"></i>';
  themeButton.setAttribute('aria-label', 'Switch to ' + next + ' mode');
  themeButton.title = 'Switch to ' + next + ' mode';
}

showTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');

themeButton.onclick = function () {
  var theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  showTheme(theme);
  try {
    localStorage.setItem('theme', theme);
  } catch (e) {}
};
