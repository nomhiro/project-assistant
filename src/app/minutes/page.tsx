"use client";

import { useState, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Breadcrumb from "@/components/Breadcrumb";
import Chat from "./components/chat";
import Register from "./components/register";
import { useProject } from "@/context/ProjectContext";
import { meeting } from "@/types/types";

export default function AssistantPage() {
  const { selectedProject } = useProject();
  const [selectedMeeting, setSelectedMeeting] = useState<string>('');
  const [meetings, setMeetings] = useState<meeting[]>([]);

  useEffect(() => {
    const fetchMeetings = async () => {
      if (selectedProject) {
        const response = await fetch(`/api/meetings/getbyproject?projectId=${selectedProject}`);
        const data = await response.json();
        setMeetings(data.meetings);
      }
    };

    fetchMeetings();
  }, [selectedProject]);

  const handleMeetingChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMeeting(event.target.value);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen w-full p-4 gap-4">
      <Breadcrumb items={[{ label: "ホーム", href: "/" }, { label: "議事録管理", href: "/minutes" }]} />
      <div className="w-full p-4">
        <label htmlFor="meeting">ミーティング：</label>
        <select id="meeting" value={selectedMeeting || ''} onChange={handleMeetingChange} className="border rounded p-2 w-auto">
          <option value="">選択してください</option>
          {meetings.map((meeting) => (
            <option key={meeting.id} value={meeting.id}>
              {meeting.name}
            </option>
          ))}
        </select>
      </div>
      <Tabs className="w-full">
        <TabList>
          <Tab>議事録登録</Tab>
          <Tab>チャット機能</Tab>
        </TabList>

        <TabPanel>
          <div className="w-full p-4">
            <Register selectedProject={selectedProject || ''} selectedMeeting={selectedMeeting || ''} />
          </div>
        </TabPanel>
        <TabPanel>
          <div className="w-full p-4">
            <Chat selectedProject={selectedProject || ''} selectedMeeting={selectedMeeting || ''} />
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
}