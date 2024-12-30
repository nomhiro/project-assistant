/**
 * @api {get} /meetings Get all meetings
 * @apiName GetAllMeetings
 * @apiGroup Meetings
 * @abstract Get all meetings
 */

import { NextRequest } from 'next/dist/server/web/spec-extension/request';
import { NextResponse } from 'next/dist/server/web/spec-extension/response';
import { getMeetingsByProjectId } from '@/util/cosmos/meetings';

export const GET = async (
  req: NextRequest,
) => {
  try {
    console.log('🚀ミーティング取得');

    // URL からクエリパラメータを取得
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId') as string;

    const meetings = await getMeetingsByProjectId(projectId);
    console.log('   meetings:', meetings);

    // 正常に取得できたら200を返す
    return NextResponse.json({ meetings }, { status: 200 });

  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
};