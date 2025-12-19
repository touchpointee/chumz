import { PolicyLayout } from "@/components/PolicyLayout";

const Terms = () => {
  return (
    <PolicyLayout title="Terms & Conditions">
      <p className="text-sm text-muted-foreground mb-8">
        Last updated: {new Date().toLocaleDateString()}
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 font-poppins text-primary">Agreement to Terms</h2>
        <p className="text-muted-foreground leading-relaxed">
          By accessing and using the Chumz website and purchasing our products, you agree to be bound by these Terms and Conditions.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 font-poppins text-primary">Product Information</h2>
        <p className="text-muted-foreground leading-relaxed">
          We strive to provide accurate product descriptions and images. However, we do not warrant that product descriptions, pricing, or other content is accurate, complete, or error-free.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 font-poppins text-primary">Orders and Pricing</h2>
        <p className="text-muted-foreground mb-4 leading-relaxed">
          All prices are listed in Indian Rupees (INR) and are subject to change without notice. We reserve the right to:
        </p>
        <ul className="list-none space-y-3 text-muted-foreground">
          <li className="flex items-start gap-3">
            <span className="text-primary text-lg mt-0.5">•</span>
            <span>Refuse or cancel any order</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-primary text-lg mt-0.5">•</span>
            <span>Limit quantities purchased</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-primary text-lg mt-0.5">•</span>
            <span>Correct pricing errors</span>
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 font-poppins text-primary">Payment</h2>
        <p className="text-muted-foreground leading-relaxed">
          We accept various payment methods including credit/debit cards, UPI, and net banking. Payment information is processed securely through our payment gateway partners.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 font-poppins text-primary">Limitation of Liability</h2>
        <p className="text-muted-foreground leading-relaxed">
          Chumz shall not be liable for any indirect, incidental, special, or consequential damages arising out of or related to your use of our products or services.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 font-poppins text-primary">Governing Law</h2>
        <p className="text-muted-foreground leading-relaxed">
          These Terms and Conditions shall be governed by and construed in accordance with the laws of India.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 font-poppins text-primary">Contact Information</h2>
        <p className="text-muted-foreground leading-relaxed">
          For any questions regarding these terms, please contact us at <strong className="text-foreground">hello@mychumz.com</strong>
        </p>
      </section>
    </PolicyLayout>
  );
};

export default Terms;
