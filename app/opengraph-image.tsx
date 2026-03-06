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
        position: 'relative',
        background:
          'linear-gradient(135deg,#020203 0%,#090b0f 45%,#0f1116 100%)',
        color: 'white',
        padding: '64px',
        flexDirection: 'column',
        justifyContent: 'space-between',
        fontFamily: 'Inter, Manrope, sans-serif',
      }}
    >
      {/* Glow background accents */}
      <div
        style={{
          position: 'absolute',
          right: '-120px',
          top: '-120px',
          width: '500px',
          height: '500px',
          borderRadius: '999px',
          background:
            'radial-gradient(circle, rgba(56,189,248,0.35) 0%, rgba(56,189,248,0.08) 45%, rgba(0,0,0,0) 70%)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: '-160px',
          bottom: '-160px',
          width: '520px',
          height: '520px',
          borderRadius: '999px',
          background:
            'radial-gradient(circle, rgba(74,222,128,0.30) 0%, rgba(74,222,128,0.05) 45%, rgba(0,0,0,0) 70%)',
        }}
      />

      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            fontSize: 20,
            opacity: 0.8,
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 999,
            padding: '10px 18px',
            background: 'rgba(255,255,255,0.05)',
            alignSelf: 'flex-start',
          }}
        >
          Isaiah Francois
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            marginTop: 40,
            fontSize: 84,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: -3,
            maxWidth: 820,
          }}
        >
          <span>Building modern</span>
          <span>digital products.</span>
        </div>

        <div
          style={{
            marginTop: 22,
            fontSize: 30,
            opacity: 0.75,
          }}
        >
          Senior Full Stack Engineer · React · Next.js · Product Engineering
        </div>
      </div>

      {/* Bottom Section */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}
      >
        {/* availability */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              background: '#4ade80',
              marginRight: 14,
            }}
          />
          <div style={{ fontSize: 26 }}>
            Available for work · 7+ years experience
          </div>
        </div>

        {/* FinanceFlow glass card */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: 360,
            borderRadius: 26,
            border: '1px solid rgba(255,255,255,0.15)',
            background: 'rgba(255,255,255,0.06)',
            padding: 24,
          }}
        >
          <div
            style={{
              fontSize: 16,
              opacity: 0.6,
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}
          >
            Featured Project
          </div>

          <div
            style={{
              fontSize: 40,
              fontWeight: 700,
              marginTop: 6,
            }}
          >
            FinanceFlow
          </div>

          <div
            style={{
              fontSize: 20,
              opacity: 0.7,
              marginTop: 6,
            }}
          >
            financeflow.dev
          </div>
        </div>
      </div>
    </div>,
    size,
  );
}
