// Sections opened from the navigation bar stop just below it, however tall the bar is
// (not measured while the phone menu is open, which is much taller)
function setNavHeight() {
  var bar = document.querySelector('.nav-bar');
  if (bar.classList.contains('open')) return;
  document.documentElement.style.setProperty('--nav-height', bar.offsetHeight + 'px');
}
setNavHeight();
window.addEventListener('resize', setNavHeight);

// About / Skills / Education tabs: show the chosen panel and highlight its button.
// The arrow keys, Home and End move between the tabs, as in other tab controls.
const tabs = Array.prototype.slice.call(document.querySelectorAll(".nav-tabs .btn"));

function showTab(tab) {
  tabs.forEach(function (other) {
    var chosen = other === tab;
    other.classList.toggle("active", chosen);
    other.setAttribute("aria-selected", chosen ? "true" : "false");
    other.tabIndex = chosen ? 0 : -1;
    document.getElementById(other.dataset.target).style.display = chosen ? "block" : "none";
  });
}

tabs.forEach(function (tab, i) {
  tab.onclick = function () {
    showTab(tab);
  };
  tab.onkeydown = function (e) {
    var next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    var target = tabs[(next + tabs.length) % tabs.length];
    showTab(target);
    target.focus();
  };
});

document.addEventListener('DOMContentLoaded', function() {
  const typedTextElement = document.getElementById('typed-text');
  const data = JSON.parse(typedTextElement.getAttribute('data-type'));
  const period = parseInt(typedTextElement.getAttribute('data-period'), 10);

  let index = 0;
  let letterIndex = 0;

  // Visitors who ask their device for less motion see the topics without the typing effect
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

  if (reduceMotion) {
    typedTextElement.textContent = data.join(' \u00b7 ');
  } else {
    setTimeout(typeText, 300); // Adjust the delay before starting the typing animation
  }

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

// Menu button on phones and tablets, where the navigation bar is hidden
var menuButton = document.getElementById('menu-toggle');
var siteNav = document.getElementById('site-nav');

function setMenu(open) {
  siteNav.classList.toggle('open', open);
  menuButton.setAttribute('aria-expanded', open ? 'true' : 'false');
  menuButton.setAttribute('aria-label', open ? 'Close the menu' : 'Open the menu');
  menuButton.querySelector('i').className = 'fa-solid fa-' + (open ? 'xmark' : 'bars');
}

menuButton.onclick = function () {
  setMenu(!siteNav.classList.contains('open'));
};

// Choosing a section, pressing Escape or tapping outside the menu closes it
siteNav.addEventListener('click', function (e) {
  if (e.target.closest('a')) setMenu(false);
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && siteNav.classList.contains('open')) {
    setMenu(false);
    menuButton.focus();
  }
});

document.addEventListener('click', function (e) {
  var path = e.composedPath();
  if (siteNav.classList.contains('open') && path.indexOf(siteNav) < 0 && path.indexOf(menuButton) < 0) setMenu(false);
});

window.addEventListener('resize', function () {
  if (window.innerWidth > 991 && siteNav.classList.contains('open')) setMenu(false);
});
