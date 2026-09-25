export interface ParsedUserAgent {
  os: string;
  browser: string;
  device: string;
}

/**
 * Lightweight, zero-dependency User-Agent parser.
 * Extracts OS, Browser, and Device category reliably without heavy dependencies.
 */
export function parseUserAgent(uaString: string = ''): ParsedUserAgent {
  const ua = uaString.toLowerCase();

  // 1. Detect OS & Hardware Platform
  let os = 'Unknown OS';
  if (ua.includes('windows nt 10.0') || ua.includes('windows nt 11.0')) os = 'Windows 10/11';
  else if (ua.includes('windows')) os = 'Windows';
  else if (ua.includes('iphone')) os = 'iOS (iPhone)';
  else if (ua.includes('ipad')) os = 'iPadOS (iPad)';
  else if (ua.includes('ipod')) os = 'iOS (iPod)';
  else if (ua.includes('android')) os = 'Android';
  else if (ua.includes('mac os x') || ua.includes('macintosh')) os = 'macOS';
  else if (ua.includes('linux')) os = 'Linux';
  else if (ua.includes('cros')) os = 'Chrome OS';

  // 2. Detect Browser
  let browser = 'Unknown Browser';
  if (ua.includes('edg/') || ua.includes('edge/') || ua.includes('edga/') || ua.includes('edgios/')) browser = 'Edge';
  else if (ua.includes('samsungbrowser/')) browser = 'Samsung Internet';
  else if (ua.includes('opr/') || ua.includes('opera/') || ua.includes('opt/')) browser = 'Opera';
  else if (ua.includes('crios/') || (ua.includes('chrome/') && !ua.includes('edg/'))) browser = 'Chrome';
  else if (ua.includes('fxios/') || ua.includes('firefox/')) browser = 'Firefox';
  else if (ua.includes('safari/') && !ua.includes('chrome/') && !ua.includes('crios/')) browser = 'Safari';
  else if (ua.includes('ucbrowser/')) browser = 'UC Browser';
  else if (ua.includes('msie') || ua.includes('trident/')) browser = 'Internet Explorer';

  // 3. Detect Device Category
  let device = 'Desktop';
  if (ua.includes('ipad') || (ua.includes('tablet') && !ua.includes('mobile')) || (ua.includes('android') && !ua.includes('mobile'))) {
    device = 'Tablet';
  } else if (ua.includes('iphone') || ua.includes('mobile') || ua.includes('android')) {
    device = 'Mobile';
  }

  return { os, browser, device };
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
    ua.includes('semrushbot')
  );
}
