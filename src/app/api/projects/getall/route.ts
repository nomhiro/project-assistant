/**
 * @api {get} /projects Get all projects
 * @apiName GetAllProjects
 * @apiGroup Projects
 * @abstract Get all projects
 */

import { NextResponse } from 'next/dist/server/web/spec-extension/response';
import { getProjects } from '@/util/cosmos/project';

export const GET = async () => {
  try {
    console.log('🚀プロジェクト取得');

    const projects = await getProjects();
    console.log('   projects:', projects);

    // 正常に取得できたら200を返す
    return NextResponse.json({ projects }, { status: 200 });

  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
};

export const dynamic = 'force-dynamic';