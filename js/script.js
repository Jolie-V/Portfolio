document.addEventListener('DOMContentLoaded', () => {
  if (window.location.hash === '#projects') {
    window.history.replaceState(null, document.title, window.location.pathname + window.location.search);
    window.scrollTo(0, 0);
  }

  const container = document.getElementById('mosaic-container');
  const rows = 7;
  const cols = 12;
  const colors = ['#0B1E33', '#013C58', '#00537A','#004666', '#013751','#0E2743'];

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  // Determines which columns are visible for a given row
  const getVisibleColsSet = (row) => {
    const maxCols = cols;
    const minCols = 3;
    const progress = row / (rows - 1);
    let numCols = Math.round(maxCols - progress * (maxCols - minCols));
    numCols += Math.floor(Math.random() * 3) - 1;
    numCols = Math.max(minCols, Math.min(maxCols, numCols));

    const visibleSet = new Set();

    // Bottom rows: show pixels on the edges, AVOID the middle
    if (row >= rows - 2) {
      const edgeCount = Math.floor(numCols / 2);
      for (let i = 0; i < edgeCount; i++) {
        visibleSet.add(i);
        visibleSet.add(cols - 1 - i);
      }
      if (numCols % 2 === 1) {
        const middle = Math.floor(cols / 2) + (Math.random() > 0.5 ? 1 : -1);
        visibleSet.add(middle);
      }
    } else {
      // Top rows: show a centered block of pixels
      const startCol = Math.floor((cols - numCols) / 2);
      for (let i = startCol; i < startCol + numCols; i++) {
        visibleSet.add(i);
      }
    }
    return visibleSet;
  };

  // Build the grid
  const squares = [];
  for (let row = 0; row < rows; row++) {
    const visibleColsSet = getVisibleColsSet(row);

    for (let col = 0; col < cols; col++) {
      const square = document.createElement('div');
      square.className = 'mosaic-square';
      const isVisible = visibleColsSet.has(col);

      // Add slight randomness to drip (skip some pixels)
      const skipChance = (row / rows) * 0.2;
      const shouldSkip = isVisible && Math.random() < skipChance;

      if (!isVisible || shouldSkip) {
        square.style.display = 'none';
      } else {
        square.style.opacity = '0';
        square.dataset.color = colors[Math.floor(Math.random() * colors.length)];
      }
      square.dataset.row = row;
      square.dataset.col = col;
      container.appendChild(square);
      squares.push(square);
    }
  }

  // Animation loop for a single square
  const animateSquare = async (square) => {
    const row = parseInt(square.dataset.row);
    // Transparent duration: 0s for row 0, 10s for row 6
    const transparentDuration = (row / (rows - 1)) * 10000;

    while (true) {
      // 1. Wait while transparent (drip timing)
      await sleep(transparentDuration);

      // 2. Change color
      const newColor = colors[Math.floor(Math.random() * colors.length)];
      square.style.backgroundColor = newColor;

      // 3. Fade In
      square.style.transition = 'opacity 1200ms ease';
      square.style.opacity = '1';

      // 4. Stay Opaque (2 to 5 seconds)
      await sleep(2000 + Math.random() * 3000);

      // 5. Fade Out
      square.style.transition = 'opacity 800ms ease';
      square.style.opacity = '0';
    }
  };

  // Start animation for each visible square
  const visibleSquares = document.querySelectorAll('.mosaic-square:not([style*="display: none"])');
  visibleSquares.forEach((square) => {
    const initialDelay = Math.random() * 2000;
    setTimeout(() => {
      animateSquare(square).catch(console.error);
    }, initialDelay);
  });

  // Initial wave effect (top to bottom)
  const initWave = async () => {
    for (let row = 0; row < rows; row++) {
      const rowSquares = document.querySelectorAll(`.mosaic-square[data-row="${row}"]:not([style*="display: none"])`);
      rowSquares.forEach((sq, index) => {
        setTimeout(() => {
          sq.style.transition = 'opacity 1000ms ease';
          sq.style.opacity = '0.3';
        }, index * 50);
      });
      await sleep(200);
    }
    await sleep(1000);
    visibleSquares.forEach((sq) => {
      sq.style.transition = 'opacity 1500ms ease';
      sq.style.opacity = (Math.random() * 0.5 + 0.5).toString();
    });
    await sleep(1500);
    visibleSquares.forEach((sq) => {
      sq.style.transition = 'opacity 800ms ease';
      sq.style.opacity = '0';
    });
  };

  initWave().catch(console.error);
});

  /* =========================================================
     ABOUT ME TAB SWITCHING
  ========================================================= */

  const aboutTabs = document.querySelectorAll('.about-tab');
  const aboutContents = document.querySelectorAll('.about-content');


  aboutTabs.forEach(tab => {

    tab.addEventListener('click', () => {

      const target = tab.dataset.tab;


      // Remove active state from all tabs
      aboutTabs.forEach(item => {
        item.classList.remove('active');
      });


      // Remove active state from all content
      aboutContents.forEach(content => {
        content.classList.remove('active');
      });


      // Activate clicked tab
      tab.classList.add('active');


      // Activate corresponding content
      const selectedContent =
        document.getElementById(target);

      if (selectedContent) {
        selectedContent.classList.add('active');
      }
    });

  });

  /* =========================================================
     PROJECT CARD NAVIGATION
  ========================================================= */

  document.querySelectorAll('.project-card').forEach(card => {
    const openProject = () => {
      const projectId = card.dataset.project;
      if (projectId) {
        window.location.href = `project-details.html?id=${encodeURIComponent(projectId)}`;
      }
    };

    card.addEventListener('click', (event) => {
      // Let the live-project link follow its own destination.
      if (event.target.closest('.live-link')) {
        return;
      }

      openProject();
    });

    card.addEventListener('keydown', (event) => {
      if (event.target.closest('.live-link')) {
        return;
      }

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openProject();
      }
    });
  });