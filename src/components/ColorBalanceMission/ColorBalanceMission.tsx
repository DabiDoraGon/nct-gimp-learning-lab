
import { useState } from 'react';
import originalImage from '@/assets/color-balance/CB_Practice_01.png';
import finalImage from '@/assets/color-balance/CB_Practice_01_Final.png';

interface ColorBalanceMissionProps {
  onClose: () => void;
  onComplete?: () => void;
}

type Stage =
  | 'intro'
  | 'file-menu'
  | 'open-dialog'
  | 'colors-menu'
  | 'balance'
  | 'completed';

type RangeId = 'shadows' | 'midtones' | 'highlights';

type ChannelId = 'cyanRed' | 'magentaGreen' | 'yellowBlue';

const RANGES: {
  id: RangeId;
  title: string;
  subtitle: string;
  channel: ChannelId;
  channelLabel: string;
  leftLabel: string;
  rightLabel: string;
  target: number;
  instruction: string;
}[] = [
  {
    id: 'shadows',
    title: 'Shadows',
    subtitle: 'Vùng tối',
    channel: 'cyanRed',
    channelLabel: 'Cyan – Red',
    leftLabel: 'Cyan',
    rightLabel: 'Red',
    target: 25,
    instruction: 'Kéo thanh Cyan – Red về phía Red đến mốc +25.',
  },
  {
    id: 'midtones',
    title: 'Midtones',
    subtitle: 'Vùng trung bình',
    channel: 'magentaGreen',
    channelLabel: 'Magenta – Green',
    leftLabel: 'Magenta',
    rightLabel: 'Green',
    target: -20,
    instruction: 'Kéo thanh Magenta – Green về phía Magenta đến mốc -20.',
  },
  {
    id: 'highlights',
    title: 'Highlights',
    subtitle: 'Vùng sáng',
    channel: 'yellowBlue',
    channelLabel: 'Yellow – Blue',
    leftLabel: 'Yellow',
    rightLabel: 'Blue',
    target: 18,
    instruction: 'Kéo thanh Yellow – Blue về phía Blue đến mốc +18.',
  },
];

const FILE_ITEMS = [
  'New...',
  'Create',
  'Open...',
  'Open as Layers...',
  'Open as Link Layer...',
  'Save',
];

const COLOR_ITEMS = [
  'Color Balance...',
  'Color Temperature...',
  'Hue-Chroma...',
  'Hue-Saturation...',
  'Saturation...',
  'Exposure...',
  'Shadows-Highlights...',
  'Brightness-Contrast...',
  'Levels...',
  'Curves...',
];

const EMPTY_VALUES = {
  cyanRed: 0,
  magentaGreen: 0,
  yellowBlue: 0,
};

export function ColorBalanceMission({
  onClose,
  onComplete,
}: ColorBalanceMissionProps) {
  const [stage, setStage] = useState<Stage>('intro');
  const [exitConfirm, setExitConfirm] = useState(false);

  const [menuFeedback, setMenuFeedback] = useState('');
  const [selectedImage, setSelectedImage] = useState(false);
  const [balanceFeedback, setBalanceFeedback] = useState('');

  const [activeRangeIndex, setActiveRangeIndex] = useState(0);

  const [values, setValues] = useState<
    Record<RangeId, typeof EMPTY_VALUES>
  >({
    shadows: { ...EMPTY_VALUES },
    midtones: { ...EMPTY_VALUES },
    highlights: { ...EMPTY_VALUES },
  });

  const [completed, setCompleted] = useState<RangeId[]>([]);
  const [preserveLuminosity, setPreserveLuminosity] = useState(true);
  const [preview, setPreview] = useState(true);

  const activeRange = RANGES[activeRangeIndex];

  const currentValue = activeRange
    ? values[activeRange.id][activeRange.channel]
    : 0;

  const isRangeCorrect =
    !!activeRange && currentValue === activeRange.target;

  const closeMission = () => {
    setExitConfirm(false);
    onClose();
  };

  const showWrongAnswer = (message: string) => {
    setMenuFeedback(message);
  };

  const handleFileChoice = (item: string) => {
    setMenuFeedback('');

    if (item === 'Open...') {
      setSelectedImage(false);
      setStage('open-dialog');
    } else {
      showWrongAnswer(
        `Chưa chính xác! Bạn đã chọn "${item}". Hãy chọn File → Open... để mở ảnh.`
      );
    }
  };

  const handleOpenImage = () => {
    if (!selectedImage) {
      showWrongAnswer('Hãy chọn ảnh CB_Practice_01.png trước khi nhấn Open.');
      return;
    }

    setMenuFeedback('');
    setStage('colors-menu');
  };

  const handleColorChoice = (item: string) => {
    setMenuFeedback('');

    if (item === 'Color Balance...') {
      setActiveRangeIndex(0);
      setStage('balance');
    } else {
      showWrongAnswer(
        `Chưa chính xác! "${item}" không phải công cụ cần sử dụng. Hãy chọn Color Balance...`
      );
    }
  };

  const handleSliderChange = (value: number) => {
    if (!activeRange || isRangeCorrect) return;

    setValues((previous) => ({
      ...previous,
      [activeRange.id]: {
        ...previous[activeRange.id],
        [activeRange.channel]: value,
      },
    }));

    if (value === activeRange.target) {
      setBalanceFeedback(
        `Chính xác! Bạn đã điều chỉnh ${activeRange.title} thành công. Hãy nhấn OK để tiếp tục.`
      );
    } else {
      setBalanceFeedback('');
    }
  };

  const handleResetRange = () => {
    if (!activeRange || isRangeCorrect) return;

    setValues((previous) => ({
      ...previous,
      [activeRange.id]: { ...EMPTY_VALUES },
    }));

    setBalanceFeedback('');
  };

  const handleConfirmRange = () => {
    if (!activeRange || !isRangeCorrect) return;

    const nextCompleted = [...completed, activeRange.id];
    setCompleted(nextCompleted);
    setBalanceFeedback('');

    if (activeRangeIndex < 2) {
      setActiveRangeIndex((previous) => previous + 1);
      return;
    }

    setStage('completed');
    onComplete?.();
  };

  const progress =
    stage === 'completed'
      ? 100
      : stage === 'balance'
        ? 65 + completed.length * 10
        : stage === 'colors-menu'
          ? 55
          : stage === 'open-dialog'
            ? 35
            : stage === 'file-menu'
              ? 20
              : 5;

  const renderMenuItems = (
    items: string[],
    correctItem: string,
    onChoose: (item: string) => void
  ) => (
    <div className="space-y-1">
      {items.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onChoose(item)}
          className={`w-full rounded px-3 py-2.5 text-left text-sm transition-colors ${
            item === correctItem
              ? 'text-amber-300 hover:bg-amber-500/20'
              : 'text-slate-300 hover:bg-white/10'
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/85 p-3 sm:p-6">
      <div className="relative my-auto w-full max-w-4xl overflow-hidden rounded-xl border border-[#52647b] bg-[#20242b] text-white shadow-2xl">

        {/* HEADER */}
        <header className="flex items-center justify-between border-b border-white/10 bg-[#29384d] px-4 py-3">
          <div>
            <h2 className="text-lg font-bold">
              Color Balance Mission
            </h2>
            <p className="text-xs text-slate-300">
              NCT GIMP Learning Lab
            </p>
          </div>

          <button
            type="button"
            onClick={() => setExitConfirm(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-2xl hover:bg-red-500/30"
            aria-label="Thoát nhiệm vụ"
          >
            ×
          </button>
        </header>

        {/* PROGRESS */}
        <div className="px-4 pt-4">
          <div className="mb-2 flex justify-between text-xs text-slate-300">
            <span>TIẾN TRÌNH NHIỆM VỤ</span>
            <span>{completed.length}/3 vùng màu</span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <main className="max-h-[72vh] overflow-y-auto p-4 sm:p-6">

          {/* INTRO */}
          {stage === 'intro' && (
            <div className="space-y-5">
              <h3 className="text-center text-2xl font-bold text-amber-300">
                NHIỆM VỤ: CÂN BẰNG MÀU SẮC
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <img
                    src={originalImage}
                    alt="Ảnh gốc"
                    className="aspect-[3/2] w-full rounded-lg object-cover"
                  />
                  <p className="mt-2 text-center text-sm font-semibold">
                    Ảnh gốc
                  </p>
                </div>

                <div>
                  <img
                    src={finalImage}
                    alt="Ảnh sau cân bằng màu"
                    className="aspect-[3/2] w-full rounded-lg object-cover"
                  />
                  <p className="mt-2 text-center text-sm font-semibold text-emerald-400">
                    Ảnh sau cân bằng màu
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <h4 className="mb-2 font-bold text-amber-300">
                  Kiến thức cần nhớ
                </h4>

                <p className="text-sm leading-relaxed text-slate-200">
                  Color Balance điều chỉnh sự cân bằng màu sắc
                  bằng cách tăng hoặc giảm các màu đối lập.
                </p>

                <div className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                  <p>🔵 Cyan – 🔴 Red</p>
                  <p>🟣 Magenta – 🟢 Green</p>
                  <p>🟡 Yellow – 🔵 Blue</p>
                </div>

                <div className="mt-4 border-t border-white/10 pt-3">
                  <p className="mb-2 font-semibold">
                    Ba vùng điều chỉnh:
                  </p>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    {RANGES.map((range) => (
                      <div
                        key={range.id}
                        className="rounded bg-black/20 p-2"
                      >
                        <b>{range.title}</b>
                        <p className="mt-1 text-slate-400">
                          {range.subtitle}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStage('file-menu')}
                className="w-full rounded-lg bg-amber-500 py-3 font-bold text-slate-950 hover:bg-amber-400"
              >
                BẮT ĐẦU NHIỆM VỤ
              </button>
            </div>
          )}

          {/* FILE MENU */}
          {stage === 'file-menu' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-amber-300">
                Bước 1. Mở ảnh thực hành
              </h3>

              <p className="text-sm text-slate-300">
                Trên thanh bảng chọn GIMP, hãy nhấn File
                rồi chọn Open...
              </p>

              <div className="rounded-lg border border-white/10 bg-[#171a20] p-3">
                <div className="mb-3 border-b border-white/10 pb-3">
                  <span className="rounded bg-blue-500/20 px-4 py-2 font-bold text-blue-300">
                    File
                  </span>
                </div>

                {renderMenuItems(
                  FILE_ITEMS,
                  'Open...',
                  handleFileChoice
                )}
              </div>

              {menuFeedback && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300"
                >
                  ✕ {menuFeedback}
                </div>
              )}

              <p className="text-center text-xs text-slate-400">
                Hãy chọn đúng thao tác để tiếp tục.
              </p>
            </div>
          )}

          {/* OPEN DIALOG */}
          {stage === 'open-dialog' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-amber-300">
                Bước 2. Hộp thoại Open Image
              </h3>

              <p className="text-sm text-slate-300">
                Tìm và chọn đúng ảnh được chỉ định trong danh sách.
              </p>

              <div className="overflow-hidden rounded-lg border border-white/10 bg-[#171a20]">
                <div className="border-b border-white/10 bg-[#303744] px-4 py-3 font-semibold">
                  Open Image
                </div>

                <div className="p-4">
                  <button
                    type="button"
                    onClick={() => setSelectedImage(true)}
                    className={`w-full rounded-lg border-2 p-3 text-left transition-colors ${
                      selectedImage
                        ? 'border-amber-400 bg-amber-500/10'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={originalImage}
                        alt="Ảnh thực hành"
                        className="h-20 w-28 rounded object-cover"
                      />

                      <div className="min-w-0 flex-1">
                        <p className="break-all text-sm font-bold">
                          CB_Practice_01.png
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          PNG Image · 580 × 386 px
                        </p>
                        <p className="mt-2 text-xs text-emerald-400">
                          Ảnh thực hành được chỉ định
                        </p>
                      </div>

                      <span className="text-xl">
                        {selectedImage ? '●' : '○'}
                      </span>
                    </div>
                  </button>
                </div>

                <div className="flex justify-end gap-2 border-t border-white/10 bg-[#303744] p-3">
                  <button
                    type="button"
                    onClick={() => {
                      setStage('file-menu');
                      setSelectedImage(false);
                      setMenuFeedback('');
                    }}
                    className="rounded border border-white/20 px-5 py-2 text-sm hover:bg-white/10"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleOpenImage}
                    className="rounded bg-blue-600 px-6 py-2 text-sm font-semibold hover:bg-blue-500"
                  >
                    Open
                  </button>
                </div>
              </div>

              {menuFeedback && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300"
                >
                  ✕ {menuFeedback}
                </div>
              )}

              <p className="text-center text-xs text-slate-400">
                Chọn ảnh rồi nhấn Open để xác nhận.
              </p>
            </div>
          )}

          {/* COLORS MENU */}
          {stage === 'colors-menu' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-amber-300">
                Bước 3. Chọn Color Balance
              </h3>

              <p className="text-sm text-slate-300">
                Trên thanh bảng chọn, mở Colors và chọn
                Color Balance...
              </p>

              <div className="rounded-lg border border-white/10 bg-[#171a20] p-3">
                <div className="mb-3 border-b border-white/10 pb-2 font-bold">
                  Colors
                </div>

                {renderMenuItems(
                  COLOR_ITEMS,
                  'Color Balance...',
                  handleColorChoice
                )}
              </div>

              {menuFeedback && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300"
                >
                  ✕ {menuFeedback}
                </div>
              )}

              <p className="text-center text-xs text-slate-400">
                Hãy chọn đúng công cụ Color Balance...
              </p>
            </div>
          )}

          {/* COLOR BALANCE DIALOG */}
          {stage === 'balance' && activeRange && (
            <div className="space-y-4">
              {/* Image preview */}
              <div className="grid grid-cols-[1fr_auto] items-center gap-2">
                <div>
                  <h3 className="text-lg font-bold">
                    Color Balance
                  </h3>
                  <p className="text-xs text-slate-400">
                    CB_Practice_01.png · RGB
                  </p>
                </div>

                <span className="rounded bg-emerald-500/15 px-3 py-1 text-xs text-emerald-400">
                  {completed.length}/3 hoàn thành
                </span>
              </div>

              {preview && (
                <div className="rounded-lg border border-white/10 bg-[#171a20] p-2">
                  <img
                    src={originalImage}
                    alt="Ảnh đang cân bằng màu"
                    className="mx-auto max-h-48 w-auto rounded object-contain"
                  />
                </div>
              )}

              {/* Range selection */}
              <div className="rounded-lg border border-white/10 bg-[#171a20] p-4">
                <p className="mb-3 text-sm font-semibold">
                  Select Range to Adjust
                </p>

                <div className="grid grid-cols-3 gap-2">
                  {RANGES.map((range, index) => {
                    const isDone = completed.includes(range.id);
                    const isActive = index === activeRangeIndex;

                    return (
                      <div
                        key={range.id}
                        className={`rounded-lg border p-2 text-center text-xs ${
                          isDone
                            ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                            : isActive
                              ? 'border-amber-400 bg-amber-500/15 text-amber-300'
                              : 'border-white/10 text-slate-500'
                        }`}
                      >
                        <div className="font-bold">
                          {isDone ? '✓ ' : isActive ? '● ' : '○ '}
                          {range.title}
                        </div>
                        <div className="mt-1">
                          {range.subtitle}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Color level controls */}
              <div className="rounded-lg border border-white/10 bg-[#171a20] p-4">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm font-semibold">
                    Adjust Color Levels
                  </p>

                  <button
                    type="button"
                    onClick={handleResetRange}
                    disabled={isRangeCorrect}
                    className="rounded border border-white/20 px-3 py-1.5 text-xs hover:bg-white/10 disabled:opacity-40"
                  >
                    Reset Range
                  </button>
                </div>

                <div className="mb-4 rounded-lg border border-amber-400/30 bg-amber-500/10 p-3">
                  <p className="text-sm font-bold text-amber-300">
                    {activeRange.title} – {activeRange.subtitle}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-300">
                    {activeRange.instruction}
                  </p>
                </div>

                {RANGES.length > 0 && (
                  <div className="space-y-5">
                    {[
                      {
                        id: 'cyanRed' as const,
                        left: 'Cyan',
                        right: 'Red',
                      },
                      {
                        id: 'magentaGreen' as const,
                        left: 'Magenta',
                        right: 'Green',
                      },
                      {
                        id: 'yellowBlue' as const,
                        left: 'Yellow',
                        right: 'Blue',
                      },
                    ].map((channel) => {
                      const isTarget =
                        channel.id === activeRange.channel;

                      const value = values[activeRange.id][channel.id];

                      return (
                        <div
                          key={channel.id}
                          className={`space-y-2 ${
                            !isTarget ? 'opacity-45' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 text-xs">
                            <span className="font-medium text-slate-300">
                              {channel.left}
                            </span>

                            <span
                              className={`font-bold tabular-nums ${
                                isTarget
                                  ? 'text-amber-300'
                                  : 'text-slate-400'
                              }`}
                            >
                              {value > 0 ? '+' : ''}
                              {value.toFixed(1)}
                            </span>

                            <span className="font-medium text-slate-300">
                              {channel.right}
                            </span>
                          </div>

                          <input
                            type="range"
                            min={-100}
                            max={100}
                            step={1}
                            value={value}
                            disabled={!isTarget || isRangeCorrect}
                            onChange={(event) => {
                              if (isTarget) {
                                handleSliderChange(
                                  Number(event.target.value)
                                );
                              }
                            }}
                            className={`h-2 w-full cursor-pointer accent-amber-400 ${
                              !isTarget || isRangeCorrect
                                ? 'cursor-not-allowed'
                                : ''
                            }`}
                          />

                          <div className="flex justify-between text-[10px] text-slate-500">
                            <span>-100</span>
                            <span>0</span>
                            <span>+100</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="mt-5 space-y-3 border-t border-white/10 pt-4">
                  <label className="flex items-center gap-2 text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={preserveLuminosity}
                      onChange={(event) =>
                        setPreserveLuminosity(event.target.checked)
                      }
                      className="accent-amber-400"
                    />
                    Preserve Luminosity
                  </label>

                  <label className="flex items-center gap-2 text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={preview}
                      onChange={(event) =>
                        setPreview(event.target.checked)
                      }
                      className="accent-amber-400"
                    />
                    Preview
                  </label>
                </div>
              </div>

              {/* Success feedback */}
              {isRangeCorrect && (
                <div
                  role="status"
                  className="space-y-3 rounded-lg border border-emerald-500/50 bg-emerald-500/10 p-4"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl text-emerald-400">
                      ✓
                    </span>
                    <p className="font-bold text-emerald-400">
                      Điều chỉnh thành công!
                    </p>
                  </div>

                  <p className="text-sm text-slate-200">
                    {balanceFeedback}
                  </p>

                  <button
                    type="button"
                    onClick={handleConfirmRange}
                    className="w-full rounded-lg bg-emerald-600 py-3 font-bold text-white hover:bg-emerald-500"
                  >
                    OK – Xác nhận và tiếp tục
                  </button>
                </div>
              )}

              {!isRangeCorrect && (
                <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-xs text-slate-400">
                  Hãy điều chỉnh đúng thanh màu được yêu cầu.
                  Khi đạt mốc, hệ thống sẽ xác nhận và mở nút OK.
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setStage('colors-menu');
                    setBalanceFeedback('');
                  }}
                  className="rounded border border-white/20 px-5 py-2 text-sm hover:bg-white/10"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* COMPLETED */}
          {stage === 'completed' && (
            <div className="space-y-5 text-center">
              <div className="text-6xl">🏆</div>

              <h3 className="text-3xl font-bold text-emerald-400">
                CHÚC MỪNG!
              </h3>

              <p className="text-lg font-semibold">
                Bạn đã hoàn thành nhiệm vụ Color Balance!
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <img
                    src={originalImage}
                    alt="Ảnh gốc"
                    className="aspect-[3/2] w-full rounded-lg object-cover"
                  />
                  <p className="mt-2 text-xs text-slate-300">
                    Ảnh gốc
                  </p>
                </div>

                <div>
                  <img
                    src={finalImage}
                    alt="Ảnh kết quả"
                    className="aspect-[3/2] w-full rounded-lg object-cover"
                  />
                  <p className="mt-2 text-xs text-emerald-400">
                    Ảnh kết quả
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
                <p className="font-bold">
                  Bạn đã hoàn thành cả ba vùng màu:
                </p>
                <p className="mt-2">
                  Shadows ✓ · Midtones ✓ · Highlights ✓
                </p>
              </div>

              <button
                type="button"
                onClick={closeMission}
                className="w-full rounded-lg bg-emerald-600 py-3 font-bold hover:bg-emerald-500"
              >
                HOÀN TẤT NHIỆM VỤ
              </button>
            </div>
          )}
        </main>

        <footer className="border-t border-white/10 px-4 py-3 text-center text-xs text-slate-500">
          NCT GIMP Learning Lab – Mô phỏng giáo dục
        </footer>

        {/* EXIT CONFIRMATION */}
        {exitConfirm && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 p-4">
            <div className="w-full max-w-sm rounded-xl border border-white/10 bg-[#29313e] p-5">
              <h3 className="mb-2 text-lg font-bold text-amber-300">
                Thoát nhiệm vụ?
              </h3>

              <p className="mb-5 text-sm text-slate-300">
                Tiến trình hiện tại sẽ không được ghi nhận hoàn thành.
                Bạn có chắc muốn thoát không?
              </p>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setExitConfirm(false)}
                  className="min-h-11 flex-1 rounded bg-white/10 py-2 text-sm hover:bg-white/20"
                >
                  Tiếp tục học
                </button>

                <button
                  type="button"
                  onClick={closeMission}
                  className="min-h-11 flex-1 rounded bg-red-600 py-2 text-sm font-semibold hover:bg-red-500"
                >
                  Thoát
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
