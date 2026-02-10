/* Externalized JS for payment.html */
window.addEventListener('DOMContentLoaded', function(){
  // helper: copy to clipboard with fallback
  function copyText(text){
    if(navigator.clipboard && navigator.clipboard.writeText){
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function(resolve,reject){
      var ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.left = '-9999px';
      document.body.appendChild(ta); ta.select();
      try{ document.execCommand('copy'); document.body.removeChild(ta); resolve(); }
      catch(e){ document.body.removeChild(ta); reject(e) }
    });
  }

  // attach behaviors
  document.querySelectorAll('.item').forEach(function(card){
    var num = card.getAttribute('data-number') || '';
    var copyBtn = card.querySelector('.btn.copy');
    var copiedEl = card.querySelector('.copied');
    var numberEl = card.querySelector('.number');

    // clicking the visible number also copies
    numberEl.addEventListener('click', function(){ triggerCopy(); });
    numberEl.addEventListener('keydown', function(e){ if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); triggerCopy(); } });

    // copy button
    copyBtn.addEventListener('click', function(){ triggerCopy(); });

    function triggerCopy(){
      copyBtn.disabled = true;
      copyText(num).then(function(){
        showCopied();
      }).catch(function(){
        showCopied();
      }).finally(function(){ copyBtn.disabled = false; });
    }

    var timeout = null;
    function showCopied(){
      // visual state on button
      copyBtn.classList.add('copied');
      copyBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#16a34a" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg><span class="label">Copied</span>';

      copiedEl.classList.add('show'); copiedEl.setAttribute('aria-hidden','false');
      clearTimeout(timeout);
      timeout = setTimeout(function(){
        copiedEl.classList.remove('show'); copiedEl.setAttribute('aria-hidden','true');
        // restore button
        copyBtn.classList.remove('copied');
        copyBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none"><path d="M16 1H4a2 2 0 0 0-2 2v12" stroke="#0f172a" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg><span class="label">Copy</span>';
      }, 1400);
    }
  });

  // swap in external logo images when available; keep SVG fallback otherwise
  document.querySelectorAll('.logo').forEach(function(logo){
    var img = logo.querySelector('img.logo-img');
    var svg = logo.querySelector('.svg-fallback');
    if(!img) return;
    // if already loaded successfully, hide fallback
    if(img.complete && img.naturalWidth > 0){ if(svg) svg.style.display = 'none'; img.style.display = 'block'; return; }
    img.addEventListener('load', function(){ if(svg) svg.style.display = 'none'; img.style.display = 'block'; });
    img.addEventListener('error', function(){ if(svg) svg.style.display = 'block'; img.style.display = 'none'; });
  });
});
