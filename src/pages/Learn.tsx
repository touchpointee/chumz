import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Calendar, HelpCircle } from "lucide-react";

const Learn = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-accent/20 to-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0tMTIgMGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHptMjQgMjRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bS0xMiAwYzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
        
        <div className="container relative">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
              <BookOpen className="w-5 h-5" />
              <span className="text-sm font-medium">Wellness Hub</span>
            </div>
          <h1 className="text-5xl md:text-6xl font-bold font-poppins leading-tight">
  Learn &{" "}
  
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
      Wellness
    </span>
  </span>
</h1>


            <p className="text-xl text-foreground/80 font-nunito">
              Educational resources to empower your wellness journey and help you make informed choices
            </p>
          </div>
        </div>
      </section>

      <div className="container py-16">
        <div className="max-w-5xl mx-auto space-y-16">
          {/* Educational Articles */}
          <section>
            <h2 className="text-3xl font-bold mb-8 font-poppins">Featured Articles</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="group border-2 border-border/50 hover:border-primary/50 transition-all hover:shadow-2xl bg-white/50 backdrop-blur-sm overflow-hidden">
                <div className="h-2 bg-gradient-accent" />
                <CardHeader>
                  <CardTitle className="text-2xl font-poppins group-hover:text-primary transition-colors">
                    How to Choose the Right Panty Liner for Daily Use
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground font-nunito leading-relaxed">
                    Discover the key factors to consider when selecting the perfect panty liner for your daily needs. Learn about absorbency levels, materials, and comfort features.
                  </p>
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">Key Considerations:</h3>
                    <ul className="space-y-3 text-sm text-muted-foreground font-nunito">
                      <li className="flex items-start gap-3">
                        <span className="text-primary text-lg mt-0.5">•</span>
                        <span><strong className="text-foreground">Absorbency:</strong> Choose based on your daily flow needs</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-primary text-lg mt-0.5">•</span>
                        <span><strong className="text-foreground">Material:</strong> Look for breathable, soft fabrics</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-primary text-lg mt-0.5">•</span>
                        <span><strong className="text-foreground">Size & Fit:</strong> Ensure comfortable, discreet protection</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-primary text-lg mt-0.5">•</span>
                        <span><strong className="text-foreground">pH Balance:</strong> Opt for products that maintain natural pH</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="group border-2 border-border/50 hover:border-primary/50 transition-all hover:shadow-2xl bg-white/50 backdrop-blur-sm overflow-hidden">
                <div className="h-2 bg-gradient-accent" />
                <CardHeader>
                  <CardTitle className="text-2xl font-poppins group-hover:text-primary transition-colors">
                    What pH-Balanced Intimate Wash Really Means
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground font-nunito leading-relaxed">
                    Understanding pH balance is crucial for intimate health. Learn why pH-balanced products matter and how they support your body's natural defenses.
                  </p>
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">Why pH Balance Matters:</h3>
                    <ul className="space-y-3 text-sm text-muted-foreground font-nunito">
                      <li className="flex items-start gap-3">
                        <span className="text-primary text-lg mt-0.5">•</span>
                        <span><strong className="text-foreground">Natural Protection:</strong> Maintains healthy bacterial flora</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-primary text-lg mt-0.5">•</span>
                        <span><strong className="text-foreground">Prevents Irritation:</strong> Reduces risk of infections</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-primary text-lg mt-0.5">•</span>
                        <span><strong className="text-foreground">Gentle Care:</strong> Preserves natural moisture balance</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-primary text-lg mt-0.5">•</span>
                        <span><strong className="text-foreground">Daily Freshness:</strong> Safe for everyday use</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Period Tracker Section */}
          <section className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl blur-2xl" />
            <div className="relative bg-gradient-card p-12 rounded-3xl shadow-soft border border-border/50">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-white/50 backdrop-blur-sm flex items-center justify-center shadow-lg">
                  <Calendar className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-4xl font-bold font-poppins">Period Tracker</h2>
              </div>
              <p className="text-lg text-muted-foreground mb-8 font-nunito leading-relaxed">
                Track your menstrual cycle, understand your body better, and stay prepared for your period. Our period tracker helps you monitor your cycle patterns and symptoms.
              </p>
              <div className="bg-white/60 backdrop-blur-sm p-8 rounded-2xl text-center border border-border/30">
                <div className="text-6xl mb-4">📅</div>
                <p className="text-muted-foreground mb-4 font-nunito">
                  <strong className="text-foreground">Coming soon:</strong> Interactive period tracking tool to help you stay organized and prepared
                </p>
                <p className="text-sm text-muted-foreground font-nunito">
                  In the meantime, we recommend noting your cycle dates in your calendar to track patterns
                </p>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-accent flex items-center justify-center">
                <HelpCircle className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-4xl font-bold font-poppins">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-4">
              {[
                {
                  q: "How often should I change my panty liner?",
                  a: "For optimal freshness and hygiene, we recommend changing your panty liner every 4-6 hours or as needed based on your personal comfort."
                },
                {
                  q: "Can I use intimate wash daily?",
                  a: "Yes! Chumz intimate wash is specially formulated with pH-balanced ingredients for safe daily use. It gently cleanses while maintaining your body's natural balance."
                },
                {
                  q: "Are Chumz products dermatologically tested?",
                  a: "Absolutely. All our products undergo rigorous dermatological testing to ensure they are safe, gentle, and effective for intimate use."
                },
                {
                  q: "What makes Chumz products different?",
                  a: "Our products are specifically designed for Indian women with premium ingredients, pH-balanced formulations, and a focus on everyday comfort and wellness."
                }
              ].map((faq, i) => (
                <div 
                  key={i} 
                  className="p-8 rounded-2xl border-2 border-border/50 bg-white/50 backdrop-blur-sm hover:border-primary/50 transition-all hover:shadow-lg group"
                >
                  <h3 className="font-bold text-lg mb-3 font-poppins group-hover:text-primary transition-colors">
                    {faq.q}
                  </h3>
                  <p className="text-muted-foreground font-nunito leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Learn;
