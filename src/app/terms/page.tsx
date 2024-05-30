import React from 'react';

const Terms = () => {
    return (
        <div className="flex flex-col items-center min-h-[100vh]">
            <div className="max-w-[95vw] lg:max-w-[50vw] pt-8 flex flex-col items-center space-y-5">
                <h1 className="font-bold">Terms of Service</h1>

                <p>Welcome to www.marylousussmeier.com! These Terms of Service (&quot;Terms&quot;) are a legal agreement between you and Mary Lou Sussmeier regarding your use of our 
                    website located at www.marylousussmeier.com (the &quot;Website&quot;) and our services for purchasing original paintings (&quot;Services&quot;).</p>

                <h2 className="font-bold">1. Acceptance of Terms</h2>
                <p>By using our Website and Services, you confirm that you have read, understood, and agree to these Terms. If you don&quot;t agree, please do not use the Website or Services.</p>

                <h2 className="font-bold">2. Products and Services</h2>
                <ul>
                    <li>We offer original paintings created by Mary Lou Sussmeier for sale on our Website.
                    Product descriptions and images are for representational purposes, and actual paintings may have slight variations.
                    Prices are subject to change without notice.</li>
                </ul>

                <h2 className="font-bold">3. Ordering and Payment</h2>
                <ul>
                    <li>You may place orders by adding paintings to your cart and following the checkout process.</li>
                    <li>We accept credit card payments and other payment options available through Stripe.</li>
                    <li>Orders are subject to our acceptance and product availability.</li> 
                </ul>

                <h2 className="font-bold">4. Shipping and Delivery</h2>
                <ul>
                    <li>We ship paintings through the United States Postal Service (USPS).</li>
                    <li>Delivery times are estimates; we are not liable for delays out of our control.</li>
                    <li>Risk of loss passes to you upon delivery to the shipping carrier.</li> 
                </ul>

                <h2 className="font-bold">5. Intellectual Property</h2> 
                <ul>
                    <li>All website content is protected by copyright.</li>
                </ul>

                <h2 className="font-bold">6. User Conduct</h2>
                <p>You agree to use our Website and Services only for lawful purposes and not to:</p>
                <ul>
                    <li>Violate any laws or regulations.</li> 
                    <li>Spam or engage in disruptive behavior.</li>
                    <li>Attempt to gain unauthorized access to other accounts or systems.</li> 
                </ul>

                <h2 className="font-bold">7. Disclaimer of Warranties</h2> 
                <p>THE WEBSITE AND SERVICES ARE PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS. WE MAKE NO REPRESENTATIONS OR WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE WEBSITE OR SERVICES WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE.</p>

                <h2 className="font-bold">8. Limitation of Liability</h2>
                <p className="pb-10">IN NO EVENT SHALL WE BE LIABLE FOR ANY INDIRECT, SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING FROM YOUR USE OF THE WEBSITE OR SERVICES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.</p>
            </div>
        </div>
    );
};

export default Terms;