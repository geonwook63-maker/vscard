'use strict';

/* =========================
   프로필 이미지 오류 처리
========================= */
function initProfileImage() {
  const profileImage = document.getElementById('profileImage');

  if (!profileImage) return;

  const handleImageError = () => {
    profileImage.hidden = true;
  };

  profileImage.addEventListener('error', handleImageError);

  if (profileImage.complete && profileImage.naturalWidth === 0) {
    handleImageError();
  }
}

/* =========================
   카드 호버 효과 (JavaScript)
========================= */
function initCardHover() {
  const card = document.querySelector('.card');

  if (!card) return;

  // 모션 최소화 설정 확인
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const normalShadow = '0 15px 50px rgba(0, 0, 0, 0.3)';
  const hoverShadow = '0 22px 60px rgba(8, 113, 210, 0.25)';

  const applyNormalStyle = () => {
    card.style.transform = 'translateY(0)';
    card.style.boxShadow = normalShadow;
  };

  const applyHoverStyle = () => {
    if (reducedMotion.matches) return;

    card.style.transform = 'translateY(-4px)';
    card.style.boxShadow = hoverShadow;
  };

  // CSS :hover 대신 JS 이벤트 사용
  card.addEventListener('mouseenter', applyHoverStyle);
  card.addEventListener('mouseleave', applyNormalStyle);

  // 모션 최소화 설정 변경 대응
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) {
      applyNormalStyle();
    }
  });

  // 터치 기기에서 불필요한 호버 효과 방지
  if (window.matchMedia('(hover: hover)').matches) {
    card.style.transition = reducedMotion.matches
      ? 'none'
      : 'transform 0.25s ease, box-shadow 0.25s ease';

    applyNormalStyle();
  }
}

/* =========================
   이메일 클립보드 복사
========================= */
function initEmailCopy() {
  const emailLinks = document.querySelectorAll('a[href^="mailto:"]');

  if (emailLinks.length === 0) return;

  emailLinks.forEach((link) => {
    link.addEventListener('click', async (event) => {
      event.preventDefault();

      const href = link.getAttribute('href');

      if (!href) return;

      const email = href
        .replace(/^mailto:/i, '')
        .split('?')[0]
        .trim();

      if (!email) return;

      try {
        await copyToClipboard(email);
        showCopyMessage('이메일 주소가 복사되었습니다.');
      } catch (error) {
        console.error('이메일 복사 실패:', error);

        showCopyMessage(
          '복사에 실패했습니다. 이메일 주소를 직접 복사해 주세요.',
        );
      }
    });
  });
}

/* =========================
   클립보드 복사 함수
========================= */
async function copyToClipboard(text) {
  if (
    window.isSecureContext &&
    navigator.clipboard &&
    typeof navigator.clipboard.writeText === 'function'
  ) {
    await navigator.clipboard.writeText(text);
    return;
  }

  // Clipboard API 미지원 환경 대응
  const textarea = document.createElement('textarea');

  textarea.value = text;
  textarea.setAttribute('readonly', '');

  Object.assign(textarea.style, {
    position: 'fixed',
    left: '-9999px',
    top: '0',
    opacity: '0',
  });

  document.body.appendChild(textarea);

  const previousFocus = document.activeElement;

  try {
    textarea.focus();
    textarea.select();

    const success = document.execCommand('copy');

    if (!success) {
      throw new Error('클립보드 복사를 지원하지 않습니다.');
    }
  } finally {
    textarea.remove();

    if (previousFocus && typeof previousFocus.focus === 'function') {
      previousFocus.focus({preventScroll: true});
    }
  }
}

/* =========================
   복사 알림 메시지
========================= */
let copyMessageTimer = null;

function showCopyMessage(message) {
  let toast = document.getElementById('copyToast');

  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'copyToast';

    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');

    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '30px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: '#0871d2',
      color: '#ffffff',
      padding: '12px 20px',
      borderRadius: '10px',
      fontSize: '14px',
      fontWeight: '600',
      textAlign: 'center',
      maxWidth: 'calc(100% - 32px)',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
      zIndex: '9999',
      opacity: '0',
      transition: 'opacity 0.2s ease',
      pointerEvents: 'none',
    });

    document.body.appendChild(toast);
  }

  if (copyMessageTimer !== null) {
    clearTimeout(copyMessageTimer);
  }

  toast.textContent = message;
  toast.style.opacity = '1';

  copyMessageTimer = window.setTimeout(() => {
    toast.style.opacity = '0';
    copyMessageTimer = null;
  }, 2500);
}

/* =========================
   초기화
========================= */
function init() {
  initProfileImage();
  initCardHover();
  initEmailCopy();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, {
    once: true,
  });
} else {
  init();
}
