# FVC LAB v2 — 웹툴 디벨롭 기획서

> 버전 1.0 · 2026-11-16 · 작성: Choi (AD) + Claude
> 대상: `/lab` 4개 툴 (Germinator · Pressing Plant · Colony · Mutator)
> 목표: **① 더 다양한 균** ② **더 많이 만질 수 있는 커스텀** ③ **만든 걸 실제로 쓸 수 있게(내보내기)**
> 기준 문서: `docs/00_기획서.md` (브랜드 규칙은 그대로 따른다)

---

## 0. 한 줄 요약

**시드 숫자 하나 → "유전자 6개"로 쪼갠다.** 몸·겉면·눈·무늬·표현방식·색을 각각 따로 고르고, 잠그고, 섞고, 교배할 수 있게 만든다. 균은 지금보다 **수만 배 다양**해지고, 그래도 항상 "FVC 균"처럼 보인다.

---

## 1. 지금 상태 진단 — 왜 균이 비슷비슷해 보이나

| 지금 있는 것 | 한계 |
|---|---|
| Seed −/+, New germ | 시드가 바뀌어도 **몸 구조가 항상 같음** — 둥근 덩어리 + 지글지글 털 + 산호색 얼룩 + 눈 |
| Eyes 2 / 1 / 3 / 0 | 눈 **개수만** 바뀜. 크기·모양·시선이 없어서 표정이 하나 |
| Grid Coarse / Mid / Fine | 해상도만 바뀜 |
| Inks (Coral/Cobalt/Acid/Magenta) | 색만 바뀜 |

→ **"같은 종의 다른 개체"** 만 나옴. 다양성을 늘리려면 **"다른 종"** 이 나와야 한다.
→ "다시 뽑기"만 있어서, **마음에 드는 부분을 지키면서 나머지만 바꾸는 방법**이 없음.

---

## 2. 핵심 아이디어 — 균 유전자 (Germ Genome)

```
SEED #0417
 ├─ BODY     몸 모양        (9종)
 ├─ SURFACE  겉면/털        (7종)
 ├─ EYES     눈 개수 + 표정  (6 × 6)
 ├─ PATTERN  안쪽 무늬       (7종)
 ├─ RENDER   표현 방식       (6종)
 └─ INK      색 (최대 2도)   (기존 팔레트)
```

- 유전자마다 주사위를 따로 굴린다 (잠금/개별 리롤이 다른 유전자를 흔들지 않게).
- 같은 시드 + 같은 설정 = 항상 같은 균.
- 기존 균은 절대 안 바뀐다 (8-2 버전 고정). 특히 `#0002 SPECIMEN`(시드 2).

## 3. 유전자별 옵션

### 3-1. BODY
B0 Coccus (동그란 덩어리, 기본) · B1 Diplo (땅콩) · B2 Bacillus (알약, 가로·세로·사선) · B3 Strepto (구슬 3–5개 줄) · B4 Staphylo (포도송이) · B5 Spirillum (나선) · B6 Vibrio (쉼표/강낭콩) · B7 Amoeba (위족 2–6) · B8 Budding (큰 균 + 새끼 균).
공통 슬라이더: **FAT** (0–100).

### 3-2. SURFACE
S0 Fur (기본) · S1 Cilia · S2 Flagella (긴 꼬리 1–3) · S3 Pili · S4 Bald · S5 Double Wall · S6 Halo.
슬라이더: HAIR, CHAOS. ⚠️ 왕관형 가시 금지.

### 3-3. EYES
개수: 0 (Blind) · 1 (Cyclops) · 2 · 3 · 5 · Many (Argus, 8–20).
Mood: Curious (기본) · Sleepy · Startled · Dizzy · Side-eye · Odd. 슬라이더: EYE SIZE.
⚠️ X자 눈, 눈물, 핏발 금지.

### 3-4. PATTERN
P0 Blotch (기본) · P1 Spots · P2 Bands · P3 Nucleus · P4 Gradient (하프톤) · P5 Carrier (몸 안에 작은 균) · P6 Plain.

### 3-5. RENDER
R0 Bitmap · R1 Halftone · R2 Riso · R3 Photocopy · R4 Cross-stitch · R5 Line. Grid에 Micro 추가.

### 3-6. INK
기존 팔레트, 최대 2도 (검정 + 별색 1). 추가: Inverse.

### 3-7. 학명
몸 → 속: Pinguicoccus / Pinguidiplococcus / Pinguibacillus / Pinguistreptococcus / Pinguistaphylococcus / Pinguispira / Pinguivibrio / Pinguamoeba / Pinguigemma …
눈 → 종: 0 caecus · 1 cyclops · 2 binoculus · 3 triops · Many argus
무늬 → 변종: Carrier → var. gravidus · Spots → var. maculatus · Bands → var. striatus
예) `Pinguicoccus binoculus`, `Pinguispira argus var. gravidus`

## 4. 커스텀
- 4-1 Germinator v2: 유전자 줄(BODY/SURFACE/EYES/PATTERN/RENDER/INK) + 🔒 잠금 + ↻ 개별 리롤, 게놈 코드 `B5-S2-E3·Dz-P5-R0`, 학명, Specimen code.
- 4-2 Mutate / Breed / Evolve (3×3).
- 4-3 움직임: 숨쉬기, 깜빡임, 꼬리, 눈 따라가기. reduced-motion이면 정지.
- 4-4 단축키: Space 새 균 · M 변이 · E 진화 · 1–6 잠금 · ←/→ 시드 · S 저장.

## 5. 툴 연결 + 새 툴
- Carry to → Pressing Plant / Colony (몸 모양으로 원 채우기) / Mutator ("Germ" 균주).
- Custom Silhouette: 몸 = 흑백 마스크 → 글자, 그림, 로고도 균이 됨.
- 새 툴 후보: Petri Dish · Specimen Card · Contact Sheet · Sonifier.

## 6. 내보내기
PNG (1×/4×/4000px, 투명) · SVG · 잉크 분판 · Sticker (다이컷) · GIF/MP4 · Specimen Card · URL `?seed=417&g=B5-S2-E3Dz-P5-R0`.

## 7. 브랜드 가드레일 (엔진이 강제)
1. 잉크 최대 2도  2. 입·볼터치·눈물 없음  3. 왕관형 가시, X자 눈, 핏발 금지  4. 눈은 항상 몸 안  5. 항상 격자 위  6. 금지 단어 리스트 적용

## 8. 기술 설계
- 8-1 레이어: genome.ts → genes/body, surface, eyes, pattern, render → germ2 합성 → rules.ts, name.ts.
- 8-2 버전 고정: 현재 엔진을 v1으로 얼림, strains.json에 `"engine": 1`, Lab 새 균은 engine 2, URL `v=1`이면 옛 방식. 시드 1–50 + 2, 417, 2203, 88, 1113, 3009 스냅샷 비교.
- 8-3 성능: 1마리 16ms 이내 (Fine), 무거우면 Web Worker.

## 9. 로드맵
L1 More Germs → L2 Play → L3 Render & Export → L4 New Tools → L5 Sonifier.

## 10. 결정 필요 (Choi)
1. 이름 톤 (실제 미생물 이름 추천)  2. Render 확장 범위  3. Strain Type ↔ 몸 모양  4. 균 갤러리  5. FAT 최대치
