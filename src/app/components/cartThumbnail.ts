import { getImageProps } from 'next/image';
import { preload } from 'react-dom';

export const CART_THUMBNAIL_SIZES = '(min-width: 640px) 128px, 96px';

// The cart asks the optimizer for a width nothing else on the site uses, so a
// fresh item would otherwise wait on the full-size original being resized.
export function preloadCartThumbnail(src: string) {
    const { props } = getImageProps({ src, alt: '', fill: true, sizes: CART_THUMBNAIL_SIZES });
    preload(props.src, {
        as: 'image',
        imageSrcSet: props.srcSet,
        imageSizes: props.sizes,
        fetchPriority: 'low',
    });
}
