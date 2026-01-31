"use client";

import { Button, Space, Grid } from "antd";
import { ThunderboltOutlined, CloseCircleOutlined } from "@ant-design/icons";

type ExampleButtonsProps = {
  onLoadProductive: () => void;
  onLoadUnproductive: () => void;
  translations: {
    exampleProductive: string;
    exampleUnproductive: string;
  };
};

export function ExampleButtons({ 
  onLoadProductive, 
  onLoadUnproductive, 
  translations 
}: ExampleButtonsProps) {
  const { xs, sm } = Grid.useBreakpoint();
  const isMobile = xs || sm;

  return (
    <Space 
      size={isMobile ? 4 : 8} 
      style={{ 
        width: "100%", 
        justifyContent: isMobile ? "center" : "flex-end",
        flexWrap: "wrap",
      }}
    >
      <Button
        type="default"
        size="small"
        icon={<ThunderboltOutlined />}
        onClick={onLoadProductive}
        style={{
          borderRadius: 8,
          borderColor: "#52c41a",
          color: "#52c41a",
          fontSize: isMobile ? 12 : 14,
        }}
      >
        {translations.exampleProductive}
      </Button>
      <Button
        type="default"
        size="small"
        icon={<CloseCircleOutlined />}
        onClick={onLoadUnproductive}
        style={{
          borderRadius: 8,
          borderColor: "#faad14",
          color: "#faad14",
          fontSize: isMobile ? 12 : 14,
        }}
      >
        {translations.exampleUnproductive}
      </Button>
    </Space>
  );
}
