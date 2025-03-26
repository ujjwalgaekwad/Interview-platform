import React, { ReactNode } from 'react';

interface ContainerProps {
    children: ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children }) => {
    return <div className="w-full max-w-7xl mx-auto px-4">{children}</div>;
};

export default Container;
