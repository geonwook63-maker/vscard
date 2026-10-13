
"use strict";

/* =========================
   1. 프로필 이미지 오류 처리
========================= */
function initProfileImage() {
  const profileImage = document.getElementById("profileImage");

  if (!profileImage) return;

  const handleImageError = () => {
    profileImage.hidden = true;
  };

  profileImage.addEventListener("error", handleImageError);

  if (
    profileImage.complete &&
    profileImage.naturalWidth === 0
  ) {
    handleImageError();
  }
}

/* =========================
   2. 카드 전체 호버 효과
========================= */
function initCardHover() {
  const card = document.querySelector(".card");

  if (!card) return;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  const hoverSupported = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  );

  const normalShadow =
    "0 15px 50px rgba(0, 0, 0, 0.45)";

  const hoverShadow =
    "0 22px 60px rgba(8, 113, 210, 0.25)";

  const applyNormalStyle = () => {
    card.style.transform = "translateY(0)";
    card.style.boxShadow = normalShadow;
  };

  const applyHoverStyle = () => {
    if (!hoverSupported.matches) {
      applyNormalStyle();
      return;
    }

    card.style.transform = reducedMotion.matches
      ? "translateY(0)"
      : "translateY(-4px)";

    card.style.boxShadow = hoverShadow;
  };

  const updateTransition = () => {
    card.style.transition = reducedMotion.matches
      ? "none"
      : [
          "transform 0.25s ease",
          "box-shadow 0.25s ease"
        ].join(", ");
  };

  const updateCardStyle = () => {
    updateTransition();

    if (
      hoverSupported.matches &&
      card.matches(":hover")
    ) {
      applyHoverStyle();
    } else {
      applyNormalStyle();
    }
  };

  updateTransition();
  applyNormalStyle();

  card.addEventListener(
    "mouseenter",
    applyHoverStyle
  );

  card.addEventListener(
    "mouseleave",
    applyNormalStyle
  );

  reducedMotion.addEventListener(
    "change",
    updateCardStyle
  );

  hoverSupported.addEventListener(
    "change",
    updateCardStyle
  );
}

/* =========================
   3. 이메일 / 전화 / GitHub
      버튼 호버 효과
========================= */
function initContactButtonHover() {
  const buttons = document.querySelectorAll(
    ".contact-button"
  );

  if (buttons.length === 0) return;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  const hoverSupported = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  );

  const buttonColors = {
    email: {
      normal: "#0871d2",
      hover: "#0a84f5"
    },
    phone: {
      normal: "#064a91",
      hover: "#075db4"
    },
    github: {
      normal: "#243449",
      hover: "#334b68"
    }
  };

  const normalShadow =
    "0 4px 12px rgba(0, 0, 0, 0.2)";

  const hoverShadow =
    "0 10px 25px rgba(8, 113, 210, 0.4)";

  buttons.forEach((button) => {
    let buttonType = "email";

    if (button.classList.contains("phone-button")) {
      buttonType = "phone";
    } else if (button.classList.contains("github-button")) {
      buttonType = "github";
    }

    const colors = buttonColors[buttonType];

    const applyNormalStyle = () => {
      button.style.transform = "translateY(0)";
      button.style.boxShadow = normalShadow;
      button.style.backgroundColor = colors.normal;
    };

    const applyHoverStyle = () => {
      if (!hoverSupported.matches) {
        applyNormalStyle();
        return;
      }

      button.style.transform = reducedMotion.matches
        ? "translateY(0)"
        : "translateY(-4px)";

      button.style.boxShadow = hoverShadow;
      button.style.backgroundColor = colors.hover;
    };

    const updateTransition = () => {
      button.style.transition = reducedMotion.matches
        ? "none"
        : [
            "transform 0.25s ease",
            "box-shadow 0.25s ease",
            "background-color 0.25s ease"
          ].join(", ");
    };

    const updateButtonStyle = () => {
      updateTransition();

      if (
        hoverSupported.matches &&
        button.matches(":hover")
      ) {
        applyHoverStyle();
      } else {
        applyNormalStyle();
      }
    };

    updateTransition();
    applyNormalStyle();

    button.addEventListener(
      "mouseenter",
      applyHoverStyle
    );

    button.addEventListener(
      "mouseleave",
      applyNormalStyle
    );

    reducedMotion.addEventListener(
      "change",
      updateButtonStyle
    );

    hoverSupported.addEventListener(
      "change",
      updateButtonStyle
    );
  });
}

/* =========================
   4. 이메일 주소 클립보드 복사
========================= */
function initEmailCopy() {
  const emailLinks = document.querySelectorAll(
    '.contact-info a[href^="mailto:"]'
  );

  if (emailLinks.length === 0) return;

  emailLinks.forEach((link) => {
    link.addEventListener("click", async (event) => {
      event.preventDefault();

      const href = link.getAttribute("href");

      if (!href) return;

      const email = href
        .replace(/^mailto:/i, "")
        .split("?")[0]
        .trim();

      if (!email) return;

      try {
        await copyToClipboard(email);

        showCopyMessage(
          "이메일 주소가 복사되었습니다."
        );
      } catch (error) {
        console.error(
          "이메일 복사 실패:",
          error
        );

        showCopyMessage(
          "이메일 주소 복사에 실패했습니다."
        );
      }
    });
  });
}

/* =========================
   5. 전화번호 클립보드 복사
========================= */
function initPhoneCopy() {
  // 연락처의 전화번호만 복사 대상으로 설정
  // 하단 전화하기 버튼은 제외
  const phoneLinks = document.querySelectorAll(
    '.contact-info a[href^="tel:"]'
  );

  if (phoneLinks.length === 0) return;

  phoneLinks.forEach((link) => {
    link.addEventListener("click", async (event) => {
      // 전화 앱 실행 방지
      event.preventDefault();

      // 화면에 표시된 전화번호 추출
      const phoneNumber = link.textContent.trim();

      if (!phoneNumber) return;

      try {
        await copyToClipboard(phoneNumber);

        showCopyMessage(
          "전화번호가 복사되었습니다."
        );
      } catch (error) {
        console.error(
          "전화번호 복사 실패:",
          error
        );

        showCopyMessage(
          "전화번호 복사에 실패했습니다."
        );
      }
    });
  });
}

/* =========================
   6. 클립보드 복사 함수
========================= */
async function copyToClipboard(text) {
  if (
    window.isSecureContext &&
    navigator.clipboard &&
    typeof navigator.clipboard.writeText === "function"
  ) {
    await navigator.clipboard.writeText(text);
    return;
  }

  // Clipboard API 미지원 환경 대응
  const textarea = document.createElement(
    "textarea"
  );

  textarea.value = text;
  textarea.setAttribute("readonly", "");

  Object.assign(textarea.style, {
    position: "fixed",
    left: "-9999px",
    top: "0",
    opacity: "0"
  });

  document.body.appendChild(textarea);

  const previousFocus = document.activeElement;

  try {
    textarea.focus();
    textarea.select();

    const success = document.execCommand("copy");

    if (!success) {
      throw new Error(
        "클립보드 복사를 지원하지 않습니다."
      );
    }
  } finally {
    textarea.remove();

    if (
      previousFocus &&
      typeof previousFocus.focus === "function"
    ) {
      previousFocus.focus({
        preventScroll: true
      });
    }
  }
}

/* =========================
   7. 복사 완료 알림 메시지
========================= */
let copyMessageTimer = null;

function showCopyMessage(message) {
  let toast = document.getElementById(
    "copyToast"
  );

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "copyToast";

    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");

    Object.assign(toast.style, {
      position: "fixed",
      bottom: "30px",
      left: "50%",
      transform: "translateX(-50%)",
      backgroundColor: "#0871d2",
      color: "#ffffff",
      padding: "12px 20px",
      borderRadius: "10px",
      fontSize: "14px",
      fontWeight: "600",
      textAlign: "center",
      maxWidth: "calc(100% - 32px)",
      boxShadow:
        "0 8px 24px rgba(0, 0, 0, 0.3)",
      zIndex: "9999",
      opacity: "0",
      transition: "opacity 0.2s ease",
      pointerEvents: "none"
    });

    document.body.appendChild(toast);
  }

  if (copyMessageTimer !== null) {
    clearTimeout(copyMessageTimer);
  }

  toast.textContent = message;
  toast.style.opacity = "1";

  copyMessageTimer = window.setTimeout(() => {
    toast.style.opacity = "0";
    copyMessageTimer = null;
  }, 2500);
}

/* =========================
   8. 초기화
========================= */
function init() {
  initProfileImage();
  initCardHover();
  initContactButtonHover();
  initEmailCopy();
  initPhoneCopy();
}

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    init,
    { once: true }
  );
} else {
  init();
}
