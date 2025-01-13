export default function getPlatform() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;

  // Platform detection
  const isEmulator = /Chrome/.test(userAgent) && /Mobile/.test(userAgent);
  const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
  const isAndroid = /android/i.test(userAgent);
  const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent);

  // Device type detection
  const isMobile =
    /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
      userAgent
    );

  return {
    type:
      isEmulator || !isMobile
        ? "Desktop"
        : isIOS
        ? "iOS"
        : isAndroid
        ? "Android"
        : "Mobile",
    isIOS,
    isAndroid,
    isSafari,
    isMobile: !isEmulator && isMobile,
  };
}
