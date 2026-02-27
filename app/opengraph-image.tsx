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
          'linear-gradient(125deg, rgb(2, 6, 23) 0%, rgb(15, 23, 42) 45%, rgb(15, 118, 110) 100%)',
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
        <p style={{ fontSize: '28px', letterSpacing: '0.18em', opacity: 0.8 }}>
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
          Senior Full Stack Engineer (8+ years)
        </p>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
