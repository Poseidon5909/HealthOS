import { Activity } from 'lucide-react';

const variants = {
  hero: {
    outerSize: 112,
    outerRadius: 28,
    outerBackground: 'rgba(255,255,255,0.2)',
    outerBorder: '1px solid rgba(255,255,255,0.28)',
    outerShadow: '0 20px 50px rgba(15, 23, 42, 0.24)',
    innerSize: 72,
    innerRadius: 22,
    innerBackground: 'linear-gradient(160deg, #ffffff 0%, #dbeafe 100%)',
    innerShadow: '0 16px 30px rgba(30, 64, 175, 0.24)',
    iconSize: 38,
    iconColor: '#2563eb',
    titleColor: '#ffffff',
    subtitleColor: 'rgba(255,255,255,0.72)',
  },
  sidebar: {
    outerSize: 44,
    outerRadius: 16,
    outerBackground: 'rgba(255,255,255,0.15)',
    outerBorder: '1px solid rgba(255,255,255,0.2)',
    outerShadow: '0 12px 24px rgba(15, 23, 42, 0.16)',
    innerSize: 32,
    innerRadius: 12,
    innerBackground: '#ffffff',
    innerShadow: '0 6px 14px rgba(15, 23, 42, 0.12)',
    iconSize: 18,
    iconColor: '#4f46e5',
    titleColor: '#ffffff',
    subtitleColor: 'rgba(255,255,255,0.72)',
  },
};

function BrandMark({
  variant = 'hero',
  title = 'HealthOS',
  subtitle,
  titleStyle = {},
  subtitleStyle = {},
  containerStyle = {},
  badgeStyle = {},
}) {
  const theme = variants[variant] || variants.hero;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        ...containerStyle,
      }}
    >
      <div
        style={{
          width: theme.outerSize,
          height: theme.outerSize,
          borderRadius: theme.outerRadius,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: theme.outerBackground,
          border: theme.outerBorder,
          boxShadow: theme.outerShadow,
          backdropFilter: 'blur(12px)',
          flexShrink: 0,
          ...badgeStyle,
        }}
      >
        <div
          style={{
            width: theme.innerSize,
            height: theme.innerSize,
            borderRadius: theme.innerRadius,
            background: theme.innerBackground,
            boxShadow: theme.innerShadow,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Activity size={theme.iconSize} strokeWidth={2.4} color={theme.iconColor} />
        </div>
      </div>

      <div>
        <h1
          style={{
            margin: 0,
            color: theme.titleColor,
            fontSize: variant === 'sidebar' ? 20 : 48,
            fontWeight: 800,
            letterSpacing: variant === 'sidebar' ? -0.4 : -1.5,
            lineHeight: 1.05,
            ...titleStyle,
          }}
        >
          {title}
        </h1>
        {subtitle ? (
          <p
            style={{
              margin: variant === 'sidebar' ? '3px 0 0' : '12px 0 0',
              color: theme.subtitleColor,
              fontSize: variant === 'sidebar' ? 12 : 16,
              fontWeight: variant === 'sidebar' ? 500 : 400,
              letterSpacing: variant === 'sidebar' ? 0.5 : 0,
              lineHeight: 1.6,
              ...subtitleStyle,
            }}
          >
            {subtitle}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default BrandMark;