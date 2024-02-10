import React from 'react';
import '../../App.css';

export interface HeaderProps {
    header: string;
}
export const Header: React.FC<HeaderProps> = ({ header }) => {
    return (
        <div className='header-container'>
            <h1 className='app-header'> { header } </h1>
        </div>
    )
}