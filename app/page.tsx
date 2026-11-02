import { CompanySection } from "@/components/layout/company-section";
import { CourseSection } from "@/components/layout/course-section";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { HeroSection } from "@/components/layout/hero-section";
import { InforFooter } from "@/components/layout/infor-footer";
import { TechnicalSection } from "@/components/layout/technical-section";
import { PartnersSection } from "@/components/partners/partners-section";
import { listActivePartners } from "@/services/partners.service";

export const dynamic = "force-dynamic";

export default async function Home() {
  const partners = await listActivePartners();

  return (
    <>
      <Header hasPartners={partners.length > 0} />
      <HeroSection />
      <CourseSection />
      <CompanySection />
      <PartnersSection partners={partners} />
      <TechnicalSection />
      <InforFooter />
      <Footer />
    </>
  );
}
