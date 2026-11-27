
import { useState } from 'react';
import originalImage from '@/assets/hue-saturation/HS_Practice_01.webp';
import finalImage from '@/assets/hue-saturation/HS_Practice_01_Final.webp';

interface HueSaturationMissionProps {
  onClose: () => void;
  onComplete?: () => void;
}

type Stage =
  | 'intro'
  | 'file-menu'
  | 'open-dialog'
  | 'colors-menu'
  | 'select-blue'
  | 'adjust'
  | 'completed';

const TASKS = [
  {
    id: 'hue',
    name: 'Hue',
    vietnamese: 'Sắc độ',
    target: 150,
    min: -180,
    max: 180,
    instruction: 'Điều chỉnh sắc độ để chuyển áo xanh thành màu cam.',
  },
  {
    id: 'saturation',
    name: 'Saturation',
    vietnamese: 'Độ bão hòa',
    target: 15,
    min: -100,
    max: 100,
    instruction: 'Điều chỉnh độ bão hòa để màu áo cam trở nên rực rỡ.',
  },
  {
    id: 'lightness',
    name: 'Lightness',
    vietnamese: 'Độ sáng',
    target: 5,
    min: -100,
    max: 100,
    instruction: 'Điều chỉnh độ sáng để hoàn thiện màu áo.',
  },
] as const;

const FILE_ITEMS = [
  'New...',
  'Create',
  'Open...',
  'Open as Layers...',
  'Save',
];

const COLOR_ITEMS = [
  'Color Balance...',
  'Hue-Chroma...',
  'Hue-Saturation...',
  'Saturation...',
  'Brightness-Contrast...',
  'Levels...',
  'Curves...',
];

export function HueSaturationMission({
  onClose,
  onComplete,
}: HueSaturationMissionProps) {
  const [stage, setStage] = useState<Stage>('intro');
  const [feedback, setFeedback] = useState('');
  const [selectedImage, setSelectedImage] = useState(false);
  const [selectedBlue, setSelectedBlue] = useState(false);
  const [exitConfirm, setExitConfirm] = useState(false);

  const [taskIndex, setTaskIndex] = useState(0);
  const [values, setValues] = useState([0, 0, 0]);
  const [completed, setCompleted] = useState(false);

  const task = TASKS[taskIndex];
  const currentValue = values[taskIndex];
  const isCorrect = !!task && currentValue === task.target;

  const progress = completed
    ? 100
    : stage === 'adjust'
      ? 60 + taskIndex * 12
      : stage === 'select-blue'
        ? 55
        : stage === 'colors-menu'
          ? 45
          : stage === 'open-dialog'
            ? 30
            : stage === 'file-menu'
              ? 15
              : 5;

  const chooseFile = (item: string) => {
    setFeedback('');

    if (item === 'Open...') {
      setSelectedImage(false);
      setStage('open-dialog');
    } else {
      setFeedback(`Chưa chính xác! Hãy chọn File → Open...`);
    }
  };

  const chooseColor = (item: string) => {
    setFeedback('');

    if (item === 'Hue-Saturation...') {
      setStage('select-blue');
    } else {
      setFeedback('Chưa chính xác! Hãy chọn Hue-Saturation...');
    }
  };

  const updateSlider = (value: number) => {
    if (!task || isCorrect) return;

    setValues((previous) =>
      previous.map((v, i) => i === taskIndex ? value : v)
    );

    setFeedback('');
  };

  const confirmTask = () => {
    if (!isCorrect) return;

    if (taskIndex < 2) {
      setTaskIndex((previous) => previous + 1);
      setFeedback('');
    } else {
      setCompleted(true);
      setStage('completed');
      onComplete?.();
    }
  };

  const menuItems = (
    items: string[],
    correct: string,
    onChoose: (item: string) => void
  ) => (
    <div className="space-y-1">
      {items.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onChoose(item)}
          className={`w-full rounded px-3 py-3 text-left text-sm transition-colors ${
            item === correct
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
            <h2 className="text-lg font-bold">Hue–Saturation Mission</h2>
            <p className="text-xs text-slate-300">NCT GIMP Learning Lab</p>
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
            <span>{completed ? '3/3' : `${stage === 'adjust' ? taskIndex : 0}/3`} thông số</span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <main className="max-h-[72vh] overflow-y-auto p-4 sm:p-6">

          {/* INTRO */}
          {stage === 'intro' && (
            <div className="space-y-5">
              <h3 className="text-center text-2xl font-bold text-amber-300">
                NHIỆM VỤ: THAY ĐỔI MÀU SẮC ÁO
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <img
                    src={originalImage}
                    alt="Ảnh áo xanh ban đầu"
                    className="aspect-[3/4] w-full rounded-lg bg-white object-contain"
                  />
                  <p className="mt-2 text-center text-sm">Ảnh gốc – Áo xanh</p>
                </div>

                <div>
                  <img
                    src={finalImage}
                    alt="Ảnh áo cam kết quả"
                    className="aspect-[3/4] w-full rounded-lg bg-white object-contain"
                  />
                  <p className="mt-2 text-center text-sm text-emerald-400">
                    Ảnh đích – Áo cam
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <h4 className="mb-2 font-bold text-amber-300">
                  Kiến thức cần nhớ
                </h4>
                <p className="text-sm leading-relaxed text-slate-200">
                  Hue–Saturation là công cụ điều chỉnh sắc độ,
                  độ bão hòa và độ sáng của màu sắc trong ảnh.
                </p>
                <div className="mt-3 space-y-2 text-sm">
                  <p>• Hue: thay đổi sắc độ màu.</p>
                  <p>• Saturation: thay đổi độ rực rỡ.</p>
                  <p>• Lightness: thay đổi độ sáng.</p>
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
                Bước 1. File → Open
              </h3>
              <p className="text-sm text-slate-300">
                Trên thanh bảng chọn GIMP, chọn File → Open...
              </p>

              <div className="rounded-lg border border-white/10 bg-[#171a20] p-3">
                <div className="mb-3 border-b border-white/10 pb-3 font-bold text-blue-300">
                  File
                </div>
                {menuItems(FILE_ITEMS, 'Open...', chooseFile)}
              </div>

              {feedback && (
                <p role="alert" className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">
                  ✕ {feedback}
                </p>
              )}
            </div>
          )}

          {/* OPEN DIALOG */}
          {stage === 'open-dialog' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-amber-300">
                Bước 2. Chọn ảnh thực hành
              </h3>

              <div className="rounded-lg border border-white/10 bg-[#171a20] p-4">
                <button
                  type="button"
                  onClick={() => setSelectedImage(true)}
                  className={`w-full rounded-lg border-2 p-3 text-left ${
                    selectedImage
                      ? 'border-amber-400 bg-amber-500/10'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={originalImage}
                      alt="Ảnh thực hành"
                      className="h-24 w-20 rounded bg-white object-contain"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="break-all text-sm font-bold">
                        HS_Practice_01.webp
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Ảnh thực hành Hue–Saturation
                      </p>
                    </div>
                    {selectedImage ? '●' : '○'}
                  </div>
                </button>

                <div className="mt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setStage('file-menu')}
                    className="rounded border border-white/20 px-5 py-2 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!selectedImage) {
                        setFeedback('Hãy chọn ảnh thực hành trước khi nhấn Open.');
                        return;
                      }
                      setFeedback('');
                      setStage('colors-menu');
                    }}
                    className="rounded bg-blue-600 px-6 py-2 text-sm font-semibold hover:bg-blue-500"
                  >
                    Open
                  </button>
                </div>
              </div>

              {feedback && (
                <p role="alert" className="text-sm text-red-300">{feedback}</p>
              )}
            </div>
          )}

          {/* COLORS MENU */}
          {stage === 'colors-menu' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-amber-300">
                Bước 3. Colors → Hue-Saturation
              </h3>
              <p className="text-sm text-slate-300">
                Mở Colors và chọn Hue-Saturation...
              </p>

              <div className="rounded-lg border border-white/10 bg-[#171a20] p-3">
                <div className="mb-3 border-b border-white/10 pb-2 font-bold">
                  Colors
                </div>
                {menuItems(COLOR_ITEMS, 'Hue-Saturation...', chooseColor)}
              </div>

              {feedback && (
                <p role="alert" className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">
                  ✕ {feedback}
                </p>
              )}
            </div>
          )}

          {/* SELECT BLUE */}
          {stage === 'select-blue' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-amber-300">
                Bước 4. Chọn màu Blue (B)
              </h3>

              <p className="text-sm text-slate-300">
                Trong hộp thoại Hue-Saturation, chọn nhóm màu Blue (B)
                để thay đổi sắc độ áo xanh.
              </p>

              <div className="rounded-lg border border-white/10 bg-[#292929] p-4">
                <div className="mb-4 text-center font-bold">
                  Hue-Saturation
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { name: 'Red', color: '#ef4444' },
                    { name: 'Yellow', color: '#fde047' },
                    { name: 'Green', color: '#22c55e' },
                    { name: 'Cyan', color: '#22d3ee' },
                    { name: 'Blue', color: '#2563eb' },
                    { name: 'Magenta', color: '#d946ef' },
                  ].map((item) => (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => {
                        if (item.name === 'Blue') {
                          setSelectedBlue(true);
                          setStage('adjust');
                          setFeedback('');
                        } else {
                          setFeedback('Chưa chính xác! Hãy chọn Blue (B).');
                        }
                      }}
                      className={`rounded border border-white/20 p-3 text-sm font-semibold hover:bg-white/10 ${
                        item.name === 'Blue' ? 'text-blue-300' : 'text-white'
                      }`}
                    >
                      <span
                        className="mx-auto mb-2 block h-7 w-12 rounded"
                        style={{ background: item.color }}
                      />
                      {item.name}
                    </button>
                  ))}
                </div>

                <div className="mt-4 rounded bg-white/10 p-2 text-center text-xs text-slate-300">
                  Master · Red · Yellow · Green · Cyan · Blue · Magenta
                </div>
              </div>

              {feedback && (
                <p role="alert" className="rounded-lg bg-red-500/10 p-3 text-sm text-red-300">
                  ✕ {feedback}
                </p>
              )}
            </div>
          )}

          {/* ADJUSTMENT */}
          {stage === 'adjust' && task && selectedBlue && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-amber-300">
                    Bước 5. Điều chỉnh {task.name}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Hue-Saturation · Blue (B)
                  </p>
                </div>
                <span className="rounded bg-blue-500/20 px-3 py-1 text-xs text-blue-300">
                  {taskIndex + 1}/3
                </span>
              </div>

              <div className="rounded-lg border border-white/10 bg-[#171a20] p-3">
                <img
                  src={originalImage}
                  alt="Ảnh đang thực hành"
                  className="mx-auto max-h-64 w-auto rounded bg-white object-contain"
                />
              </div>

              <div className="rounded-lg border border-white/10 bg-[#292929] p-4">
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-bold">Hue-Saturation</span>
                  <span className="rounded bg-blue-600 px-2 py-1 text-xs">
                    Blue (B) ✓
                  </span>
                </div>

                <div className="mb-4 rounded bg-amber-500/10 p-3">
                  <p className="font-bold text-amber-300">
                    {task.name} – {task.vietnamese}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-300">
                    {task.instruction}
                  </p>
                </div>

                <div className="space-y-3">
                  {TASKS.map((item, index) => (
                    <div
                      key={item.id}
                      className={`rounded-lg border p-3 ${
                        index === taskIndex
                          ? 'border-amber-400/50 bg-amber-500/5'
                          : index < taskIndex
                            ? 'border-emerald-500/30 bg-emerald-500/5'
                            : 'border-white/10 opacity-40'
                      }`}
                    >
                      <div className="mb-2 flex justify-between text-sm">
                        <span className="font-semibold">
                          {item.name}
                        </span>
                        <span className="text-slate-300">
                          {values[index] > 0 ? '+' : ''}{values[index]}
                        </span>
                      </div>

                      <input
                        type="range"
                        min={item.min}
                        max={item.max}
                        step={1}
                        value={values[index]}
                        disabled={index !== taskIndex || isCorrect}
                        onChange={(event) =>
                          updateSlider(Number(event.target.value))
                        }
                        className="h-2 w-full cursor-pointer accent-amber-400 disabled:cursor-not-allowed"
                      />

                      <div className="mt-1 flex justify-between text-[10px] text-slate-500">
                        <span>{item.min}</span>
                        <span>0</span>
                        <span>+{item.max}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setValues((previous) =>
                      previous.map((value, index) =>
                        index === taskIndex ? 0 : value
                      )
                    );
                    setFeedback('');
                  }}
                  disabled={isCorrect}
                  className="mt-4 rounded border border-white/20 px-3 py-2 text-xs hover:bg-white/10 disabled:opacity-40"
                >
                  Reset
                </button>
              </div>

              {isCorrect ? (
                <div className="space-y-3 rounded-lg border border-emerald-500/50 bg-emerald-500/10 p-4">
                  <p className="font-bold text-emerald-400">
                    ✓ Điều chỉnh {task.name} thành công!
                  </p>
                  <p className="text-sm text-slate-200">
                    Bạn đã đạt đúng thông số yêu cầu.
                    Hãy nhấn OK để tiếp tục.
                  </p>
                  <button
                    type="button"
                    onClick={confirmTask}
                    className="w-full rounded-lg bg-emerald-600 py-3 font-bold hover:bg-emerald-500"
                  >
                    OK – Xác nhận và tiếp tục
                  </button>
                </div>
              ) : (
                <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-xs text-slate-400">
                  Hãy kéo thanh trượt đến đúng mốc yêu cầu.
                  Khi đạt đáp án, nút OK sẽ xuất hiện.
                </div>
              )}
            </div>
          )}

          {/* COMPLETED */}
          {stage === 'completed' && (
            <div className="space-y-5 text-center">
              <div className="text-6xl">🏆</div>
              <h3 className="text-3xl font-bold text-emerald-400">
                CHÚC MỪNG!
              </h3>
              <p className="font-semibold">
                Bạn đã hoàn thành nhiệm vụ Hue–Saturation!
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <img
                    src={originalImage}
                    alt="Ảnh áo xanh"
                    className="aspect-[3/4] w-full rounded-lg bg-white object-contain"
                  />
                  <p className="mt-2 text-sm">Ảnh gốc</p>
                </div>
                <div>
                  <img
                    src={finalImage}
                    alt="Ảnh áo cam"
                    className="aspect-[3/4] w-full rounded-lg bg-white object-contain"
                  />
                  <p className="mt-2 text-sm text-emerald-400">
                    Ảnh kết quả
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
                Hue ✓ · Saturation ✓ · Lightness ✓
              </div>

              <button
                type="button"
                onClick={onClose}
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
                Bạn có chắc muốn thoát?
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setExitConfirm(false)}
                  className="min-h-11 flex-1 rounded bg-white/10"
                >
                  Tiếp tục học
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="min-h-11 flex-1 rounded bg-red-600 font-semibold"
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
