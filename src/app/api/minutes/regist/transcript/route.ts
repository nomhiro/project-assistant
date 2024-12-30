/**
 * @api {post} /upload/minutes Upload minutes
 * @apiName UploadMinutes
 * @apiGroup Minutes
 * @abstract 受け取った議事録テキストをベクトル化し、議事録とベクトル値をCosmosDBに登録する
 */

import { NextRequest } from 'next/dist/server/web/spec-extension/request';
import { NextResponse } from 'next/dist/server/web/spec-extension/response';
import { getEmbedding } from '@/util/openai/openai';
import { getMinutesJson } from '@/util/openai/minutes';
import { minutes, minutes_chunk } from '@/types/types';
import { Minutes, MinutesSection } from '@/models/minutes';
import { upsertMinutes } from '@/util/cosmos/minutes';
import { upsertMinutesChunk } from '@/util/cosmos/minutes_chunk';
import { v4 as uuidv4 } from 'uuid';

export const POST = async (
  req: NextRequest,
) => {
  try {
    console.log('🚀トランスクリプトから議事録を生成して登録');

    const { input, projectId, meetingId, meetingDate } = await req.json();
    if (!projectId) {
      throw new Error('Projectが選択されていません');
    }
    if (!meetingId) {
      throw new Error('Meetingが選択されていません');
    }
    if (!input) {
      throw new Error('入力がありません');
    }
    if (!meetingDate) {
      throw new Error('会議日付が入力されていません');
    }

    // OpenAIで、トランスクリプトからセクションごとに分けた議事録を生成
    const minutesData: Minutes = await getMinutesJson(input);
    console.log('   minutesData:', minutesData);
    
    // セクションごとの議事録を結合
    const minutesOriginal = minutesData.minutes.map(section => section.minutes_section).join('\n\n');
    const minutes: minutes = {
      id: uuidv4(),
      project_id: projectId,
      meeting_id: meetingId,
      date: meetingDate,
      summary: '', // いったんなし
      vector: [], // いったんなし
      minutes_original: minutesOriginal
    };
    console.log('🚀CosmosDB登録 minutes');
    console.log('   minutes:', minutes);
    await upsertMinutes(minutes);

    // セクションごとの議事録をCosmosDBに登録
    for (const section of minutesData.minutes) {
      const chunk: minutes_chunk = {
        id: uuidv4(),
        project_id: projectId,
        meeting_id: meetingId,
        minutes_id: minutes.id,
        date: meetingDate,
        minutes_chunk: "# " + section.section_title + "\n" + section.minutes_section,
        vector: await getEmbedding(section.minutes_section)
      };
      console.log('🚀CosmosDB登録 minutes_chunk');
      // vector以外をconsoleに出力
      console.log('     minutes_chunk:', { id: chunk.id, project_id: chunk.project_id, meeting_id: chunk.meeting_id, minutes_id: chunk.minutes_id, date: chunk.date, minutes_chunk: chunk.minutes_chunk });
      await upsertMinutesChunk(chunk);
    }

    // 正常に登録できたら200を返す
    return NextResponse.json({ message: 'Minutes uploaded' }, { status: 200 });

  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
};

export const dynamic = 'force-dynamic';