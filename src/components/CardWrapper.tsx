interface CardWrapperProps {
  title?: React.ReactNode;
  extra?: React.ReactNode;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export function CardWrapper({ title, extra, children, style }: CardWrapperProps) {
  return (
    <div style={{ padding: 24, ...style }}>
      {(title || extra) && (
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
          paddingBottom: 16,
          borderBottom: "1px solid #f0f0f0",
        }}>
          {title && <div>{title}</div>}
          {extra && <div>{extra}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}
