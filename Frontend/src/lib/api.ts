import { UserProfile } from "@/types/profile";

export async function fetchProfile(username: string): Promise<UserProfile> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalExperience: 0,
        educationLevel: "",
        certifications: 0,
        languages: [],
        leadershipExperience: false,
        workExperience: [],
        education: [],
        certificationsList: [],
        skills: [],
      });
    }, 1000);
  });
}