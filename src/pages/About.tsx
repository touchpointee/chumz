import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BookOpen,Heart, Target, Shield, Sparkles } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-accent/20 to-background">
      <Header />
      
      {/* Hero Section – styled like Shop All Products banner */}
     <section className="relative overflow-hidden bg-gradient-hero py-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0tMTIgMGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHptMjQgMjRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bS0xMiAwYzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
        
        <div className="container relative">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
              <BookOpen className="w-5 h-5" />
              <span className="text-sm font-medium">About Chumz</span>
            </div>
          <h1 className="text-5xl md:text-6xl font-bold font-poppins leading-tight">
  Get to Know Our {" "}
  
  <span
    className="
      relative inline-block 
      px-6 py-2 
      rounded-xl 
      bg-white/70 
      backdrop-blur-md 
      border border-white/40
      shadow-[0_0_40px_rgba(255,255,255,0.4)]
    "
  >
    <span
      className="
        bg-gradient-to-r from-primary via-brand-coral to-secondary 
        bg-clip-text text-transparent 
        font-bold
      "
    >
      Story
    </span>
  </span>
</h1>


            <p className="text-xl text-foreground/80 font-nunito">
              Learn how Chumz by Redroxz is reimagining daily intimate care for modern Indian women—through gentle, pH-balanced products designed for all-day comfort and confidence.
            </p>
          </div>
        </div>
      </section>

      {/* -------- Rest of your page stays the same -------- */}
      <div className="container py-16">
        <div className="max-w-5xl mx-auto space-y-20">
          {/* Our Story */}
          <section className="relative">
            <div className="bg-white/50 backdrop-blur-sm p-12 rounded-3xl shadow-soft border border-border/50">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-accent flex items-center justify-center shadow-lg">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-4xl font-bold font-poppins bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Our Story
                </h2>
              </div>
              <div className="space-y-4 text-lg text-muted-foreground font-nunito leading-relaxed">
                <p>
                  Chumz is an Indian women's wellness brand by Redroxz, founded by{" "}
                  <strong className="text-foreground">Meghala Thalapathy</strong>{" "}
                  with a vision to transform women's daily hygiene experience. We
                  believe every woman deserves access to premium quality products
                  that provide comfort, confidence, and care.
                </p>
                <p>
                  What started as a mission to address the everyday hygiene needs
                  of modern Indian women has grown into a trusted brand that
                  empowers women to embrace their wellness journey with
                  confidence. Today, over 50,000 women trust Chumz for their
                  daily care.
                </p>
              </div>
            </div>
          </section>

          {/* Our Mission */}
          <section className="text-center">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-accent flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-4xl font-bold font-poppins">Our Mission</h2>
            </div>
            <p className="text-2xl text-muted-foreground leading-relaxed font-nunito max-w-3xl mx-auto">
              To make daily hygiene easy, comfortable, and stigma-free for every
              woman. We're committed to providing premium quality products that
              prioritize your health, comfort, and confidence.
            </p>
          </section>

          {/* Our Values */}
          <section>
            <h2 className="text-4xl font-bold text-center mb-12 font-poppins">
              What We Stand For
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: "Comfort",
                  description:
                    "We design every product with your daily comfort in mind, ensuring you feel confident throughout your day.",
                  gradient: "from-brand-coral/20 to-brand-pink/20",
                },
                {
                  title: "Care",
                  description:
                    "Your wellness is our priority. We carefully formulate products with premium ingredients that care for your body.",
                  gradient: "from-brand-purple/20 to-brand-magenta/20",
                },
                {
                  title: "Confidence",
                  description:
                    "We empower women to embrace their daily routines with confidence and without compromise.",
                  gradient: "from-brand-pink/20 to-brand-coral/20",
                },
                {
                  title: "Clean Ingredients",
                  description:
                    "We believe in transparency and use only safe, tested, and effective ingredients in our products.",
                  gradient: "from-brand-magenta/20 to-brand-purple/20",
                },
              ].map((value, i) => (
                <div
                  key={i}
                  className={`p-8 rounded-2xl bg-gradient-to-br ${value.gradient} border border-border/50 hover:shadow-xl transition-all hover:scale-105 group`}
                >
                  <h3 className="text-2xl font-bold mb-4 font-poppins bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground font-nunito leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Our Products */}
          <section className="bg-gradient-card p-12 rounded-3xl shadow-soft border border-border/50">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-white/50 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-4xl font-bold font-poppins">What We Offer</h2>
            </div>
            <div className="space-y-8">
              <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl">
                <h3 className="text-2xl font-bold mb-3 font-poppins">
                  Panty Liners
                </h3>
                <p className="text-lg text-muted-foreground font-nunito leading-relaxed">
                  Ultra-thin, breathable liners designed for everyday freshness
                  and comfort. Perfect for daily protection and confidence.
                </p>
              </div>

              <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl">
                <h3 className="text-2xl font-bold mb-3 font-poppins">
                  pH-Balanced Intimate Wash
                </h3>
                <p className="text-lg text-muted-foreground font-nunito leading-relaxed">
                  Gentle, dermatologically tested intimate wash formulated to
                  maintain your body's natural pH balance while providing
                  lasting freshness.
                </p>
              </div>
            </div>
          </section>

          {/* Founder */}
          <section className="text-center">
            <h2 className="text-4xl font-bold mb-8 font-poppins">
              Meet Our Founder
            </h2>
            <div className="max-w-3xl mx-auto relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-2xl" />
              <div className="relative bg-white/80 backdrop-blur-sm p-12 rounded-3xl shadow-2xl border border-border/50">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-accent flex items-center justify-center shadow-xl">
                  <span className="text-4xl">👩‍💼</span>
                </div>
                <h3 className="text-3xl font-bold mb-2 font-poppins">
                  Meghala Thalapathy
                </h3>
                <p className="text-primary font-semibold mb-6 text-lg">
                  Founder, Chumz by Redroxz
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed font-nunito">
                  Driven by a passion for women's wellness and a commitment to
                  breaking taboos around feminine hygiene, Meghala founded Chumz
                  to create products that modern Indian women can trust and rely
                  on every day.
                </p>
              </div>
            </div>
          </section>

          {/* Trust Badges */}
          <section className="bg-gradient-to-br from-accent/30 to-transparent p-12 rounded-3xl border border-border/50">
            <h2 className="text-3xl font-bold text-center mb-8 font-poppins">
              Trusted by Thousands
            </h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                  50,000+
                </div>
                <p className="text-muted-foreground font-nunito">
                  Happy Customers
                </p>
              </div>
              <div>
                <div className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                  4.9★
                </div>
                <p className="text-muted-foreground font-nunito">
                  Average Rating
                </p>
              </div>
              <div>
                <div className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                  100%
                </div>
                <p className="text-muted-foreground font-nunito">
                  Derma Tested
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
