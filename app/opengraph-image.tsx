import { ImageResponse } from 'next/og';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        background:
          'linear-gradient(180deg, rgb(6, 6, 7) 0%, rgb(12, 12, 13) 100%)',
        color: 'white',
        padding: '72px',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          maxWidth: '780px',
        }}
      >
        <p style={{ fontSize: '28px', letterSpacing: '0.18em', opacity: 0.56 }}>
          PORTFOLIO
        </p>
        <p
          style={{
            fontSize: '70px',
            fontWeight: 700,
            lineHeight: 1.05,
            margin: 0,
          }}
        >
          Isaiah Francois
        </p>
        <p style={{ fontSize: '32px', opacity: 0.9, margin: 0 }}>
          Senior Full Stack Engineer • 7+ years
        </p>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
