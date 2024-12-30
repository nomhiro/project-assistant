/**
 * @api {post} /minutes/inference Inference minutes
 * @apiName InferenceMinutes
 * @apiGroup Minutes
 * @abstract ユーザメッセージをベクトル化し、過去の議事録をベクトル検索し推論する
 */

import { NextRequest } from 'next/dist/server/web/spec-extension/request';
import { NextResponse } from 'next/dist/server/web/spec-extension/response';
import { getEmbedding } from '@/util/openai/openai';
import { minutes_chunk } from '@/types/types';
import { getMinutesChunkByVecFilteredProject, getMinutesChunkByVecFilteredMeeting } from '@/util/cosmos/minutes_chunk';
import { getMinutesById } from '@/util/cosmos/minutes';
import { getChatCompletion } from '@/util/openai/openai';

export const POST = async (
  req: NextRequest,
) => {
  try {
    const { input, projectId, meetingId, mode } = await req.json();
    console.log('   input:', input);

    // ユーザメッセージをベクトル化
    const inputVector = await getEmbedding(input);

    // modeがprojectの場合は、projectIdでフィルターしてベクトル検索
    let minutesChunks: minutes_chunk[] = [];

    if (mode === 'project') {
      minutesChunks = await getMinutesChunkByVecFilteredProject(inputVector, projectId);
    } else if (mode === 'meeting') {
      minutesChunks = await getMinutesChunkByVecFilteredMeeting(inputVector, projectId, meetingId);
    }

    // minutes_idをもとにminutesを取得
    let minutesIds: string[] = [];
    for (const minutesChunk of minutesChunks) {
      minutesIds.push(minutesChunk.minutes_id);
    }
    // minutesIdsの重複を削除
    minutesIds = Array.from(new Set(minutesIds));
    console.log('   minutesIds:', minutesIds);

    let minutesText = '';
    for (let i = 0; i < minutesIds.length; i++) {
      const minutesId = minutesIds[i];
      const minutes = await getMinutesById(minutesId);
      console.log('   minutes:', minutes);
      minutesText += `\n\n--- 議事録 ${i + 1} ---\n` + minutes.minutes_original;
    }

    const systemMessage = `あなたはプロジェクトマネジメントをサポートする役割です。過去の議事録の内容をもとに、ユーザメッセージに対する回答を生成してください。議事録が与えられていない、または回答するための情報が不足している場合は、理由とともに答えられない旨の回答をしてください。${minutesText}`;
    console.log('   systemMessage:', systemMessage);

    let messages: ChatMessage[] = [
      { role: 'system', content: systemMessage }
    ];
    messages.push({ role: 'user', content: input });   //TODO: 本来はチャット履歴を渡したい

    // OpenAIによる推論
    const inferenceResponse = await getChatCompletion(messages);
    console.log('   inferenceResponse:', inferenceResponse);

    return NextResponse.json({ response: inferenceResponse }, { status: 200 });

  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}