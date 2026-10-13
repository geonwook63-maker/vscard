
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

  // 이미지가 이미 로딩에 실패한 경우
  if (profileImage.complete && profileImage.naturalWidth === 0) {
    handleImageError();
  }
}

/* =========================
   2. 이메일 버튼 호버 효과
========================= */
function initEmailButtonHover() {
  const buttons = document.querySelectorAll(".contact-button");

  if (buttons.length === 0) return;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  const hoverSupported = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  );

  buttons.forEach((button) => {
    const normalShadow = "0 4px 12px rgba(0, 0, 0, 0.2)";
    const hoverShadow = "0 10px 25px rgba(8, 113, 210, 0.4)";

    const applyNormalStyle = () => {
      button.style.transform = "translateY(0)";
      button.style.boxShadow = normalShadow;
      button.style.backgroundColor = "#0871d2";
    };

    const applyHoverStyle = () => {
      if (!hoverSupported.matches) return;

      button.style.transform = reducedMotion.matches
        ? "translateY(0)"
        : "translateY(-4px)";

      button.style.boxShadow = hoverShadow;
      button.style.backgroundColor = "#0a84f5";
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

    // 초기 스타일
    updateTransition();
    applyNormalStyle();

    // 마우스 진입
    button.addEventListener("mouseenter", applyHoverStyle);

    // 마우스 이탈
    button.addEventListener("mouseleave", applyNormalStyle);

    // 접근성 설정 변경 대응
    reducedMotion.addEventListener("change", () => {
      updateTransition();

      if (button.matches(":hover")) {
        applyHoverStyle();
      } else {
        applyNormalStyle();
      }
    });

    // 포인터 환경 변경 대응
    hoverSupported.addEventListener("change", () => {
      if (!hoverSupported.matches) {
        applyNormalStyle();
      }
    });
  });
}

/* =========================
   3. 이메일 클립보드 복사
========================= */
function initEmailCopy() {
  const emailLinks = document.querySelectorAll(
    'a[href^="mailto:"]'
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

        showCopyMessage("이메일 주소가 복사되었습니다.");
      } catch (error) {
        console.error("이메일 복사 실패:", error);

        showCopyMessage(
          "복사에 실패했습니다. 이메일 주소를 직접 복사해 주세요."
        );
      }
    });
  });
}

/* =========================
   4. 클립보드 복사 함수
========================= */
async function copyToClipboard(text) {
  // 보안 컨텍스트에서 Clipboard API 사용
  if (
    window.isSecureContext &&
    navigator.clipboard &&
    typeof navigator.clipboard.writeText === "function"
  ) {
    await navigator.clipboard.writeText(text);
    return;
  }

  // Clipboard API 미지원 환경 대응
  const textarea = document.createElement("textarea");

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
      throw new Error("클립보드 복사를 지원하지 않습니다.");
    }
  } finally {
    textarea.remove();

    if (
      previousFocus &&
      typeof previousFocus.focus === "function"
    ) {
      previousFocus.focus({ preventScroll: true });
    }
  }
}

/* =========================
   5. 복사 완료 알림 메시지
========================= */
let copyMessageTimer = null;

function showCopyMessage(message) {
  let toast = document.getElementById("copyToast");

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
      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
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
   6. 초기화
========================= */
function init() {
  initProfileImage();
  initEmailButtonHover();
  initEmailCopy();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, {
    once: true
  });
} else {
  init();
}
