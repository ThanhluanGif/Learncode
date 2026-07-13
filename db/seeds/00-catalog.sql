/*
SOURCE AUDIT
- URL: https://tinhoctre.vn
- Provider: Trung ương Đoàn
- Year range: 2014-2023
- Verification date: 2026-07-13
- Usage policy: reuse_allowed (official public archive)

- URL: https://vnoi.info/problems
- Provider: VNOI
- Year range: null
- Verification date: 2026-07-13
- Usage policy: link_only
*/

INSERT INTO content_sources (id, slug, title, provider, source_type, url, is_official, year_from, year_to, usage_policy, verified_at)
VALUES 
  (1, 'tinhoctre-national', 'Đề thi Hội thi Tin học trẻ toàn quốc', 'Trung ương Đoàn', 'contest', 'https://tinhoctre.vn', true, 2014, 2023, 'reuse_allowed', '2026-07-13T00:00:00Z'),
  (2, 'vnoi-archive', 'VNOI Problem Archive', 'VNOI', 'community', 'https://vnoi.info', false, null, null, 'link_only', '2026-07-13T00:00:00Z')
ON CONFLICT(id) DO UPDATE SET slug=excluded.slug, is_official=excluded.is_official, usage_policy=excluded.usage_policy;

INSERT INTO exam_papers (id, source_id, external_id, year, title, round, division, duration_minutes, total_points, official_url, source_status)
VALUES 
  (1, 1, 'tinhoctre-national-2022-b', 2022, 'Tin học trẻ toàn quốc 2022 - Bảng B', 'Chung kết quốc gia', 'B', 150, 100, 'https://tinhoctre.vn/2022-b', 'official'),
  (2, 1, 'tinhoctre-national-2023-c1', 2023, 'Tin học trẻ toàn quốc 2023 - Bảng C1', 'Chung kết quốc gia', 'C1', 150, 100, 'https://tinhoctre.vn/2023-c1', 'official')
ON CONFLICT(id) DO UPDATE SET title=excluded.title;

INSERT INTO problems (id, source_id, exam_paper_id, external_id, title, division, topics_json, difficulty, points, time_limit_ms, official_url, short_description, source_metadata_json)
VALUES 
  (1, 1, 1, '2022-b-p1', 'Bài 1: Xếp diêm', 'B', '["Quy hoạch động", "Toán học"]', 'Trung bình', 100, 1000, 'https://tinhoctre.vn/2022-b/p1', 'Tìm cách xếp diêm tạo số lớn nhất', '{"statementType": "stored"}'),
  (2, 2, null, 'vnoi-p1', 'Chuỗi hạt', 'B/C', '["Chuỗi", "Tham lam"]', 'Dễ', 100, 1000, 'https://vnoi.info/problems/show/chuoihat', 'Sắp xếp các hạt theo yêu cầu', '{"statementType": "link", "judgeUrl": "https://vnoi.info"}')
ON CONFLICT(id) DO UPDATE SET title=excluded.title;
