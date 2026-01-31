import React, { ReactNode } from 'react';

import { Card, Grid } from 'antd';

type Props = {
    title?: ReactNode;
    extra?: ReactNode;
    children: ReactNode;
    style?: React.CSSProperties;
};

export function CardWrapper({ title, extra, children, style }: Props) {
    const { lg: isDesktop } = Grid.useBreakpoint();

    const size = isDesktop ? 'default' : 'small';

    return (
        <Card
            title={title}
            extra={extra}
            size={size}
            style={style}
        >
            {children}
        </Card>
    );
}
