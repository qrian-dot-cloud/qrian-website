(() => {
  const body = document.body;

  const showCornerDrop = body.dataset.cornerDrop === 'true';
  const hideHint = body.dataset.hideHint === 'true';

  if (showCornerDrop) {
    body.insertAdjacentHTML('afterbegin', '<div id="corner-drop"></div>');
  }

  const shell = `
    <div class="sidebar">
      <div>
        <a class="logo" href="qrian.html">QRIAN</a>
        <div class="code-nav">
          <span class="fn">print</span><br>
          <a href="hello.html">("Hello,</a><br>
          <a href="world.html">world!")</a>
        </div>
      </div>

      <div class="footer-links">
        © 2026 QRIAN. All rights reserved.
        <br>
        Contact: <a href="mailto:qqqrian@gmail.com">qqqrian@gmail.com</a>
      </div>
    </div>
  `;

  body.insertAdjacentHTML('afterbegin', shell);

  if (!hideHint) {
    body.insertAdjacentHTML(
      'beforeend',
      `<div class="tear-hint">
        /* Your tear resonates when it meets other tears.
        <br>
        Click once to wake it. */
      </div>`
    );
  }
})();
