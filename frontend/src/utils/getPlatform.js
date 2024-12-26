export default function getPlatform() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;

  // iOS detection
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return "iOS";
  }

  // Android detection
  if (/android/i.test(userAgent)) {
    return "Android";
  }

  // Desktop detection
  if (window.innerWidth >= 768) {
    return "Desktop";
  }

  return "Mobile";
}
