import HeroSection from "../components/hero_section";
import CoursePreview from "../components/course_preview";
import Features from "../components/features";
import Testimonials from "../components/testimonials";
import Footer from "../components/footer";

export default function Home() {
  return (
    <div>
      <HeroSection
        title="SarvaShiksha"
        subtitle="Access quality learning resources anytime, anywhere."
        buttonText="Get Started"
        buttonLink="/login"   // link to login page
        image="/images/hero-image.jpg"
      />
      <CoursePreview
        courses={[
          { title: "Basic Math Skills", description: "Learn fundamental math concepts.", image: "/images/math-course.jpg" },
          { title: "English Literacy", description: "Improve reading and writing skills.", image: "/images/english-course.jpg" },
          { title: "Science Exploration", description: "Hands-on experiments.", image: "/images/science-course.jpg" },
        ]}
      />
      <Features
        features={[
          { icon: "📚", title: "Comprehensive Content", description: "All subjects covered." },
          { icon: "💻", title: "Online Accessibility", description: "Learn from anywhere." },
          { icon: "🤝", title: "Community Support", description: "Connect with mentors and peers." },
        ]}
      />
      <Testimonials
        testimonials={[
          { name: "Ravi Kumar", message: "This platform helped me a lot!" },
          { name: "Sunita Devi", message: "My children love learning here!" },
        ]}
      />
      <Footer
        contactInfo={{ email: "contact@ruraledu.org", phone: "+91 9876543210" }}
        socialLinks={{ facebook: "https://facebook.com/ruraledu", twitter: "https://twitter.com/ruraledu" }}
      />
    </div>
  );
}
