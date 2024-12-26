export default function getPlatform() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;

  const isEmulator =
    /Chrome/.test(navigator.userAgent) && /Mobile/.test(navigator.userAgent);

  const isMobile =
    /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
      userAgent
    );

  if (isEmulator || !isMobile) {
    return "Desktop";
  }

  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return "iOS";
  }

  if (/android/i.test(userAgent)) {
    return "Android";
  }

  return "Mobile";
}
