import { PolicyLayout } from "@/components/PolicyLayout";

const Privacy = () => {
  return (
    <PolicyLayout title="Privacy Policy">
      <p className="text-sm text-muted-foreground mb-8">
        Last updated: {new Date().toLocaleDateString()}
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 font-poppins text-primary">Introduction</h2>
        <p className="text-muted-foreground leading-relaxed">
          At Chumz, we respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 font-poppins text-primary">Information We Collect</h2>
        <p className="text-muted-foreground mb-4 leading-relaxed">
          We collect information that you provide directly to us, including:
        </p>
        <ul className="list-none space-y-3 text-muted-foreground">
          <li className="flex items-start gap-3">
            <span className="text-primary text-lg mt-0.5">•</span>
            <span>Name and contact information</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-primary text-lg mt-0.5">•</span>
            <span>Shipping and billing addresses</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-primary text-lg mt-0.5">•</span>
            <span>Payment information (processed securely)</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-primary text-lg mt-0.5">•</span>
            <span>Order history and preferences</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-primary text-lg mt-0.5">•</span>
            <span>Email communication preferences</span>
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 font-poppins text-primary">How We Use Your Information</h2>
        <p className="text-muted-foreground mb-4 leading-relaxed">
          We use your information to:
        </p>
        <ul className="list-none space-y-3 text-muted-foreground">
          <li className="flex items-start gap-3">
            <span className="text-primary text-lg mt-0.5">•</span>
            <span>Process and fulfill your orders</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-primary text-lg mt-0.5">•</span>
            <span>Communicate with you about your orders</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-primary text-lg mt-0.5">•</span>
            <span>Send you promotional offers (with your consent)</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-primary text-lg mt-0.5">•</span>
            <span>Improve our products and services</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-primary text-lg mt-0.5">•</span>
            <span>Ensure security and prevent fraud</span>
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 font-poppins text-primary">Data Security</h2>
        <p className="text-muted-foreground leading-relaxed">
          We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 font-poppins text-primary">Cookies</h2>
        <p className="text-muted-foreground leading-relaxed">
          We use cookies to enhance your browsing experience and analyze site traffic. You can control cookie preferences through your browser settings.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 font-poppins text-primary">Contact Us</h2>
        <p className="text-muted-foreground leading-relaxed">
          If you have any questions about this Privacy Policy, please contact us at <strong className="text-foreground">hello@mychumz.com</strong>
        </p>
      </section>
    </PolicyLayout>
  );
};

export default Privacy;
