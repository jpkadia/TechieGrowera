import { ImageResponse } from 'next/og';
export function socialImage(title: string, label = 'WEB · CREATIVE · GROWTH') {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '70px 80px',
        background: '#092d49',
        color: 'white',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: 26,
        }}
      >
        <span>
          Techie <span style={{ color: '#7ce2db' }}>Growera</span>
        </span>
        <span style={{ color: '#7ce2db', fontSize: 18 }}>{label}</span>
      </div>
      <div
        style={{
          display: 'flex',
          maxWidth: 1030,
          fontSize: title.length > 65 ? 57 : 70,
          lineHeight: 1.1,
          letterSpacing: -3,
        }}
      >
        {title}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          borderTop: '1px solid #547080',
          paddingTop: 24,
          fontSize: 20,
          color: '#b8d5df',
        }}
      >
        <span>Your brand. Engineered to grow.</span>
        <span style={{ color: '#7ce2db' }}>↗</span>
      </div>
    </div>,
    { width: 1200, height: 630 },
  );
}
