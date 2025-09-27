import HeroSection from "./components/hero_section";
import CoursePreview from "./components/course_preview";
import Features from "./components/features_section";
import Testimonials from "./components/testimonials";
import Footer from "./components/footer";

export default function Home() {
  return (
    <div>
      {/* Existing Hero Section */}
      <HeroSection
        title="SarvaShiksha"
        subtitle="Access quality learning resources anytime, anywhere."
        buttonText="Get Started"
        buttonLink="/auth"
        image="icon-512.jpg"
      />

      {/* New 4 Feature Boxes Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <FeatureBox
            icon="🎧"
            title="Audio First Learning"
            description="Learn through high quality audio lessons designed for rural environments"
          />
          <FeatureBox
            icon="⬇️"
            title="Offline Access"
            description="Download lessons and continue learning even without internet connectivity"
          />
          <FeatureBox
            icon="👥"
            title="Community Focused"
            description="Built specifically for rural schools and NGO education programs"
          />
          <FeatureBox
            icon="🌐"
            title="Multi Language"
            description="Support for local languages with easy switching and TTS capabilities"
          />
        </div>
      </div>

      {/* New 3 Stats Boxes Section */}
      <div className="max-w-4xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <StatBox number="10,000+" text="Students Reached" />
        <StatBox number="500+" text="Lessons Available" />
        <StatBox number="95%" text="Offline Capability" />
      </div>

      {/* Existing Sections */}
      <CoursePreview
        courses={[
          { title: "Basic Math Skills", description: "Learn fundamental math concepts.", image: "basic-math-skills.png" },
          { title: "English Literacy", description: "Improve reading and writing skills.", image: "English-Learners-e1714231217831.jpg" },
          { title: "Science Exploration", description: "Hands-on experiments.", image: "kids-science-exploration-cartoon-scenes-set-astronomers-researchers-botany-chemists-physicists-young-scientists-characters_575670-1641.jpg" },
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

// Feature Box Component (emoji icons)
function FeatureBox({ icon, title, description }) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center text-center hover:scale-105 transition-transform">
      <div className="mb-4 text-4xl">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

// Stats Box Component
function StatBox({ number, text }) {
  return (
    <div className="bg-green-100 rounded-lg p-6 shadow-md">
      <h2 className="text-4xl font-bold text-green-700">{number}</h2>
      <p className="text-gray-700 mt-2">{text}</p>
    </div>
  );
}
