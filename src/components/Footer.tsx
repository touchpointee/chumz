import { Link } from "react-router-dom";
import { Instagram, Facebook } from "lucide-react";
import testimonialGirl1 from "@/assets/testimonial-girl-1.png";
import testimonialGirl2 from "@/assets/testimonial-girl-2.png";
import testimonialGirl3 from "@/assets/testimonial-girl-3.png";
import testimonialGirl4 from "@/assets/testimonial-girl-4.png";

export const Footer = () => {
  // WhatsApp config
  const whastappNumber = "919940705445";
  const whatsappUrl = `https://wa.me/${whastappNumber}`;

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
            <div className="flex gap-4 mt-6">
              <a href="https://www.instagram.com/my.chumz?igsh=MTJjc3J2OXIyYXZqcQ==" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors hover:scale-110 transform duration-200" title="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.facebook.com/mychumz" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors hover:scale-110 transform duration-200" title="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              {/* WhatsApp Icon */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-[#25D366] transition-colors hover:scale-110 transform duration-200"
                title="WhatsApp"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© 2025 Chumz by Redroxz. All rights reserved. Made with 💕 for women everywhere.</p>
        </div>
      </div>
    </footer>
  );
};
