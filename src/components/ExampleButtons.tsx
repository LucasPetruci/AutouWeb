"use client";

import { Button, Space } from "antd";
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
  return (
    <Space size={8} style={{ width: "100%", justifyContent: "flex-end" }}>
      <Button
        type="default"
        size="small"
        icon={<ThunderboltOutlined />}
        onClick={onLoadProductive}
        style={{
          borderRadius: 8,
          borderColor: "#52c41a",
          color: "#52c41a",
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
        }}
      >
        {translations.exampleUnproductive}
      </Button>
    </Space>
  );
}
