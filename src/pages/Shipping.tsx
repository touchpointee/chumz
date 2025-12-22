import { PolicyLayout } from "@/components/PolicyLayout";

const Shipping = () => {
  return (
    <PolicyLayout title="Shipping Policy">
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 font-poppins text-primary">Shipping Information</h2>
        <p className="text-muted-foreground leading-relaxed">
          At Chumz, we strive to deliver your products safely and promptly. We offer shipping across India through our trusted courier partners.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 font-poppins text-primary">Processing Time</h2>
        <p className="text-muted-foreground leading-relaxed">
          Orders are typically processed within 1-2 business days. You will receive a shipping confirmation email with tracking information once your order has been dispatched.
        </p>
      </section>

      {/* <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 font-poppins text-primary">Delivery Time</h2>
        <ul className="list-none space-y-3 text-muted-foreground">
          <li className="flex items-start gap-3">
            <span className="text-primary text-lg mt-0.5">•</span>
            <span><strong className="text-foreground">Metro cities:</strong> 3-5 business days</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-primary text-lg mt-0.5">•</span>
            <span><strong className="text-foreground">Other cities:</strong> 5-7 business days</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-primary text-lg mt-0.5">•</span>
            <span><strong className="text-foreground">Remote areas:</strong> 7-10 business days</span>
          </li>
        </ul>
      </section> */}

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 font-poppins text-primary">Shipping Charges</h2>
        <p className="text-muted-foreground leading-relaxed">
          We offer <strong className="text-foreground">free shipping</strong> on orders above ₹500. For orders below ₹500, a nominal shipping fee of ₹50 applies.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 font-poppins text-primary">Order Tracking</h2>
        <p className="text-muted-foreground leading-relaxed">
          Once your order is shipped, you will receive a tracking number via email. You can use this number to track your package on our courier partner's website.
        </p>
      </section>
    </PolicyLayout>
  );
};

export default Shipping;
