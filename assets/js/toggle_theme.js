'use strict';

function getSystemScheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// Return currently color theme
function getTheme() {
  // Use any saved preference, else check for query param, else any OS/browser preference.
  let chosenTheme =
    localStorage.getItem('user-color-scheme')
    || (typeof new URLSearchParams(window.location.search).get('dark') === 'string' ? 'dark' : null)
    || getSystemScheme();

  return chosenTheme;
}

// Write chosen color theme to local storage
// Unless the system theme matches the the stored theme, in which case... remove from local storage
function saveTheme(theme) {
  if (getSystemScheme() === theme) {
    localStorage.removeItem('user-color-scheme');
  } else {
    localStorage.setItem('user-color-scheme', theme);
  }
}

function toggleIcon(theme) {
  let toggleButton = document.getElementById('scheme__toggle');
  let toggleIcon = toggleButton.getElementsByTagName('i')[0];

  toggleButton.style.color = (theme === 'dark') ? 'orange' : 'darkslategray';
  toggleIcon.className = (theme === 'dark')
    ? toggleIcon.className = 'far fa-fw fa-sun'
    : toggleIcon.className = 'fas fa-fw fa-moon';
};

function setTheme(theme) {
  for (let s = 0; s < document.styleSheets.length; s++) {
    let stylesheet = document.styleSheets[s];
    // if (stylesheet.href && stylesheet.media.mediaText && stylesheet.media.mediaText.includes('prefers-color-scheme')) {
    if (stylesheet.href) {
      let media = stylesheet.media;
      let mediaText = stylesheet.media.mediaText;

      switch (theme) {
        case 'dark':
          if (stylesheet.href.includes('dark')) {
            stylesheet.disabled = false;
            media.appendMedium('(prefers-color-scheme: light)');
            media.appendMedium('(prefers-color-scheme: dark)');
            // if (mediaText.includes('original-prefers-color-scheme')) media.deleteMedium('original-prefers-color-scheme');
          }
          if (stylesheet.href.includes('light')) {
            stylesheet.disabled = true;
            if (mediaText && mediaText.includes('(prefers-color-scheme: light)')) media.deleteMedium('(prefers-color-scheme: light)');
            if (mediaText && mediaText.includes('(prefers-color-scheme: dark)')) media.deleteMedium('(prefers-color-scheme: dark)')
            // media.appendMedium('original-prefers-color-scheme');
          }

          break;
        default: // 'light':
          if (stylesheet.href.includes('light')) {
            stylesheet.disabled = false;
            media.appendMedium('(prefers-color-scheme: dark)');
            media.appendMedium('(prefers-color-scheme: light)');
            // if (mediaText.includes('original-prefers-color-scheme')) media.deleteMedium('original-prefers-color-scheme')
          }
          if (stylesheet.href.includes('dark')) {
            stylesheet.disabled = true;
            if (mediaText && mediaText.includes('(prefers-color-scheme: light)')) media.deleteMedium('(prefers-color-scheme: light)');
            if (mediaText && mediaText.includes('(prefers-color-scheme: dark)')) media.deleteMedium('(prefers-color-scheme: dark)');
            // media.appendMedium('original-prefers-color-scheme');
          }
      }
    }
  }
}

function toggleTheme(theme) {
  if (!theme) {
    theme = (getTheme() === 'light') ? 'dark' : 'light';
  }

  toggleIcon(theme);
  setTheme(theme);
  saveTheme(theme);
}

function eventColorScheme() {
  let matchDark = window.matchMedia('(prefers-color-scheme: dark)');
  let logColorScheme = function () {
    console.info(`System color theme is ${getSystemScheme() === 'dark' ? '🌒 dark' : '☀️ light'}.`);
    console.info(`User color theme is ${getTheme() === 'dark' ? '🌒 dark' : '☀️ light'}.`);
  };

  // logColorScheme();

  let theme = getTheme();

  toggleTheme(theme);

  try {
    // Chrome & Firefox
    matchDark.addEventListener('change', (e) => {
      let theme = getTheme();

      // logColorScheme();

      toggleIcon(theme);
      saveTheme(theme);
      setTheme(theme);
    });
  } catch (e1) {
    try {
      // Safari
      matchDark.addListener((e) => {
        let theme = getTheme();

        // logColorScheme();

        toggleIcon(theme);
        saveTheme(theme);
        setTheme(theme);
      });
    } catch (e2) {
      console.error(e2);
    }
  }
}

document.addEventListener('DOMContentLoaded', eventColorScheme);
// window.onload = function () { eventColorScheme(); };
// setTimeout(function() { eventColorScheme(); }, 50);
