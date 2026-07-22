import type { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            src="/kkn aktivis (5)(1).png"
            alt="Logo KKN Aktivis"
            {...props}
            className={`object-contain ${props.className || ''}`}
        />
    );
}


