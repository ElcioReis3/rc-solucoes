import { Banner } from "@/components/layout/banner";
import { CompanySection } from "@/components/layout/company-section";
import { CourseSection } from "@/components/layout/course-section";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { HeroSection } from "@/components/layout/hero-section";
import { InforFooter } from "@/components/layout/infor-footer";
import { ReviewsSection } from "@/components/layout/reviews-section";
import { TechnicalSection } from "@/components/layout/technical-section";

export default function Home() {
  return (
    <>
      <Header />
      {/* <Banner /> */}
      <HeroSection />
      <CourseSection />
      <ReviewsSection />
      <CompanySection />
      <TechnicalSection />
      <InforFooter />
      <Footer />
    </>
  );
}
