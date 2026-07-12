import {
  getAllChapters,
  getExperienceConfig,
  getLetterText,
  getCreditsConfig,
  getPostCreditConfig,
} from "@/lib/content";
import { ExperienceShell } from "@/components/shell/ExperienceShell";

export default function Home() {
  const chapters = getAllChapters();
  const experience = getExperienceConfig();
  const letterText = getLetterText();
  const credits = getCreditsConfig();
  const postCredit = getPostCreditConfig();

  return (
    <ExperienceShell
      experience={experience}
      chapters={chapters}
      letterText={letterText}
      credits={credits}
      postCredit={postCredit}
    />
  );
}
