import React from 'react';
import { IconType } from 'react-icons';
import { IconBaseProps } from 'react-icons/lib';

export const createIconElement = (Icon: IconType, props: IconBaseProps = {}) => {
    return React.createElement(Icon as unknown as React.ComponentType<IconBaseProps>, props);
};
