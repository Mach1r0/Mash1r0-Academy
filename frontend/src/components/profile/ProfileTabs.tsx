import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SubjectsTab from "./SubjectsTab"
import AchievementsTab from "./AchievementsTab"
import SettingsTab from "./SettingsTab"
import { Dispatch, SetStateAction } from "react";

interface ProfileTabsProps {
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
}

export default function ProfileTabs({ activeTab, setActiveTab }: ProfileTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="subjects">My Subjects</TabsTrigger>
        <TabsTrigger value="achievements">Achievements</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>

      <TabsContent value="subjects" className="space-y-4 pt-4">
        <SubjectsTab />
      </TabsContent>

      <TabsContent value="achievements" className="space-y-4 pt-4">
        <AchievementsTab />
      </TabsContent>

      <TabsContent value="settings" className="space-y-4 pt-4">
        <SettingsTab />
      </TabsContent>
    </Tabs>
  )
}