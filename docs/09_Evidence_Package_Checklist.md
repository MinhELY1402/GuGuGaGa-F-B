# GÓI BẰNG CHỨNG KIỂM TOÁN (EVIDENCE PACKAGE CHECKLIST)
## DỰ ÁN GUGUGAGA — QUẢN TRỊ DỰ ÁN PHẦN MỀM (VKU)

**Cập nhật:** 15/11/2026 · **Repo:** https://github.com/MinhELY1402/GuGuGaGa-F-B · **Release:** [v1.1.0-beta](https://github.com/MinhELY1402/GuGuGaGa-F-B/releases/tag/v1.1.0-beta)

Ký hiệu trạng thái: ✅ có bằng chứng kiểm chứng được · ⚠️ có một phần / cần bổ sung · ❌ chưa có.

> Mọi link trong checklist đều trỏ tới dữ liệu thật trên GitHub. Mục nào chưa có bằng chứng thì ghi "chưa có", không thay bằng nội dung tự viết.

---

## A. GHI CHÚ VỀ TÍNH XÁC THỰC (ĐỌC TRƯỚC)

| Nội dung | Sự thật kiểm chứng được |
|---|---|
| Ngày tạo repo | 09/11/2026 (GitHub API `created_at`) |
| Lịch sử commit trước 09/11 | **Được tổ chức lại** khi chuyển mã nguồn từ ĐACN1 sang repo này; các commit "Merge pull request #1–#24" là merge cục bộ, không có PR tương ứng trên GitHub (`docs/00_Project_History.md` §3) |
| Issue #1–#25, milestone Sprint 1/2/Release | Tạo và đóng ngày 09/11/2026 để **ghi lại** hạng mục đã làm trong ĐACN1 |
| Giai đoạn ghi nhận theo thời gian thực | Từ 14/11/2026: PR #26, #43, #44, issue #27–#50, CI, release v1.1.0-beta |
| Hỗ trợ của AI | Các commit từ 14/11 có dòng `Co-Authored-By: Claude`. Nhóm dùng trợ lý AI (Claude Code) để sửa lỗi, viết test, tài liệu và báo cáo; nội dung đã được thành viên kiểm tra |
| Kịch bản EVM tuần 6 | **Giả định** (không có giờ công thực tế tuần 1–6), đã ghi rõ trong báo cáo |

---

## B. CHECKLIST THEO 5 BÁO CÁO BẮT BUỘC

### Báo cáo 1 — Điều lệ dự án (Project Charter)
| # | Bằng chứng | Vị trí | Trạng thái |
|---|---|---|---|
| 1.1 | Charter đủ mục: mục tiêu, phạm vi in/out, tiêu chí nghiệm thu, ràng buộc, mốc, rủi ro ban đầu, tổ chức, stakeholder, ngân sách | `Project-Charter.md`, `docs/word/00a_Dieu_le_du_an_Project_Charter.docx` | ✅ |
| 1.2 | Nguồn đề tài Pathway 1 (kế thừa ĐACN1) | Charter §2, `docs/00_Project_History.md` | ⚠️ Thiếu bằng chứng ĐACN1: đề cương, báo cáo, GVHD (issue [#32](https://github.com/MinhELY1402/GuGuGaGa-F-B/issues/32)) |
| 1.3 | Chữ ký xác nhận của nhóm và GV | Charter §13 | ❌ Chưa có chữ ký thật (đang là `[ký thật]`) |
| 1.4 | Charter quản lý trên GitHub | [Project-Charter.md](https://github.com/MinhELY1402/GuGuGaGa-F-B/blob/main/Project-Charter.md), issue #2 | ✅ |

### Báo cáo 2 — WBS & WBS Dictionary
| # | Bằng chứng | Vị trí | Trạng thái |
|---|---|---|---|
| 2.1 | Cây WBS 3 cấp, quy tắc 100%, 27 gói lá | `WBS_Project_Management.md`, `docs/03_WBS_and_WBS_Dictionary.md`, báo cáo v2 Part 2 | ✅ |
| 2.2 | Mỗi gói lá 1–2 tuần (40–80 giờ) | Bảng gói việc (cột Thời gian, Giờ) | ✅ |
| 2.3 | MoSCoW, MVP ~60% (Must 62,2% công sức, tính lại từ bảng) | WBS Phần 2 | ✅ |
| 2.4 | Từ điển WBS kèm tiêu chí nghiệm thu định lượng | `docs/03` §2, WBS Phần 3 | ⚠️ Mới có 3 gói trọng yếu (1.2.4, 1.4.2/1.4.4, 1.6.2/1.6.3) |
| 2.5 | RACI, PERT/CPM, Gantt (có đính chính đường găng 75 → 60 ngày) | WBS Phần 4–6, báo cáo v2 Part 3 | ✅ |

### Báo cáo 3 — Dynamic Risk Register
| # | Bằng chứng | Vị trí | Trạng thái |
|---|---|---|---|
| 3.1 | Sổ rủi ro P×I, biện pháp phòng ngừa và ứng phó, người phụ trách | `docs/04_Risk_Register_Evolution.md` | ✅ |
| 3.2 | Cập nhật Week 6 (Sprint 1) và Week 11 (Sprint 2) | `docs/04`, các cột Week 6 / Week 11 | ⚠️ Ghi lại sau, từ ĐACN1 (xem chú thích trong `docs/04`); cần biên bản họp hoặc tin nhắn gốc làm bằng chứng |
| 3.3 | Cập nhật sau kiểm thử thực tế 15/11 (R06 đã xảy ra, R11, R12) | `docs/04` cuối file | ✅ Ghi nhận theo thời gian thực |
| 3.4 | Rủi ro dẫn tới thay đổi phạm vi CR-01 | `docs/06_Scope_Change_Control_Record.md`, issue #16, #17 | ⚠️ Chưa có số đo trước/sau (issue [#35](https://github.com/MinhELY1402/GuGuGaGa-F-B/issues/35)) |

### Báo cáo 4 — Final Report & Evidence Package
| # | Bằng chứng | Vị trí | Trạng thái |
|---|---|---|---|
| 4.1 | Báo cáo tổng kết | `docs/01_Final_Technical_Report.md`, `docs/word/01_Bao_cao_tong_ket.docx` | ✅ (còn mục `[CẦN BỔ SUNG]`: EVM thật, UAT, đóng góp) |
| 4.2 | Báo cáo Major Assignment theo mẫu VKU | `docs/Major_Assignment_SPM_GuGuGaGa_v2.docx` | ✅ (lớp `[Class]` chưa điền) |
| 4.3 | Kế hoạch QLDA (scope, schedule, cost/EVM, quality, communication, stakeholder, CM) | `docs/02_Project_Management_Plan.md` | ✅ |
| 4.4 | Biên bản Sprint / Retrospective | `docs/05_Sprint_Retrospectives.md` | ⚠️ Retro ĐACN1 cần đối chiếu bằng chứng gốc; chưa có biên bản QTDA-A/B (issue #33, #38) |
| 4.5 | EVM với số liệu thật | — | ❌ Chưa có (issue [#38](https://github.com/MinhELY1402/GuGuGaGa-F-B/issues/38)) |
| 4.6 | Biên bản UAT có chữ ký | `docs/07_Stakeholder_Acceptance_Signoff.md` | ❌ Mới có kịch bản, chưa thực hiện (issue [#39](https://github.com/MinhELY1402/GuGuGaGa-F-B/issues/39)) |
| 4.7 | Gói bằng chứng (tài liệu này) | `docs/09_Evidence_Package_Checklist.md` | ✅ |

### Báo cáo 5 — Defense Slides & Rubric
| # | Bằng chứng | Vị trí | Trạng thái |
|---|---|---|---|
| 5.1 | Slide bảo vệ (11 slide, có ghi chú người nói) | `docs/GuGuGaGa_Slide_Bao_Ve.pptx`, `docs/08_Presentation_Slide_Deck.md` | ✅ |
| 5.2 | Kịch bản live demo chỉ gồm tính năng đã chạy | Slide 11 | ✅ |
| 5.3 | Tự đánh giá theo Rubric | — | ❌ Chưa có (cần file rubric của GV) |

---

## C. BẰNG CHỨNG QUÁ TRÌNH TRÊN GITHUB (GIAI ĐOẠN QTDA, TỪ 14/11/2026)

### C.1. Pull Request
| PR | Nội dung | Merge | CI | Review |
|---|---|---|---|---|
| [#26](https://github.com/MinhELY1402/GuGuGaGa-F-B/pull/26) | Khôi phục route backend, test thật, CI thật | 14/11 → `main` | [✅ run 43569642142](https://github.com/MinhELY1402/GuGuGaGa-F-B/actions/runs/43569642142) | ❌ Không có review |
| [#43](https://github.com/MinhELY1402/GuGuGaGa-F-B/pull/43) | Server demo, đổi URL trong app, nâng Gradle, sửa MainActivity, bản đồ | 15/11 → `main` | [✅ run 43711282664](https://github.com/MinhELY1402/GuGuGaGa-F-B/actions/runs/43711282664) | ❌ Không có review |
| [#44](https://github.com/MinhELY1402/GuGuGaGa-F-B/pull/44) | Chatbot qua backend, đăng nhập Google, nhận dạng ảnh, ảnh món, chi nhánh thật | 15/11 → `main` | [✅ run 43721485370](https://github.com/MinhELY1402/GuGuGaGa-F-B/actions/runs/43721485370) | ❌ Không có review |

> Cả 3 PR đều merge thẳng vào `main`, không qua `develop` và không có review, trái với quy trình GitFlow trong `docs/02` §8. Đã ghi nhận tại issue [#50](https://github.com/MinhELY1402/GuGuGaGa-F-B/issues/50).

### C.2. Issue và Milestone
| Milestone | Đã đóng | Đang mở | Ghi chú |
|---|---:|---:|---|
| QTDA-A (hạn 19/11) | 3 (#27, #28, #29) | 4 (#30–#33) | — |
| QTDA-B (hạn 24/11) | 0 | 9 (#34–#38, #45, #46, #49, #50) | — |
| QTDA-C (hạn 29/11) | 1 (#40) | 5 (#39, #41, #42, #47, #48) | — |
| Sprint 1, Sprint 2, Release v1.0.0 | 24 | 0 | Tạo và đóng ngày 09/11 (mục A) |

Mỗi issue QTDA có label `type:`, `area:`, `priority:`, `moscow:`, `sp:` (story point), người phụ trách và milestone ([danh sách issue](https://github.com/MinhELY1402/GuGuGaGa-F-B/issues)).

### C.3. CI (GitHub Actions)
- Workflow `.github/workflows/ci.yml`: backend `npm test`, build Admin, `flutter analyze` và `flutter test` cho 2 app.
- Lần chạy trên `main` mới nhất: [✅ run 43721620418](https://github.com/MinhELY1402/GuGuGaGa-F-B/actions/runs/43721620418) (15/11/2026).

### C.4. Release
- [v1.1.0-beta](https://github.com/MinhELY1402/GuGuGaGa-F-B/releases/tag/v1.1.0-beta) (pre-release, 15/11/2026): 2 APK (Khách hàng, Tài xế) và `SHA256SUMS.txt`.
- ⚠️ Tag đang trỏ vào commit `0ac8f9d`, chưa phải commit build APK cuối cùng (issue #50).

---

## D. BẰNG CHỨNG KỸ THUẬT & CHẤT LƯỢNG

| # | Bằng chứng | Kết quả | Vị trí |
|---|---|---|---|
| D.1 | Test backend tự động | 22/22 pass | `Backend/test/`, CI |
| D.2 | Kiểm thử luồng E2E qua API thật (Firestore Emulator) | Đặt món → webhook PAID (sai token 401, gửi lặp bỏ qua) → gán tài xế → giao → dashboard | `docs/01` §6.2 |
| D.3 | Kiểm tra nội dung APK | Version 1.1.0, có MainActivity, chỉ có token Mapbox public, không có secret | `docs/01` §6.4 |
| D.4 | Kiểm thử trên điện thoại thật | Tìm 10 lỗi, đã sửa và phát hành lại | `docs/00` §5.2 (ảnh chụp màn hình: [CẦN BỔ SUNG]) |
| D.5 | Kết quả kiểm thử thủ công đầy đủ | — | ❌ Chưa có (issue [#49](https://github.com/MinhELY1402/GuGuGaGa-F-B/issues/49)) |
| D.6 | Accuracy model AI | — | ❌ Chưa đo (issue [#34](https://github.com/MinhELY1402/GuGuGaGa-F-B/issues/34)); `AI_Service/evaluate.py` đã sẵn sàng |
| D.7 | Bảo mật: thu hồi key Gemini bị lộ | — | ❌ Chưa thu hồi (issue [#45](https://github.com/MinhELY1402/GuGuGaGa-F-B/issues/45)) |

---

## E. ĐÓNG GÓP THÀNH VIÊN

### E.1. Giai đoạn QTDA (từ 14/11/2026, số liệu từ git)
| Thành viên | Tài khoản GitHub | Commit (không tính merge) | Merge PR | Issue được giao (đang mở) |
|---|---|---:|---:|---|
| Trần Phan Minh Tiến | JunCodera1 | 14 (có Claude cùng tham gia) | 3 (#26, #43, #44) | #30, #41, #45, #50 |
| Võ Nhật Huy | HuyVo117 | 0 | 0 | #31, #33, #38, #39, #42, #48, #49 |
| Nguyễn Bảo Quang Minh | MinhELY1402 | 0 | 0 | #32, #36, #37, #46 |
| Nguyễn Gia Bảo | giabaoqh | 0 | 0 | #34, #35, #47 |

> Bảng này phản ánh đúng dữ liệu git ngày 15/11. Các thành viên khác cần đóng góp qua PR của chính mình trong QTDA-A/B/C để có bằng chứng.

### E.2. Giai đoạn ĐACN1 (24/08 – 09/11)
[CẦN BỔ SUNG: mô tả phần việc từng người trong ĐACN1, kèm bằng chứng gốc (repo hoặc thư mục cũ, báo cáo ĐACN1, tin nhắn nhóm)]

---

## F. VIỆC CẦN LÀM TRƯỚC KHI NỘP

| # | Việc | Báo cáo | Issue |
|---|---|---|---|
| 1 | Ký Charter (nhóm và GV) | 1 | — |
| 2 | Bằng chứng ĐACN1 | 1, 3, 4 | #32 |
| 3 | Bằng chứng gốc cho Risk Register Week 6/11 và retro Sprint 1 | 3, 4 | #32 |
| 4 | EVM với số liệu thật; biên bản sprint QTDA | 4 | #33, #38 |
| 5 | UAT có chữ ký; kiểm thử thủ công | 4 | #39, #49 |
| 6 | Tự đánh giá theo Rubric | 5 | — |
| 7 | Thu hồi key Gemini, bật branch protection, review PR | 4 | #45, #30, #50 |
