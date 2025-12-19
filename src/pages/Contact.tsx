import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Clock, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! 🎉", {
      description: "Thank you for contacting us. We'll get back to you within 24 hours.",
      position: "top-center"
    });
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-accent/20 to-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0tMTIgMGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHptMjQgMjRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bS0xMiAwYzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
        
        <div className="container relative">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <span className="inline-block px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium border border-white/30">
              We're Here to Help
            </span>

            {/* UPDATED H1: white pill background with gradient text inside */}
            <h1 className="text-5xl md:text-6xl font-bold font-poppins leading-tight">
              Get in{" "}
              <span
                className="
                  relative inline-block
                  px-6 py-2
                  rounded-xl
                  bg-white/70
                  backdrop-blur-md
                  border border-white/40
                  shadow-[0_0_40px_rgba(255,255,255,0.28)]
                "
              >
                <span className="bg-gradient-to-r from-primary via-brand-coral to-secondary bg-clip-text text-transparent font-bold">
                  Touch
                </span>
              </span>
            </h1>

            <p className="text-xl text-foreground/80 font-nunito">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </div>
      </section>

      <div className="container py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-4 font-poppins">Send us a message</h2>
                <p className="text-muted-foreground font-nunito">
                  Fill out the form below and we'll get back to you within 24 hours
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold mb-2">
                    Full Name *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your name"
                    className="h-12 border-2 focus:border-primary"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold mb-2">
                    Email Address *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your.email@example.com"
                    className="h-12 border-2 focus:border-primary"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold mb-2">
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 XXXXX XXXXX"
                    className="h-12 border-2 focus:border-primary"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold mb-2">
                    Message *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    placeholder="Tell us how we can help you..."
                    className="border-2 focus:border-primary resize-none"
                  />
                </div>

                <Button type="submit" size="lg" className="w-full text-lg py-6 shadow-lg hover:shadow-xl transition-all group">
                  <Send className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  Send Message
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold mb-4 font-poppins">Contact Information</h2>
                <p className="text-muted-foreground font-nunito">
                  You can also reach us through these channels
                </p>
              </div>

              <div className="space-y-6">
                <div className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100" />
                  <div className="relative bg-white/60 backdrop-blur-sm p-8 rounded-2xl shadow-soft border-2 border-border/50 group-hover:border-primary/50 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="p-4 rounded-xl bg-gradient-accent shadow-lg">
                        <Mail className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-xl mb-2 font-poppins">Email Us</h3>
                        <p className="text-muted-foreground font-nunito mb-1">support@mychumz.com</p>
                        <p className="text-sm text-muted-foreground">
                          We typically respond within 24 hours
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100" />
                  <div className="relative bg-white/60 backdrop-blur-sm p-8 rounded-2xl shadow-soft border-2 border-border/50 group-hover:border-primary/50 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="p-4 rounded-xl bg-gradient-accent shadow-lg">
                        <MapPin className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-xl mb-2 font-poppins">Visit Us</h3>
                        <p className="text-muted-foreground font-nunito mb-1">
                          RED ROXZ, 2/5, Gopalasamy Nagar,<br />
                          Pasumalai, Madurai,<br />
                          Tamil Nadu - 625 004
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          +91-99407-05445
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100" />
                  <div className="relative bg-white/60 backdrop-blur-sm p-8 rounded-2xl shadow-soft border-2 border-border/50 group-hover:border-primary/50 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="p-4 rounded-xl bg-gradient-accent shadow-lg">
                        <Clock className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-xl mb-2 font-poppins">Business Hours</h3>
                        <p className="text-muted-foreground font-nunito mb-1">
                          Monday - Friday: 9:00 AM - 6:00 PM IST
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Saturday - Sunday: Closed
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-card p-8 rounded-2xl shadow-soft border border-border/50">
                <h3 className="font-bold text-xl mb-4 font-poppins">Quick Links</h3>
                <ul className="space-y-3">
                  {[
                    { label: "Shipping Policy", href: "/shipping" },
                    { label: "Returns & Refunds", href: "/returns" },
                    { label: "Privacy Policy", href: "/privacy" },
                    { label: "Terms & Conditions", href: "/terms" }
                  ].map((link, i) => (
                    <li key={i}>
                      <a 
                        href={link.href} 
                        className="text-muted-foreground hover:text-primary transition-colors font-nunito flex items-center gap-2 group"
                      >
                        <span className="text-primary">→</span>
                        <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
