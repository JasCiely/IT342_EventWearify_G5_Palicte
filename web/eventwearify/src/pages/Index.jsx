import Header from '../components/layout/Header';
import HeroSection from '../components/Home/HeroSection';
import HowItWorks from '../components/Home/HowItWorks';
import CallToAction from '../components/Home/CallToAction';
import Footer from '../components/layout/Footer';


const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1"> 
        <HeroSection />
        <HowItWorks />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Index;