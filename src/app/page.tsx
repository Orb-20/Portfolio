import IntroSequence from "@/components/sections/IntroSequence";
import HelixSection from "@/components/sections/HelixSection";
import SkillsSection from "@/components/sections/SkillsSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import AchievementsSection from "@/components/sections/AchievementsSection";
import GitHubSection from "@/components/sections/GitHubSection";
import ContactSection from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <main>
      <IntroSequence />
      <HelixSection />
      <SkillsSection />
      <ExperienceSection />
      <AchievementsSection />
      <GitHubSection />
      <ContactSection />
    </main>
  );
}
