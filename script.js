
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

  if (profileImage.complete && profileImage.naturalWidth === 0) {
    handleImageError();
  }
}

/* =========================
   2. 공통 호버 환경
========================= */
const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);

const hoverSupported = window.matchMedia(
  "(hover: hover) and (pointer: fine)"
);

/* =========================
   3. 카드 전체 호버 효과
========================= */
function initCardHover() {
  const card = document.querySelector(".card");

  if (!card) return;

  const normalShadow =
    "0 15px 50px rgba(0, 0, 0, 0.45)";

  const hoverShadow =
    "0 22px 60px rgba(8, 113, 210, 0.25)";

  const updateStyle = () => {
    const hovered =
      hoverSupported.matches && card.matches(":hover");

    card.style.transition = reducedMotion.matches
      ? "none"
      : "transform 0.25s ease, box-shadow 0.25s ease";

    card.style.transform =
      hovered && !reducedMotion.matches
        ? "translateY(-4px)"
        : "translateY(0)";

    card.style.boxShadow = hovered
      ? hoverShadow
      : normalShadow;
  };

  card.addEventListener("mouseenter", updateStyle);
  card.addEventListener("mouseleave", updateStyle);

  reducedMotion.addEventListener("change", updateStyle);
  hoverSupported.addEventListener("change", updateStyle);

  updateStyle();
}

/* =========================
   4. 이메일 / 전화 / GitHub
      버튼 호버 효과
========================= */
function initContactButtonHover() {
  const buttons = document.querySelectorAll(".contact-button");

  if (!buttons.length) return;

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

    const updateStyle = () => {
      const hovered =
        hoverSupported.matches && button.matches(":hover");

      button.style.transition = reducedMotion.matches
        ? "none"
        : [
            "transform 0.25s ease",
            "box-shadow 0.25s ease",
            "background-color 0.25s ease"
          ].join(", ");

      button.style.transform =
        hovered && !reducedMotion.matches
          ? "translateY(-4px)"
          : "translateY(0)";

      button.style.boxShadow = hovered
        ? hoverShadow
        : normalShadow;

      button.style.backgroundColor = hovered
        ? colors.hover
        : colors.normal;
    };

    button.addEventListener("mouseenter", updateStyle);
    button.addEventListener("mouseleave", updateStyle);

    reducedMotion.addEventListener("change", updateStyle);
    hoverSupported.addEventListener("change", updateStyle);

    updateStyle();
  });
}

/* =========================
   5. 해시태그 색상 반전 호버
   신규 추가 기능
========================= */
function initTagHover() {
  const tags = document.querySelectorAll(".tag");

  if (!tags.length) return;

  const tagColors = {
    normalBackground: "#124b87",
    normalText: "#ffffff",
    hoverBackground: "#ffffff",
    hoverText: "#124b87"
  };

  tags.forEach((tag) => {
    const updateStyle = () => {
      const hovered =
        hoverSupported.matches && tag.matches(":hover");

      // 사용자 모션 설정에 따른 전환 효과
      tag.style.transition = reducedMotion.matches
        ? "none"
        : [
            "background-color 0.2s ease",
            "color 0.2s ease"
          ].join(", ");

      // 배경색 반전
      tag.style.backgroundColor = hovered
        ? tagColors.hoverBackground
        : tagColors.normalBackground;

      // 글자색 반전
      tag.style.color = hovered
        ? tagColors.hoverText
        : tagColors.normalText;
    };

    // 마우스를 올렸을 때
    tag.addEventListener("mouseenter", updateStyle);

    // 마우스가 벗어났을 때
    tag.addEventListener("mouseleave", updateStyle);

    // 모션 설정 변경 대응
    reducedMotion.addEventListener("change", updateStyle);

    // 마우스 지원 환경 변경 대응
    hoverSupported.addEventListener("change", updateStyle);

    // 초기 스타일
    updateStyle();
  });
}

/* =========================
   6. 이메일 주소 복사
========================= */
function initEmailCopy() {
  const emailLinks = document.querySelectorAll(
    '.contact-info a[href^="mailto:"]'
  );

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
        showCopyMessage("이메일 주소 복사에 실패했습니다.");
      }
    });
  });
}

/* =========================
   7. 전화번호 복사
========================= */
function initPhoneCopy() {
  const phoneLinks = document.querySelectorAll(
    '.contact-info a[href^="tel:"]'
  );

  phoneLinks.forEach((link) => {
    link.addEventListener("click", async (event) => {
      // 전화번호 텍스트 클릭 시 전화 앱 실행 방지
      event.preventDefault();

      const phoneNumber = link.textContent.trim();

      if (!phoneNumber) return;

      try {
        await copyToClipboard(phoneNumber);
        showCopyMessage("전화번호가 복사되었습니다.");
      } catch (error) {
        console.error("전화번호 복사 실패:", error);
        showCopyMessage("전화번호 복사에 실패했습니다.");
      }
    });
  });
}

/* =========================
   8. 클립보드 복사 공통 함수
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

  // Clipboard API를 사용할 수 없는 환경
  const textarea = document.createElement("textarea");

  textarea.value = text;
  textarea.setAttribute("readonly", "");

  Object.assign(textarea.style, {
    position: "fixed",
    left: "-9999px",
    top: "0",
    opacity: "0"
  });

  const previousFocus = document.activeElement;

  document.body.appendChild(textarea);

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
   9. 복사 완료 알림 메시지
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
   10. 전체 기능 초기화
========================= */
function init() {
  initProfileImage();
  initCardHover();
  initContactButtonHover();
  initTagHover();
  initEmailCopy();
  initPhoneCopy();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, {
    once: true
  });
} else {
  init();
}
