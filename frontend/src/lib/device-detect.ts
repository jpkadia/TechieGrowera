export type ClientDeviceInfo = {
  os: string;
  browser: string;
  device: string;
};

let cachedInfo: ClientDeviceInfo | null = null;

/**
 * Accurately detects OS version (iOS 17, Android 13/14, Windows 11/10 via Client Hints),
 * browser version (Chrome 128, Safari 17), and device category in the browser.
 */
export async function getClientDeviceInfo(): Promise<ClientDeviceInfo> {
  if (cachedInfo) return cachedInfo;
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return { os: 'Unknown OS', browser: 'Unknown Browser', device: 'Desktop' };
  }

  const ua = navigator.userAgent;
  const uaLower = ua.toLowerCase();
  let os = 'Unknown OS';
  let device = 'Desktop';

  // 1. Device category
  const isTablet =
    /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk)/i.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isMobile =
    !isTablet &&
    /(android|bb\d+|meego|mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino)/i.test(
      ua,
    );

  if (isTablet) {
    device = 'Tablet';
  } else if (isMobile) {
    device = 'Mobile';
  }

  // 2. Android (e.g. Android 14, Android 13, Android 12)
  const androidMatch = ua.match(/android\s+([0-9]+(?:\.[0-9]+)*)/i);
  if (androidMatch) {
    const fullVer = androidMatch[1];
    const parts = fullVer.split('.');
    const major = parts[0];
    const minor = parts[1];
    if (minor && minor !== '0' && parseInt(major, 10) < 10) {
      os = `Android ${major}.${minor}`;
    } else {
      os = `Android ${major}`;
    }
  }
  // 3. iOS / iPadOS (e.g. iOS 17, iPadOS 17, iOS 18)
  else if (
    isTablet &&
    (/ipad/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1))
  ) {
    const ipadMatch = ua.match(/(?:ipad.*os|cpu\s+os)\s+([0-9_]+)/i);
    const ver = ipadMatch ? ipadMatch[1].replace(/_/g, '.').split('.')[0] : '';
    os = ver ? `iPadOS ${ver}` : 'iPadOS';
  } else if (/iphone|ipod/i.test(ua)) {
    const iosMatch = ua.match(/(?:iphone\s+os|cpu\s+(?:iphone\s+)?os)\s+([0-9_]+)/i);
    const ver = iosMatch ? iosMatch[1].replace(/_/g, '.').split('.')[0] : '';
    os = ver ? `iOS ${ver}` : 'iOS';
  }
  // 4. Windows (Detects Windows 11 vs Windows 10 via Client Hints)
  else if (/windows/i.test(ua)) {
    if (/windows nt 6\.3/i.test(ua)) os = 'Windows 8.1';
    else if (/windows nt 6\.2/i.test(ua)) os = 'Windows 8';
    else if (/windows nt 6\.1/i.test(ua)) os = 'Windows 7';
    else if (/windows nt 10\.0/i.test(ua) || /windows nt 11\.0/i.test(ua)) {
      // Default to Windows 10
      os = 'Windows 10';
      // Query User-Agent Client Hints API for Windows 11
      const navAny = navigator as unknown as {
        userAgentData?: {
          platform?: string;
          getHighEntropyValues?: (hints: string[]) => Promise<{ platformVersion?: string }>;
        };
      };
      if (navAny.userAgentData?.getHighEntropyValues) {
        try {
          const hints = await navAny.userAgentData.getHighEntropyValues(['platformVersion']);
          if (hints?.platformVersion) {
            const major = parseInt(hints.platformVersion.replace(/"/g, '').split('.')[0], 10);
            if (major >= 13) {
              os = 'Windows 11';
            } else if (major > 0) {
              os = 'Windows 10';
            }
          }
        } catch {
          // ignore error
        }
      }
    } else {
      os = 'Windows';
    }
  }
  // 5. macOS
  else if (/macintosh|mac os x/i.test(ua)) {
    const macMatch = ua.match(/mac\s+os\s+x\s+([0-9_]+)/i);
    if (macMatch) {
      const ver = macMatch[1].replace(/_/g, '.');
      const major = parseInt(ver.split('.')[0], 10);
      if (major === 15) os = 'macOS 15 (Sequoia)';
      else if (major === 14) os = 'macOS 14 (Sonoma)';
      else if (major === 13) os = 'macOS 13 (Ventura)';
      else if (major === 12) os = 'macOS 12 (Monterey)';
      else if (major === 11) os = 'macOS 11 (Big Sur)';
      else if (ver.startsWith('10.15')) os = 'macOS';
      else os = `macOS ${major}`;
    } else {
      os = 'macOS';
    }
  }
  // 6. Chrome OS
  else if (/cros/i.test(ua)) {
    os = 'Chrome OS';
  }
  // 7. Linux
  else if (/linux/i.test(ua)) {
    os = 'Linux';
  }

  // Browser detection with major version
  let browser = 'Unknown Browser';
  const edg = ua.match(/edg(?:e|ios|a)?\/([0-9]+)/i);
  const samsung = ua.match(/samsungbrowser\/([0-9]+)/i);
  const opera = ua.match(/(?:opr|opera|opt)\/([0-9]+)/i);
  const chrome = ua.match(/(?:chrome|crios)\/([0-9]+)/i);
  const firefox = ua.match(/(?:firefox|fxios)\/([0-9]+)/i);
  const safari = ua.match(/version\/([0-9]+).*safari/i);

  if (edg) browser = `Edge ${edg[1]}`;
  else if (samsung) browser = `Samsung Internet ${samsung[1]}`;
  else if (opera) browser = `Opera ${opera[1]}`;
  else if (chrome && !uaLower.includes('edg/')) browser = `Chrome ${chrome[1]}`;
  else if (firefox) browser = `Firefox ${firefox[1]}`;
  else if (safari && !uaLower.includes('chrome/') && !uaLower.includes('crios/')) browser = `Safari ${safari[1]}`;
  else if (uaLower.includes('safari') && !uaLower.includes('chrome/')) browser = 'Safari';

  cachedInfo = { os, browser, device };
  return cachedInfo;
}
