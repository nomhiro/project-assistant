import React, { useState } from 'react';

export default function Register({ selectedProject, selectedMeeting }) {
  const [uploadType, setUploadType] = useState<'file' | 'transcript' | 'minutes'>('transcript');
  const [transcript, setTranscript] = useState<string>('');
  const [minutes, setMinutes] = useState<string>('');
  const [meetingDate, setMeetingDate] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleTranscriptChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTranscript(event.target.value);
  };

  const handleMinutesChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMinutes(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    if (meetingDate === '') {
      alert('会議日付を入力してください');
      setIsSubmitting(false);
      return;
    }
    if (uploadType === 'transcript') {
      if (!transcript) {
        alert('トランスクリプトを入力してください');
        setIsSubmitting(false);
        return;
      }
      console.log("transcript:", transcript);
      await registTranscript();
    } else if (uploadType === 'minutes') {
      if (!minutes) {
        alert('議事録を入力してください');
        setIsSubmitting(false);
        return;
      }
      console.log("minutes:", minutes);
      await registMinutes();
    }

    setIsSubmitting(false);
  };

  const registTranscript = async () => {
    const response = await fetch(`/api/minutes/regist/transcript`, {
      method: 'POST',
      body: JSON.stringify({ 
        input: transcript, 
        projectId: selectedProject, 
        meetingId: selectedMeeting,
        meetingDate: meetingDate,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      alert('登録が完了しました');
    } else {
      alert('登録に失敗しました');
    }
  };

  const registMinutes = async () => {
    const response = await fetch(`/api/minutes/regist/transcript`, {
      method: 'POST',
      body: JSON.stringify({ 
        input: minutes, 
        projectId: selectedProject, 
        meetingId: selectedMeeting,
        meetingDate: meetingDate,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      alert('登録が完了しました');
    } else {
      alert('登録に失敗しました');
    }
  };

  return (
    <div className="p-2 w-full">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
        <div>
          {selectedMeeting && (
            <>
              <div className="flex p-4 gap-4">
                <label>
                  会議日付:
                  <input
                    type="date"
                    value={meetingDate}
                    onChange={(e) => setMeetingDate(e.target.value)}
                    className="border rounded p-2 w-full"
                  />
                </label>
              </div>
              <div className="flex p-4 gap-4">
                <label>
                  <input
                    type="radio"
                    value="transcript"
                    checked={uploadType === 'transcript'}
                    onChange={() => setUploadType('transcript')}
                  />
                  トランスクリプト
                </label>
                <label>
                  <input
                    type="radio"
                    value="minutes"
                    checked={uploadType === 'minutes'}
                    onChange={() => setUploadType('minutes')}
                  />
                  議事録
                </label>
              </div>
              {uploadType === 'transcript' && (
                <div className="w-full">
                  <textarea
                    value={transcript}
                    onChange={handleTranscriptChange}
                    className="border rounded p-2 w-full"
                    rows={15}
                  />
                </div>
              )}
              {uploadType === 'minutes' && (
                <div className="w-full">
                  <textarea
                    value={minutes}
                    onChange={handleMinutesChange}
                    className="border rounded p-2 w-full"
                    rows={15}
                  />
                </div>
              )}
              <button type="submit" className="bg-blue-500 text-white rounded p-2 w-fit" disabled={isSubmitting}>
                {isSubmitting ? '登録中...' : '登録'}
              </button>
              {isSubmitting && <div className="spinner">Loading...</div>}
            </>
          )}
        </div>
      </form>
    </div>
  );
};