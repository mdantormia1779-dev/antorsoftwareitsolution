import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const reportId = searchParams.get('reportId') || 'general-report';

    // ডেমো কন্টেন্ট তৈরি করা
    const fileContent = `========================================
REPORT GENERATED: ${reportId.toUpperCase()}
TYPE: ${type}
DATE: ${new Date().toLocaleString()}
========================================
This is an automatically generated report data snapshot.
Status: Success
----------------------------------------`;

    const buffer = Buffer.from(fileContent, 'utf-8');

    if (type === 'Excel') {
      return new NextResponse(buffer, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="${reportId}-report.csv"`,
        },
      });
    } else {
      return new NextResponse(buffer, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Content-Disposition': `attachment; filename="${reportId}-report.txt"`,
        },
      });
    }
  } catch (error) {
    console.error('API Export Crash Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error during report generation' },
      { status: 500 }
    );
  }
}