import { Link } from "react-router-dom";
import testimonialGirl1 from "@/assets/testimonial-girl-1.png";
import testimonialGirl2 from "@/assets/testimonial-girl-2.png";
import testimonialGirl3 from "@/assets/testimonial-girl-3.png";
import testimonialGirl4 from "@/assets/testimonial-girl-4.png";

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-background to-muted/30 border-t py-16">
      <div className="container">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <h3 className="font-bold text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-poppins">
              Chumz
            </h3>
            <p className="text-sm text-muted-foreground font-nunito leading-relaxed">
              Premium women's hygiene products designed for everyday comfort, confidence, and wellness.
            </p>
            <div className="pt-4 flex items-center gap-3">
              <div className="flex -space-x-2">
                {[testimonialGirl1, testimonialGirl2, testimonialGirl3, testimonialGirl4].map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`Happy customer ${i + 1}`}
                    className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-md"
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-muted-foreground/80">Trusted by 2.5k+</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-lg">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/shop" className="text-muted-foreground hover:text-primary transition-colors">Shop All</Link></li>
              <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/learn" className="text-muted-foreground hover:text-primary transition-colors">Learn</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-lg">Customer Care</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/shipping" className="text-muted-foreground hover:text-primary transition-colors">Shipping Policy</Link></li>
              <li><Link to="/returns" className="text-muted-foreground hover:text-primary transition-colors">Returns & Refunds</Link></li>
              <li><Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-lg">Get in Touch</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="hover:text-primary transition-colors cursor-pointer">support@mychumz.com</li>
              <li>+91-99407-05445</li>
              <li>RED ROXZ, 2/5, Gopalasamy Nagar,<br />Pasumalai, Madurai,<br />Tamil Nadu - 625 004</li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© 2025 Chumz by Redroxz. All rights reserved. Made with 💕 for women everywhere.</p>
        </div>
      </div>
    </footer>
  );
};
