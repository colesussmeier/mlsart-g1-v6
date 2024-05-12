import React from 'react';

const Privacy = () => {
    return (
        <div className="flex flex-col items-center min-h-[100vh]">
            <div className="max-w-[90vw] lg:max-w-[50vw] pt-8 flex flex-col items-center space-y-5">
            <h1 className="font-bold">Privacy Policy</h1>
            <h2>Effective Date: 4/12/24</h2>

            <p className="text-center">This Privacy Policy describes the ways we collect, store, use, and protect your personal information when you use our website located at www.marylousussmeier.com. By using our website you consent to the terms of this Privacy Policy.</p>

            <h2 className="font-bold">Information We Collect</h2>

            <ul>
                <li><strong>Contact Information:</strong> When you contact us directly (e.g., through the contact form), we may collect your name, email address, and any information you include in the message.</li>
                <li><strong>Order Information:</strong> When you purchase a painting, we collect your name, shipping address, email address, and phone number.</li>
                <li><strong>Payment Information:</strong> We do not store your payment information. Payments are processed securely through a third-party payment processor called Stripe.</li>
                <li><strong>Technical Information:</strong> We may automatically collect information about your device, such as your IP address, browser type, operating system, and referring website.</li>
                <li><strong>Cookies:</strong> We use cookies (small data files stored on your device) to improve your browsing experience and track website usage patterns.</li>
            </ul>

            <h2 className="font-bold">How We Use Your Information</h2>

            <ul>
                <li><strong>To communicate with you:</strong> We may use your information to respond to your inquiries or provide customer support.</li>
                <li><strong>To process orders:</strong> We use your information to complete your purchase transactions, update you on your order status, and ship your paintings.</li>
                <li><strong>To improve our website:</strong> We may use technical information and cookies to analyze traffic and website usage to enhance the user experience.</li>
                <li><strong>To send marketing communications (optional):</strong> If you opt-in to our mailing list, we may use your email address to send you newsletters, promotions, or updates about new artwork.</li> 
            </ul>

            <h2 className="font-bold">How We Share Your Information</h2>

            <ul>
                <li><strong>Payment Processors:</strong> We share your payment information with trusted third-party payment processors to securely handle transactions.</li>
                <li><strong>Shipping Companies:</strong> We share your name and shipping address with shipping carriers to ensure your paintings are delivered.</li>
                <li><strong>Service Providers:</strong> We may share information with service providers who help us with website analytics or other business operations.</li>
                <li><strong>Legal Compliance:</strong> We may disclose your information if legally required to do so, such as in response to a subpoena or to protect ourselves or others.</li> 
            </ul>

            <h2 className="font-bold">Data Security</h2>
            <p className="text-center">We take appropriate measures to protect your information from unauthorized access, use, or disclosure. However, no data transmission over the internet is 100% secure.</p> 

            <h2 className="font-bold">Cookies</h2>
            <p className="text-center">Our website uses only necessary cookies. These are small files placed on your device that are essential for the basic functionality of our website, such as enabling navigation or facilitating the checkout process. We do not use cookies for advertising purposes.</p>

            <h2 className="font-bold">Children&apos;s Privacy</h2>
            <p className="text-center">Our website is not intended for children under the age of 13. We do not knowingly collect information from children under 13.</p>

            <h2 className="font-bold">Changes To This Privacy Policy</h2>
            <p className="text-center">We may update this Privacy Policy. Any changes will be reflected by the &quot;Effective Date&quot; above. Your continued use of the website after changes are made indicates your acceptance of the revised Privacy Policy.</p> 

            <h2 className="font-bold">Contact Us</h2>
            <p className="pb-10 text-center">If you have questions about this Privacy Policy, please contact us at: msussmeierart@gmail.com.</p> 
        </div>
        </div>
    );
};

export default Privacy;