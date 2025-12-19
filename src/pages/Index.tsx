import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { getProducts } from "@/lib/shopify";
import { ArrowRight, Sparkles, Shield, Heart, Leaf, Star, Quote, Truck, Award, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";
import amazonButton from "@/assets/amazon-button.png";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
const Index = () => {
  const {
    data: products,
    isLoading
  } = useQuery({
    queryKey: ['products'],
    queryFn: () => getProducts(4)
  });
  return <div className="min-h-screen bg-gradient-to-b from-background via-accent/20 to-background">
      <Header />
      
      {/* Hero Section - Full Width */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Full-width background image */}
        <div className="absolute inset-0">
          <img src={heroImage} alt="Confident woman embracing daily comfort" className="w-full h-full object-cover" />
          {/* Dark gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
        </div>
        
        <div className="container relative z-10 py-20 md:py-32">
          <div className="flex justify-end">
            <div className="max-w-2xl space-y-8 animate-fade-in text-right">
              {/* Pulsing badge */}
              <div className="inline-block relative">
                <div className="absolute inset-0 bg-brand-pink rounded-full blur-md opacity-50 animate-pulse" />
                <span className="relative px-6 py-3 rounded-full bg-white/95 backdrop-blur-sm text-sm font-bold text-brand-purple border-2 border-white/50 shadow-xl flex items-center gap-2 w-fit ml-auto">
                  <Sparkles className="w-4 h-4 text-brand-coral animate-pulse" />
                  Trusted by 50,000+ Women
                </span>
              </div>
              
              {/* Dynamic heading with excellent contrast */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] font-poppins">
                <span className="text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
                  Feel Fresh,
                </span>
                <br />
                <span className="inline-block mt-2 bg-gradient-to-r from-brand-pink via-brand-coral to-brand-magenta bg-clip-text text-transparent drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)] font-black">
                  Feel Confident
                </span>
              </h1>
              
              {/* Enhanced description */}
              <p className="text-xl text-white leading-relaxed font-nunito drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] font-medium text-right md:text-xl">Premium pH-balanced intimate care products designed by women,
for women. Experience all-day comfort and confidence with Chumz.</p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 pt-4 justify-end">
                <Link to="/shop" className="group">
                  <Button size="lg" className="w-full sm:w-auto text-base px-8 py-6 bg-white text-brand-purple hover:bg-white/90 shadow-2xl hover:shadow-brand-pink/50 transition-all hover:scale-110 font-bold">
                    Shop Now
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </Link>
                <a href="https://www.amazon.in/storefront?me=A2D1S3UDQXI20V" target="_blank" rel="noopener noreferrer" className="transition-all hover:scale-105">
                  <img src={amazonButton} alt="Buy now at amazon.in" className="h-14 w-auto" />
                </a>
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-3 pt-6 justify-end">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map(i => <div key={i} className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-pink via-brand-coral to-brand-purple border-4 border-white shadow-xl" />)}
                </div>
                <div className="text-sm bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg">
                  <div className="flex text-yellow-500 mb-1">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                  <p className="text-brand-purple font-bold">4.9/5 from 2,500+ reviews</p>
                </div>
              </div>

              {/* Floating feature badges */}
              
            </div>
          </div>
        </div>
      </section>

      {/* Delivery & Trust Section */}
                {/* Delivery & Trust Section */}
      <section className="relative py-16 bg-gradient-to-b from-brand-pink/10 via-white/40 to-brand-coral/10 overflow-hidden">
        {/* soft pattern */}
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="absolute -top-32 -left-10 w-72 h-72 rounded-full bg-brand-pink/20 blur-3xl" />
          <div className="absolute -bottom-24 right-0 w-80 h-80 rounded-full bg-brand-purple/15 blur-3xl" />
        </div>

        <div className="container relative space-y-8">
          {/* Header row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-2">
              <p className="text-xs tracking-[0.25em] uppercase text-brand-purple/70 font-semibold">
                You&apos;re in safe hands
              </p>
              <h2 className="text-3xl md:text-4xl font-black font-poppins">
                Delivery &amp; Trust Guarantees
              </h2>
            </div>

            {/* Trust stats pill */}
            <div className="inline-flex items-center justify-center gap-3 px-6 py-3 rounded-full bg-white/85 backdrop-blur-md border border-white/70 shadow-[0_10px_26px_rgba(15,23,42,0.08)] text-xs md:text-sm font-nunito">
              <span className="inline-flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="font-semibold">4.9/5</span>
                <span className="text-muted-foreground hidden sm:inline">customer rating</span>
              </span>
              <span className="h-4 w-px bg-border/60" />
              <span className="inline-flex items-center gap-1">
                <Shield className="w-4 h-4 text-brand-purple" />
                <span className="font-semibold">Secure payments</span>
              </span>
              <span className="h-4 w-px bg-border/60 hidden sm:inline" />
              <span className="inline-flex items-center gap-1 hidden sm:inline-flex">
                <Truck className="w-4 h-4 text-brand-coral" />
                <span>COD available on select products</span>
              </span>
            </div>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Truck,
                title: "Free Shipping",
                label: "Shipping Promise",
                description: "Anywhere in India, on every order—no hidden delivery surprises.",
                gradient: "from-brand-coral via-brand-pink to-brand-purple",
              },
              {
                icon: CheckCircle,
                title: "7-Day Delivery",
                label: "Speed Guarantee",
                description: "Fast, trackable, and reliable dispatch right to your doorstep.",
                gradient: "from-brand-purple via-brand-magenta to-brand-pink",
              },
              {
                icon: Award,
                title: "Trusted Quality",
                label: "Customer Love",
                description: "50,000+ happy customers and growing, with repeat orders every month.",
                gradient: "from-brand-pink via-brand-coral to-brand-magenta",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="
                  relative flex h-full items-stretch overflow-hidden rounded-3xl
                  bg-white/95 backdrop-blur-xl border border-white/80
                  shadow-[0_20px_50px_rgba(15,23,42,0.12)]
                  transition-all duration-200 group hover:-translate-y-2 hover:shadow-[0_26px_70px_rgba(15,23,42,0.18)]
                "
              >
                {/* subtle inner gradient edge */}
                <div
                  className={`pointer-events-none absolute inset-x-6 -top-px h-px bg-gradient-to-r ${item.gradient} opacity-80`}
                />

                {/* soft background glow */}
                <div className="pointer-events-none absolute -right-10 -bottom-16 w-40 h-40 rounded-full bg-brand-pink/10 blur-3xl" />

                <div className="relative flex items-center gap-5 p-7">
                  {/* Icon badge */}
                  <div
                    className={`
                      relative flex h-16 w-16 flex-none items-center justify-center rounded-2xl
                      bg-gradient-to-br ${item.gradient}
                      shadow-[0_18px_35px_rgba(244,114,182,0.55)]
                      transition-transform duration-200 group-hover:scale-105
                    `}
                  >
                    <div className="absolute inset-0 rounded-2xl bg-white/10" />
                    <item.icon className="relative w-8 h-8 text-white" />
                    <div className="absolute inset-[-3px] rounded-3xl ring-2 ring-white/60" />
                  </div>

                  {/* Text */}
                  <div className="space-y-1">
                    <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground font-semibold">
                      {item.label}
                    </p>
                    <p className="text-xl md:text-[1.35rem] font-extrabold text-foreground font-poppins">
                      {item.title}
                    </p>
                    <p className="text-sm text-muted-foreground font-nunito leading-snug">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Featured Products Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full 
                    bg-white/70 backdrop-blur-sm border border-brand-pink/40 
                    shadow-[0_10px_30px_rgba(244,114,182,0.25)]
                    text-[11px] tracking-[0.3em] uppercase font-semibold 
                    text-brand-purple/85 mx-auto">
      <Sparkles className="w-3.5 h-3.5 text-brand-coral" />
      <span>Our Products</span>
    </div>
            <h2 className="text-4xl md:text-5xl font-bold font-poppins">
              Designed for Your{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Daily Comfort
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-nunito">
              Premium hygiene solutions crafted with care, backed by science, and loved by thousands of women.
            </p>
            {/* Benefits row */}
    <div className="flex flex-wrap justify-center gap-5 text-sm text-muted-foreground font-nunito pt-1">
      <div className="inline-flex items-center gap-2">
        <Shield className="w-4 h-4 text-brand-purple/80" />
        <span>Dermatologically tested</span>
      </div>

      <span className="text-brand-purple/35">•</span>

      <div className="inline-flex items-center gap-2">
        <Leaf className="w-4 h-4 text-brand-coral/80" />
        <span>Gentle, skin-friendly formulas</span>
      </div>

      <span className="text-brand-purple/35 hidden sm:inline">•</span>

      <div className="inline-flex items-center gap-2 hidden sm:inline-flex">
        <Heart className="w-4 h-4 text-brand-pink/80" />
        <span>Loved by thousands of women</span>
      </div>
    </div>
          </div>
          
          {isLoading ? <div className="text-center py-12">
              <div className="inline-block animate-pulse">
                <p className="text-muted-foreground">Loading our amazing products...</p>
              </div>
            </div> : products && products.length > 0 ? <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                {products.map((product, i) => <div key={product.node.id} className="animate-fade-in" style={{
              animationDelay: `${i * 100}ms`
            }}>
                    <ProductCard product={product} />
                  </div>)}
              </div>
              <div className="text-center">
                <Link to="/shop">
                  <Button
  size="lg"
  variant="outline"
  className="
    px-8 relative overflow-hidden
    border-brand-purple/40
    transition-all duration-300
    rounded-xl
    group
  "
>
  {/* hover glow */}
  <span
    className="absolute inset-0 bg-gradient-to-r from-brand-pink/20 via-brand-coral/20 to-brand-purple/20 
               opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"
  />

  {/* subtle border glow */}
  <span
    className="absolute inset-0 rounded-xl border border-transparent group-hover:border-brand-pink/40 
               transition-colors duration-300"
  />

  {/* content */}
  <span className="relative flex items-center">
    View All Products
    <ArrowRight
      className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-110"
    />
  </span>
</Button>

                </Link>
              </div>
            </> : <div className="text-center py-16 bg-gradient-card rounded-3xl shadow-soft border border-border/50">
              <p className="text-muted-foreground mb-4 text-lg">No products found</p>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                We're preparing something special for you. Create your first product by telling us what it is and the price.
              </p>
            </div>}
        </div>
      </section>

            {/* Why Choose Chumz - Premium Features */}
      <section className="relative py-20 bg-gradient-to-b from-brand-pink/10 via-brand-pink/5 to-transparent overflow-hidden">
        {/* soft background blobs */}
        <div className="pointer-events-none absolute inset-0 opacity-50">
          <div className="absolute -top-24 left-[-6rem] w-72 h-72 rounded-full bg-brand-pink/20 blur-3xl" />
          <div className="absolute bottom-[-4rem] right-[-4rem] w-80 h-80 rounded-full bg-brand-purple/20 blur-3xl" />
        </div>

        <div className="container relative">
          {/* Header */}
          <div className="text-center mb-16 space-y-6 max-w-3xl mx-auto">
            {/* pill label */}
            <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full 
                            bg-white/70 backdrop-blur-sm border border-brand-pink/40 
                            shadow-[0_10px_30px_rgba(244,114,182,0.25)]
                            text-[11px] tracking-[0.3em] uppercase font-semibold 
                            text-brand-purple/85 mx-auto">
              <Sparkles className="w-3.5 h-3.5 text-brand-coral" />
              <span>Why Chumz</span>
            </div>

            {/* main heading */}
            <div className="relative inline-block">
              <h2 className="text-3xl md:text-5xl font-black font-poppins leading-tight">
                Premium Care You Can{" "}
                <span className="bg-gradient-to-r from-brand-pink via-brand-coral to-brand-purple bg-clip-text text-transparent">
                  Trust
                </span>
              </h2>
              {/* subtle halo under heading */}
              <span className="pointer-events-none absolute inset-x-0 -bottom-3 mx-auto w-2/3 h-4 
                               bg-black/5 blur-xl rounded-full" />
            </div>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-nunito leading-relaxed">
              Science-backed, dermatologist-approved, and crafted with gentle ingredients to keep you feeling fresh, comfortable, and completely confident.
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "pH Balanced",
                description:
                  "Scientifically formulated to support your body’s natural pH balance and protect intimate health every day.",
                icon: Heart,
                tag: "Everyday Comfort",
                gradient: "from-brand-coral/18 via-brand-pink/18 to-brand-pink/5",
              },
              {
                title: "Dermatologically Tested",
                description:
                  "Clinically tested and approved by leading dermatologists. Safe, gentle, and ideal for daily use.",
                icon: Shield,
                tag: "Skin-Safe",
                gradient: "from-brand-purple/18 via-brand-magenta/18 to-brand-pink/5",
              },
              {
                title: "Natural Ingredients",
                description:
                  "Made with gentle, natural ingredients that care for your skin. No harsh chemicals, just pure comfort.",
                icon: Leaf,
                tag: "Clean Formula",
                gradient: "from-brand-pink/18 via-brand-coral/18 to-brand-pink/5",
              },
              {
                title: "Clinically Proven",
                description:
                  "Backed by scientific research and proven results you can trust, cycle after cycle.",
                icon: Sparkles,
                tag: "Proven Results",
                gradient: "from-brand-coral/18 via-brand-magenta/18 to-brand-pink/5",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className={`
                  group relative rounded-3xl p-8
                  bg-gradient-to-br ${feature.gradient}
                  border border-white/60 shadow-[0_18px_50px_rgba(15,23,42,0.12)]
                  backdrop-blur-xl
                  transition-all duration-300
                  hover:-translate-y-2 hover:shadow-[0_26px_80px_rgba(15,23,42,0.18)]
                `}
              >
                {/* subtle inner light */}
                <div className="pointer-events-none absolute inset-x-6 -top-px h-px bg-white/60/80" />

                {/* icon badge */}
                <div className="mb-6 inline-flex items-center justify-center">
                  <div className="relative h-14 w-14 rounded-2xl bg-gradient-to-br from-brand-pink via-brand-coral to-brand-purple shadow-[0_16px_30px_rgba(244,114,182,0.5)] group-hover:scale-105 transition-transform duration-300">
                    <div className="absolute inset-0 rounded-2xl bg-white/10" />
                    <feature.icon className="relative w-7 h-7 text-white m-auto mt-[0.85rem]" />
                    <div className="absolute inset-[-3px] rounded-3xl ring-2 ring-white/60" />
                  </div>
                </div>

                {/* tag */}
                <p className="text-[11px] tracking-[0.22em] uppercase text-brand-purple/70 font-semibold mb-2">
                  {feature.tag}
                </p>

                {/* title */}
                <h3 className="text-2xl font-bold mb-3 font-poppins">
                  {feature.title}
                </h3>

                {/* description */}
                <p className="text-sm md:text-[0.95rem] text-muted-foreground leading-relaxed font-nunito">
                  {feature.description}
                </p>

                {/* subtle bottom accent line on hover */}
                <div className="mt-5 h-[2px] w-0 bg-gradient-to-r from-brand-pink via-brand-coral to-brand-purple rounded-full transition-all duration-300 group-hover:w-24" />
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Reviews Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
  <div className="container">
   <div className="text-center mb-16 space-y-6 max-w-3xl mx-auto">
  {/* Pill label ON TOP */}
  <div
    className="flex items-center justify-center gap-2 px-5 py-1.5 rounded-full
               bg-white/80 backdrop-blur-sm
               border border-brand-pink/40
               shadow-[0_10px_26px_rgba(244,114,182,0.25)]
               text-[11px] tracking-[0.3em] uppercase font-semibold
               text-brand-purple/85
               w-fit mx-auto"
  >
    <Quote className="w-3.5 h-3.5 text-brand-coral" />
    <span>Testimonials</span>
  </div>

  {/* Heading */}
  <div className="relative w-fit mx-auto">
    <h2 className="text-4xl md:text-5xl font-black font-poppins leading-tight">
      Loved by{" "}
      <span className="relative inline-block">
        <span className="bg-gradient-to-r from-brand-pink via-brand-coral to-brand-purple bg-clip-text text-transparent">
          Thousands
        </span>
        {/* soft underline glow */}
        <span
          className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-[80%] h-[8px]
                     rounded-full bg-gradient-to-r from-brand-pink/25 via-brand-coral/30 to-brand-purple/25
                     blur-md"
        />
      </span>
    </h2>

    {/* halo under heading */}
    <span
      className="pointer-events-none absolute inset-x-0 -bottom-4 mx-auto w-2/3 h-4
                 bg-black/5 blur-xl rounded-full"
    />
  </div>

  {/* Subcopy */}
  <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-nunito leading-relaxed">
    Real experiences from real women across India.
  </p>

  {/* Rating meta row */}
  <div className="flex flex-wrap items-center justify-center gap-4 text-xs md:text-sm text-muted-foreground font-nunito">
    <div className="inline-flex items-center gap-2">
      <Star className="w-4 h-4 text-yellow-500 fill-current" />
      <span className="font-semibold text-foreground">4.9/5</span>
      <span>average rating</span>
    </div>

    <span className="h-1 w-1 rounded-full bg-border/70" />

    <div>2,500+ verified reviews</div>
  </div>
</div>




          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 4000,
              }),
            ]}
            className="w-full max-w-6xl mx-auto"
          >
            <CarouselContent>
              {[
                {
                  name: "Aarti Verma",
                  title: "Doctor, New Delhi",
                  review: "As someone who's constantly on the move during long hospital shifts, Chumz has been a lifesaver. The rash-free comfort and leak-proof design give me complete peace of mind. No irritation, no worries!"
                },
                {
                  name: "Ritika Shah",
                  title: "Marketing Professional, Mumbai",
                  review: "I've tried so many brands, but Chumz truly stands out. It's soft, breathable, and doesn't feel bulky at all. Plus, knowing it's chemical-free makes me feel safe every single month."
                },
                {
                  name: "Priya Menon",
                  title: "College Student, Bangalore",
                  review: "Periods used to be so uncomfortable for me. Ever since I started using Chumz, I've felt a huge difference. No rashes, no shifting pads, and finally—comfort I can trust!"
                },
                {
                  name: "Ananya Kapoor",
                  title: "Yoga Instructor, Pune",
                  review: "Chumz has completely changed the way I experience my periods. I can go through my yoga sessions without worrying about discomfort or leaks. It's like my body can finally breathe!"
                },
                {
                  name: "Sanya Malik",
                  title: "Software Engineer, Hyderabad",
                  review: "Long hours at my desk used to be unbearable during my period. But with Chumz, I barely even notice I'm on my cycle. The comfort and reliability are unmatched!"
                }
              ].map((testimonial, i) => (
                <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-6 h-full">
                    <div className="relative h-full p-8 rounded-2xl bg-gradient-to-br from-background to-accent/30 border border-border/50 hover:shadow-xl transition-all group">
                      <Quote className="absolute top-6 right-6 w-12 h-12 text-primary/20 group-hover:text-primary/30 transition-colors" />
                      <div className="relative space-y-4">
                        <div className="flex text-yellow-500 mb-4">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star key={star} className="w-5 h-5 fill-current" />
                          ))}
                        </div>
                        <p className="text-muted-foreground leading-relaxed font-nunito italic">
                          "{testimonial.review}"
                        </p>
                        <div className="pt-4 border-t border-border/50">
                          <p className="font-bold text-foreground font-poppins">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground font-nunito">{testimonial.title}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      </section>

      {/* Newsletter CTA */}
      {/* Newsletter CTA */}
<section className="py-20 relative overflow-hidden">
  {/* gradient backdrop */}
  <div className="absolute inset-0 bg-gradient-to-b from-brand-pink/40 via-brand-coral/35 to-brand-purple/60" />
  {/* soft pattern */}
  <div className="absolute inset-0 opacity-[0.18] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0tMTIgMGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHptMjQgMjRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bS0xMiAwYzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00eiIvPjwvZz48L2c+PC9zdmc+')]" />

  <div className="container relative">
    <div
      className="
        max-w-6xl mx-auto
        rounded-[2.5rem]
        bg-white/95 backdrop-blur-2xl
        border border-white/70
        shadow-[0_26px_90px_rgba(15,23,42,0.35)]
        px-6 py-10 md:px-12 lg:px-14 lg:py-12
      "
    >
      <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-14">
        {/* LEFT: copy */}
        <div className="flex-1 space-y-6 text-center lg:text-left">
          {/* pill */}
          <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full 
                          bg-brand-pink/5 border border-brand-pink/40
                          text-[11px] tracking-[0.32em] uppercase font-semibold 
                          text-brand-purple/85">
            <Sparkles className="w-3.5 h-3.5 text-brand-coral" />
            <span>Stay in the loop</span>
          </div>

          {/* heading */}
          <div className="space-y-1">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black font-poppins leading-tight">
              Join Our
            </h2>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black font-poppins leading-tight">
              <span className="bg-gradient-to-r from-brand-pink via-brand-coral to-brand-purple bg-clip-text text-transparent">
                Community
              </span>
            </h2>
          </div>

          <p className="text-base md:text-lg text-foreground/80 font-nunito max-w-xl mx-auto lg:mx-0">
            Get exclusive offers, period-wellness tips, and early access to new
            Chumz products — all in one gentle, once-in-a-while email.
          </p>

          {/* tiny benefits row */}
          <div className="grid sm:grid-cols-2 gap-3 text-sm font-nunito text-foreground/80 max-w-xl mx-auto lg:mx-0">
            <div className="inline-flex items-center gap-2">
              <Heart className="w-4 h-4 text-brand-pink" />
              <span>Exclusive member-only offers</span>
            </div>
            <div className="inline-flex items-center gap-2">
              <Shield className="w-4 h-4 text-brand-purple" />
              <span>Science-backed wellness tips</span>
            </div>
            <div className="inline-flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-coral" />
              <span>First to know about launches</span>
            </div>
          </div>
        </div>

        {/* RIGHT: form */}
        <div className="flex-1 w-full space-y-4">
          {/* glowing form block */}
          <div className="relative">
            {/* outer glow */}
            <div className="absolute -inset-2 rounded-[2rem] bg-gradient-to-r from-brand-pink/40 via-brand-coral/40 to-brand-purple/40 blur-xl opacity-70" />
            <div
              className="
                relative rounded-[2rem]
                bg-white/95 backdrop-blur-xl
                border border-brand-pink/30
                shadow-[0_20px_55px_rgba(15,23,42,0.35)]
                px-3 py-3 flex items-center gap-2
              "
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="
                  flex-1 px-4 py-3 rounded-2xl
                  bg-transparent outline-none
                  text-sm md:text-base
                  text-foreground placeholder:text-foreground/45
                "
              />
              <Button
                size="lg"
                className="
                  relative overflow-hidden
                  rounded-[1.4rem]
                  px-7 py-3 text-sm md:text-base font-semibold
                  bg-gradient-to-r from-brand-pink via-brand-coral to-brand-purple
                  shadow-[0_14px_32px_rgba(244,114,182,0.65)]
                  hover:shadow-[0_18px_40px_rgba(244,114,182,0.85)]
                  transition-all duration-300
                  hover:-translate-y-0.5
                "
              >
                <span className="relative">Subscribe</span>
              </Button>
            </div>
          </div>

          {/* reassurance + faces */}
          <div className="flex flex-col sm:flex-row items-center gap-3 justify-between text-xs md:text-sm font-nunito text-foreground/70">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full border-[3px] border-white 
                               bg-gradient-to-br from-brand-pink via-brand-coral to-brand-purple"
                  />
                ))}
              </div>
              <span>
                Join <span className="font-semibold">10,000+ women</span> already in our community.
              </span>
            </div>
            <span className="text-foreground/60">
              No spam, ever. Just period-positive vibes 💕
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>


      <Footer />
    </div>;
};
export default Index;