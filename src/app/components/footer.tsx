import React from 'react';
import Link from 'next/link';

const Footer = () => {

    return (
        <nav className="flex flex-col left-0 bg-white px-2 py-4 text-custom-blue">
            <div className="flex items-center justify-between flex-shrink-0">
            <p className="text-lg max-w-28 lg:max-w-96 text-center">Mary Lou Sussmeier <span className="font-medium">Watercolors</span></p>
                <div className="flex flex-col space-y-4 text-sm max-w-[20rem] pl-8">
                    <div className="flex flex-row space-x-5 text-center sm:p-2 pt-2">
                    <Link className="text-md hover:text-gray-500" href={'/terms'}>Terms of Use</Link>
                    <Link className="text-md hover:text-gray-500" href={'/privacy'}>Privacy Policy</Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Footer;