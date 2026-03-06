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
        overflow: 'hidden',
        background:
          'linear-gradient(160deg, #050506 0%, #0b0d11 52%, #0f1115 100%)',
        color: 'white',
        padding: '58px',
        flexDirection: 'column',
        justifyContent: 'space-between',
        fontFamily: 'Manrope, Inter, sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          position: 'absolute',
          top: '-190px',
          right: '-160px',
          width: '520px',
          height: '520px',
          borderRadius: '999px',
          background:
            'radial-gradient(circle, rgba(56,189,248,0.24) 0%, rgba(56,189,248,0.06) 40%, rgba(56,189,248,0) 72%)',
        }}
      />
      <div
        style={{
          display: 'flex',
          position: 'absolute',
          bottom: '-190px',
          left: '-120px',
          width: '460px',
          height: '460px',
          borderRadius: '999px',
          background:
            'radial-gradient(circle, rgba(34,197,94,0.16) 0%, rgba(34,197,94,0.05) 42%, rgba(34,197,94,0) 74%)',
        }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '26px',
          width: '100%',
          zIndex: 2,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            borderRadius: '999px',
            border: '1px solid rgba(255,255,255,0.18)',
            background: 'rgba(255,255,255,0.06)',
            padding: '10px 18px',
            fontSize: '18px',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.85)',
          }}
        >
          Isaiah Francois Portfolio
        </div>
        <p
          style={{
            margin: 0,
            fontSize: '78px',
            fontWeight: 700,
            lineHeight: 1.02,
            letterSpacing: '-0.04em',
            maxWidth: '860px',
          }}
        >
          I&apos;m Isaiah. Full stack developer building modern products.
        </p>
        <p
          style={{
            margin: 0,
            fontSize: '30px',
            lineHeight: 1.25,
            color: 'rgba(255,255,255,0.78)',
          }}
        >
          Senior Full Stack Engineer · 7+ years · FinanceFlow, enterprise
          systems, and product UX
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          width: '100%',
          zIndex: 2,
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              width: '12px',
              height: '12px',
              borderRadius: '999px',
              background: '#4ade80',
              boxShadow: '0 0 14px rgba(74,222,128,0.9)',
            }}
          />
          <p
            style={{
              margin: 0,
              fontSize: '22px',
              color: 'rgba(255,255,255,0.88)',
            }}
          >
            Available for work
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '360px',
            borderRadius: '22px',
            border: '1px solid rgba(255,255,255,0.14)',
            background: 'rgba(255,255,255,0.05)',
            padding: '18px 20px',
            gap: '8px',
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: '17px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.62)',
            }}
          >
            Featured Project
          </p>
          <p
            style={{
              margin: 0,
              fontSize: '34px',
              fontWeight: 700,
              letterSpacing: '-0.03em',
            }}
          >
            FinanceFlow
          </p>
          <p
            style={{
              margin: 0,
              fontSize: '19px',
              color: 'rgba(255,255,255,0.72)',
            }}
          >
            financeflow.dev
          </p>
        </div>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
