export interface ParsedUserAgent {
  os: string;
  browser: string;
  device: string;
}

export interface ClientOverrides {
  os?: string;
  browser?: string;
  device?: string;
}

/**
 * Extracts OS name and exact version (e.g. iOS 17, Android 14, Windows 11, macOS 14 (Sonoma)).
 */
export function parseOS(
  uaString: string = '',
  platformVersionHint?: string,
  clientOs?: string
): string {
  // If client provided a valid non-empty OS name, honor it (e.g. detected via Client Hints in browser)
  if (clientOs && typeof clientOs === 'string' && clientOs !== 'Unknown OS' && clientOs.length <= 40) {
    return clientOs.trim();
  }

  const ua = uaString.toLowerCase();

  // If Chromium Client Hints header `sec-ch-ua-platform-version` is provided
  if (platformVersionHint && typeof platformVersionHint === 'string') {
    const cleanVer = platformVersionHint.replace(/"/g, '').trim();
    const major = parseInt(cleanVer.split('.')[0], 10);
    if (!Number.isNaN(major)) {
      // In Chromium / Edge on Windows:
      // Windows 11 platformVersion >= 13.0.0
      // Windows 10 platformVersion is 1.0.0 to 10.0.0
      if (major >= 13) return 'Windows 11';
      if (major > 0) return 'Windows 10';
    }
  }

  // Android version detection (e.g., Android 14, Android 13, Android 8.1)
  const androidMatch = uaString.match(/android\s+([0-9]+(?:\.[0-9]+)*)/i);
  if (androidMatch) {
    const fullVer = androidMatch[1];
    const parts = fullVer.split('.');
    const major = parts[0];
    const minor = parts[1];
    if (minor && minor !== '0' && parseInt(major, 10) < 10) {
      return `Android ${major}.${minor}`;
    }
    return `Android ${major}`;
  }

  // iPadOS detection (e.g. iPadOS 17, iPadOS 16)
  if (ua.includes('ipad')) {
    const match = uaString.match(/(?:ipad.*os|cpu\s+os)\s+([0-9_]+)/i);
    const ver = match ? match[1].replace(/_/g, '.').split('.')[0] : '';
    return ver ? `iPadOS ${ver}` : 'iPadOS';
  }

  // iOS detection (e.g. iOS 17, iOS 16)
  if (ua.includes('iphone') || ua.includes('ipod')) {
    const match = uaString.match(/(?:iphone\s+os|cpu\s+(?:iphone\s+)?os)\s+([0-9_]+)/i);
    const ver = match ? match[1].replace(/_/g, '.').split('.')[0] : '';
    return ver ? `iOS ${ver}` : 'iOS';
  }

  // Windows detection
  if (ua.includes('windows nt 10.0') || ua.includes('windows nt 11.0')) {
    return 'Windows 11 / 10';
  }
  if (ua.includes('windows nt 6.3')) return 'Windows 8.1';
  if (ua.includes('windows nt 6.2')) return 'Windows 8';
  if (ua.includes('windows nt 6.1')) return 'Windows 7';
  if (ua.includes('windows')) return 'Windows';

  // macOS detection (macOS 15 (Sequoia), macOS 14 (Sonoma), macOS 13 (Ventura), etc.)
  const macMatch = uaString.match(/mac\s+os\s+x\s+([0-9_]+)/i);
  if (macMatch) {
    const ver = macMatch[1].replace(/_/g, '.');
    const major = parseInt(ver.split('.')[0], 10);
    if (major === 15) return 'macOS 15 (Sequoia)';
    if (major === 14) return 'macOS 14 (Sonoma)';
    if (major === 13) return 'macOS 13 (Ventura)';
    if (major === 12) return 'macOS 12 (Monterey)';
    if (major === 11) return 'macOS 11 (Big Sur)';
    if (ver.startsWith('10.15')) return 'macOS';
    return `macOS ${major}`;
  }

  if (ua.includes('cros')) return 'Chrome OS';
  if (ua.includes('linux')) return 'Linux';

  return 'Unknown OS';
}

/**
 * Extracts browser name and major version (e.g. Chrome 128, Safari 17, Edge 128).
 */
export function parseBrowser(uaString: string = '', clientBrowser?: string): string {
  if (clientBrowser && typeof clientBrowser === 'string' && clientBrowser !== 'Unknown Browser' && clientBrowser.length <= 40) {
    return clientBrowser.trim();
  }

  const ua = uaString;
  const uaLower = uaString.toLowerCase();

  const edg = ua.match(/edg(?:e|ios|a)?\/([0-9]+)/i);
  if (edg) return `Edge ${edg[1]}`;

  const samsung = ua.match(/samsungbrowser\/([0-9]+)/i);
  if (samsung) return `Samsung Internet ${samsung[1]}`;

  const opera = ua.match(/(?:opr|opera|opt)\/([0-9]+)/i);
  if (opera) return `Opera ${opera[1]}`;

  const chrome = ua.match(/(?:chrome|crios)\/([0-9]+)/i);
  if (chrome && !uaLower.includes('edg/')) return `Chrome ${chrome[1]}`;

  const firefox = ua.match(/(?:firefox|fxios)\/([0-9]+)/i);
  if (firefox) return `Firefox ${firefox[1]}`;

  const safari = ua.match(/version\/([0-9]+).*safari/i);
  if (safari && !uaLower.includes('chrome/') && !uaLower.includes('crios/')) return `Safari ${safari[1]}`;
  if (uaLower.includes('safari') && !uaLower.includes('chrome/')) return 'Safari';

  const uc = ua.match(/ucbrowser\/([0-9]+)/i);
  if (uc) return `UC Browser ${uc[1]}`;

  if (uaLower.includes('msie') || uaLower.includes('trident/')) return 'Internet Explorer';

  return 'Unknown Browser';
}

/**
 * Extracts device category: Mobile, Tablet, or Desktop.
 */
export function parseDevice(uaString: string = '', clientDevice?: string): string {
  if (clientDevice && (clientDevice === 'Mobile' || clientDevice === 'Tablet' || clientDevice === 'Desktop')) {
    return clientDevice;
  }

  const ua = uaString.toLowerCase();
  const isTablet =
    /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk)/i.test(ua);
  if (isTablet) return 'Tablet';

  const isMobile =
    /(android|bb\d+|meego|mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino)/i.test(
      ua
    );
  if (isMobile) return 'Mobile';

  return 'Desktop';
}

/**
 * Lightweight, zero-dependency User-Agent and Device parser.
 * Combines server UA strings, Client Hints headers, and optional client-side high-entropy detections.
 */
export function parseUserAgent(
  uaString: string = '',
  platformVersionHint?: string,
  clientOverrides?: ClientOverrides
): ParsedUserAgent {
  return {
    os: parseOS(uaString, platformVersionHint, clientOverrides?.os),
    browser: parseBrowser(uaString, clientOverrides?.browser),
    device: parseDevice(uaString, clientOverrides?.device),
  };
}

/**
 * Check if the user agent is a search crawler or automated bot.
 */
export function isBot(uaString: string = ''): boolean {
  const ua = uaString.toLowerCase();
  return (
    ua.includes('googlebot') ||
    ua.includes('bingbot') ||
    ua.includes('yandexbot') ||
    ua.includes('duckduckbot') ||
    ua.includes('slurp') ||
    ua.includes('baiduspider') ||
    ua.includes('lighthouse') ||
    ua.includes('chrome-lighthouse') ||
    ua.includes('headlesschrome') ||
    ua.includes('petalbot') ||
    ua.includes('ahrefsbot') ||
    ua.includes('semrushbot') ||
    ua.includes('bytespider') ||
    ua.includes('applebot') ||
    ua.includes('facebookexternalhit') ||
    ua.includes('twitterbot') ||
    ua.includes('linkedinbot') ||
    ua.includes('slackbot') ||
    ua.includes('spider') ||
    ua.includes('crawler')
  );
}
