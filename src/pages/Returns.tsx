import { PolicyLayout } from "@/components/PolicyLayout";

const Returns = () => {
  return (
    <PolicyLayout title="Returns & Refund Policy">
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 font-poppins text-primary">Our Commitment</h2>
        <p className="text-muted-foreground leading-relaxed">
          Your satisfaction is our priority. If you're not completely satisfied with your purchase, we're here to help.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 font-poppins text-primary">Return Policy</h2>
        <p className="text-muted-foreground mb-4 leading-relaxed">
          Due to the nature of our hygiene products, we can only accept returns in the following cases:
        </p>
        <ul className="list-none space-y-3 text-muted-foreground">
          <li className="flex items-start gap-3">
            <span className="text-primary text-lg mt-0.5">•</span>
            <span>Damaged or defective products</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-primary text-lg mt-0.5">•</span>
            <span>Wrong product delivered</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-primary text-lg mt-0.5">•</span>
            <span>Unopened, unused products with intact seals</span>
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 font-poppins text-primary">Return Window</h2>
        <p className="text-muted-foreground leading-relaxed">
          You have <strong className="text-foreground">7 days</strong> from the date of delivery to initiate a return request. Please contact us at <strong className="text-foreground">hello@mychumz.com</strong> with your order details and the reason for return.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 font-poppins text-primary">Refund Process</h2>
        <p className="text-muted-foreground leading-relaxed">
          Once we receive and inspect your return, we will process your refund within 5-7 business days. The refund will be credited to your original payment method.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 font-poppins text-primary">Exchange Policy</h2>
        <p className="text-muted-foreground leading-relaxed">
          We currently do not offer direct exchanges. If you wish to exchange a product, please return it for a refund and place a new order.
        </p>
      </section>
    </PolicyLayout>
  );
};

export default Returns;
