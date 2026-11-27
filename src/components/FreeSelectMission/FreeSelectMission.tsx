
import { useState } from 'react';
import originalImage from '@/assets/free-select/FS_Practice_01.webp';
import finalImage from '@/assets/free-select/FS_Practice_01_Final.webp';

interface FreeSelectMissionProps {
  onClose: () => void;
}

type Stage =
  | 'intro'
  | 'file-menu'
  | 'open-dialog'
  | 'tool-menu'
  | 'selection'
  | 'colors-menu'
  | 'master'
  | 'adjust'
  | 'result'
  | 'export'
  | 'completed';

const POINTS = [
  { x: 69, y: 37 },
  { x: 76, y: 39 },
  { x: 82, y: 44 },
  { x: 84, y: 51 },
  { x: 82, y: 55 },
  { x: 76, y: 59 },
  { x: 68, y: 60 },
  { x: 61, y: 58 },
  { x: 56, y: 53 },
  { x: 55, y: 48 },
  { x: 58, y: 43 },
  { x: 63, y: 39 },
];

const TASKS = [
  {
    name: 'Hue',
    vietnamese: 'Sắc độ',
    target: 84.6,
    min: -180,
    max: 180,
    description: 'Thay đổi sắc đỏ của quả táo thành sắc xanh.',
  },
  {
    name: 'Saturation',
    vietnamese: 'Độ bão hòa',
    target: 38.4,
    min: -100,
    max: 100,
    description: 'Điều chỉnh độ rực rỡ của màu xanh.',
  },
  {
    name: 'Lightness',
    vietnamese: 'Độ sáng',
    target: 19.9,
    min: -100,
    max: 100,
    description: 'Điều chỉnh độ sáng để hoàn thiện màu quả táo.',
  },
] as const;

const FILE_ITEMS = [
  'New...',
  'Create',
  'Open...',
  'Open as Layers...',
  'Save',
  'Export As...',
];

const TOOL_ITEMS = [
  'Move Tool',
  'Zoom Tool',
  'Crop Tool',
  'Free Select Tool',
  'Rectangle Select Tool',
  'Ellipse Select Tool',
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

const formatNumber = (value: number) =>
  Number(value).toFixed(1);

export function FreeSelectMission({
  onClose,
}: FreeSelectMissionProps) {
  const [stage, setStage] = useState<Stage>('intro');
  const [feedback, setFeedback] = useState('');
  const [selectedImage, setSelectedImage] = useState(false);
  const [pointIndex, setPointIndex] = useState(0);
  const [selectionComplete, setSelectionComplete] = useState(false);
  const [taskIndex, setTaskIndex] = useState(0);
  const [values, setValues] = useState([0, 0, 0]);
  const [fileName, setFileName] = useState('');
  const [exported, setExported] = useState(false);
  const [exitConfirm, setExitConfirm] = useState(false);

  const task = TASKS[taskIndex];
  const currentValue = values[taskIndex];
  const isCorrect =
    !!task && Math.abs(currentValue - task.target) <= 0.5;

  const progress = {
    intro: 0,
    'file-menu': 8,
    'open-dialog': 16,
    'tool-menu': 25,
    selection: 40 + (pointIndex / POINTS.length) * 15,
    'colors-menu': 60,
    master: 66,
    adjust: 70 + taskIndex * 8,
    result: 95,
    export: 97,
    completed: 100,
  }[stage];

  const chooseFileMenu = (item: string) => {
    setFeedback('');
    if (item === 'Open...') {
      setStage('open-dialog');
    } else {
      setFeedback('Chưa chính xác! Hãy chọn File → Open...');
    }
  };

  const chooseTool = (item: string) => {
    setFeedback('');
    if (item === 'Free Select Tool') {
      setStage('selection');
    } else {
      setFeedback('Chưa đúng công cụ. Hãy chọn Free Select Tool (thòng lọng).');
    }
  };

  const chooseColorMenu = (item: string) => {
    setFeedback('');
    if (item === 'Hue-Saturation...') {
      setStage('master');
    } else {
      setFeedback('Chưa chính xác! Hãy chọn Colors → Hue-Saturation...');
    }
  };

  const handlePoint = (index: number) => {
    if (selectionComplete) return;

    if (index === pointIndex) {
      if (pointIndex === POINTS.length - 1) {
        setPointIndex(POINTS.length);
        setSelectionComplete(true);
        setFeedback('Đã khép kín vùng chọn! Bạn đã khoanh đúng quả táo.');
      } else {
        setPointIndex((previous) => previous + 1);
        setFeedback('');
      }
    } else {
      setPointIndex(0);
      setFeedback('Sai thứ tự điểm! Đường chọn đã được đặt lại. Hãy bắt đầu từ điểm số 1.');
    }
  };

  const updateSlider = (value: number) => {
    if (!task || isCorrect) return;
    setValues((previous) =>
      previous.map((v, index) => index === taskIndex ? value : v)
    );
    setFeedback('');
  };

  const confirmTask = () => {
    if (!isCorrect) return;

    if (taskIndex < TASKS.length - 1) {
      setTaskIndex((previous) => previous + 1);
      setFeedback('');
    } else {
      setStage('result');
      setFeedback('');
    }
  };

  const validFileName =
    /^BAI26_[A-Z0-9]+_[0-9]+_NVA\.png$/i.test(fileName.trim());

  const progressBar = (
    <div className="px-4 pt-4">
      <div className="mb-2 flex justify-between text-xs text-slate-300">
        <span>TIẾN TRÌNH NHIỆM VỤ</span>
        <span>
          {stage === 'completed' ? 'HOÀN THÀNH' : `${Math.round(progress)}%`}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );

  const renderMenu = (
    items: string[],
    correct: string,
    onChoose: (item: string) => void
  ) => (
    <div className="rounded-lg border border-white/10 bg-[#171a20] p-3">
      <div className="mb-3 border-b border-white/10 pb-2 font-bold text-blue-300">
        {stage === 'colors-menu' ? 'Colors' : stage === 'tool-menu' ? 'Tools' : 'File'}
      </div>
      {items.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onChoose(item)}
          className={`w-full rounded px-3 py-3 text-left text-sm hover:bg-white/10 ${
            item === correct ? 'text-amber-300' : 'text-slate-300'
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
              Free Select – Emerald Apple Mission
            </h2>
            <p className="text-xs text-slate-300">NCT GIMP Learning Lab</p>
          </div>
          <button
            type="button"
            onClick={() => setExitConfirm(true)}
            aria-label="Thoát nhiệm vụ"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-2xl hover:bg-red-500/30"
          >
            ×
          </button>
        </header>

        {progressBar}

        <main className="max-h-[72vh] overflow-y-auto p-4 sm:p-6">

          {/* INTRO */}
          {stage === 'intro' && (
            <div className="space-y-5">
              <h3 className="text-center text-2xl font-bold text-amber-300">
                NHIỆM VỤ: BIẾN MỘT QUẢ TÁO THÀNH XANH LỤC BẢO
              </h3>

              <img
                src={originalImage}
                alt="Giỏ táo ban đầu"
                className="mx-auto max-h-80 w-full rounded-lg bg-white object-contain"
              />

              <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm leading-relaxed text-slate-200">
                <p className="mb-2 font-bold text-amber-300">
                  Yêu cầu thực hành
                </p>
                Sử dụng Free Select để khoanh vùng một quả táo ở phía trước,
                bên phải giỏ. Sau đó sử dụng Hue-Saturation để thay đổi
                màu riêng quả táo đó. Giữ nguyên những quả táo còn lại,
                chiếc giỏ và nền ảnh.
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
                Trên thanh bảng chọn, nhấn File → Open...
              </p>
              {renderMenu(FILE_ITEMS, 'Open...', chooseFileMenu)}
            </div>
          )}

          {/* OPEN IMAGE */}
          {stage === 'open-dialog' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-amber-300">
                Bước 2. Chọn ảnh giỏ táo
              </h3>
              <div className="rounded-lg border border-white/10 bg-[#171a20] p-4">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedImage(true);
                    setFeedback('');
                  }}
                  className={`w-full rounded-lg border-2 p-3 ${
                    selectedImage
                      ? 'border-amber-400 bg-amber-500/10'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={originalImage}
                      alt="Ảnh giỏ táo"
                      className="h-24 w-24 rounded bg-white object-contain"
                    />
                    <div className="flex-1 text-left">
                      <p className="break-all text-sm font-bold">
                        FS_Practice_01.webp
                      </p>
                      <p className="text-xs text-slate-400">
                        Ảnh thực hành Free Select
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
                        setFeedback('Hãy chọn ảnh giỏ táo trước khi nhấn Open.');
                        return;
                      }
                      setFeedback('');
                      setStage('tool-menu');
                    }}
                    className="rounded bg-blue-600 px-6 py-2 text-sm font-semibold hover:bg-blue-500"
                  >
                    Open
                  </button>
                </div>
              </div>
              {feedback && <p role="alert" className="text-sm text-red-300">{feedback}</p>}
            </div>
          )}

          {/* FREE SELECT TOOL */}
          {stage === 'tool-menu' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-amber-300">
                Bước 3. Chọn Free Select Tool
              </h3>
              <p className="text-sm text-slate-300">
                Trên Toolbox, chọn biểu tượng thòng lọng Free Select.
              </p>
              {renderMenu(TOOL_ITEMS, 'Free Select Tool', chooseTool)}
              {feedback && <p role="alert" className="rounded bg-red-500/10 p-3 text-sm text-red-300">{feedback}</p>}
            </div>
          )}

          {/* POLYGON SELECTION */}
          {stage === 'selection' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-amber-300">
                Bước 4. Khoanh vùng quả táo
              </h3>
              <p className="text-sm text-slate-300">
                Chạm lần lượt các điểm từ 1 đến {POINTS.length} để nối đường
                bao quanh quả táo phía trước bên phải. Điểm cuối sẽ khép kín vùng chọn.
              </p>

              <div className="relative mx-auto w-full max-w-[560px] overflow-hidden rounded-lg bg-white">
                <img
                  src={originalImage}
                  alt="Giỏ táo cần khoanh vùng"
                  className="block aspect-square w-full object-contain"
                />

                <svg
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  className="pointer-events-none absolute inset-0 h-full w-full"
                >
                  {pointIndex > 1 && (
                    <polyline
                      points={POINTS.slice(0, pointIndex)
                        .map((p) => `${p.x},${p.y}`)
                        .join(' ')}
                      fill="none"
                      stroke="#16a34a"
                      strokeWidth="0.7"
                      strokeLinejoin="round"
                    />
                  )}
                  {selectionComplete && (
                    <polygon
                      points={POINTS.map((p) => `${p.x},${p.y}`).join(' ')}
                      fill="#22c55e"
                      fillOpacity="0.12"
                      stroke="#16a34a"
                      strokeWidth="0.8"
                    />
                  )}
                </svg>

                {POINTS.map((point, index) => (
                  <button
                    key={index}
                    type="button"
                    disabled={selectionComplete || index < pointIndex}
                    onClick={() => handlePoint(index)}
                    aria-label={`Điểm ${index + 1}`}
                    style={{
                      left: `${point.x}%`,
                      top: `${point.y}%`,
                    }}
                    className={`absolute z-10 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 text-xs font-bold shadow ${
                      index < pointIndex || selectionComplete
                        ? 'border-white bg-emerald-600 text-white'
                        : index === pointIndex
                          ? 'scale-110 border-white bg-amber-400 text-black'
                          : 'border-white bg-slate-700 text-white'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <div className="rounded-lg bg-white/5 p-3 text-sm">
                <div className="flex justify-between">
                  <span>Điểm đã nối</span>
                  <span className="font-bold text-amber-300">
                    {pointIndex}/{POINTS.length}
                  </span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${pointIndex / POINTS.length * 100}%` }}
                  />
                </div>
              </div>

              {feedback && (
                <p role="status" className={`rounded-lg p-3 text-sm ${
                  selectionComplete
                    ? 'bg-emerald-500/10 text-emerald-300'
                    : 'bg-red-500/10 text-red-300'
                }`}>
                  {feedback}
                </p>
              )}

              {selectionComplete && (
                <button
                  type="button"
                  onClick={() => {
                    setStage('colors-menu');
                    setFeedback('');
                  }}
                  className="w-full rounded-lg bg-emerald-600 py-3 font-bold hover:bg-emerald-500"
                >
                  OK – Xác nhận vùng chọn
                </button>
              )}

              {!selectionComplete && pointIndex > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setPointIndex(0);
                    setFeedback('Đã xóa đường chọn. Hãy khoanh lại từ đầu.');
                  }}
                  className="rounded border border-white/20 px-4 py-2 text-sm"
                >
                  Làm lại vùng chọn
                </button>
              )}
            </div>
          )}

          {/* COLORS MENU */}
          {stage === 'colors-menu' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-amber-300">
                Bước 5. Mở Hue-Saturation
              </h3>
              <p className="text-sm text-slate-300">
                Trên thanh bảng chọn, nhấn Colors → Hue-Saturation...
              </p>
              {renderMenu(COLOR_ITEMS, 'Hue-Saturation...', chooseColorMenu)}
              {feedback && <p role="alert" className="rounded bg-red-500/10 p-3 text-sm text-red-300">{feedback}</p>}
            </div>
          )}

          {/* MASTER */}
          {stage === 'master' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-amber-300">
                Bước 6. Chọn Master
              </h3>
              <p className="text-sm text-slate-300">
                Trong hộp thoại Hue-Saturation, chọn Master để điều chỉnh
                màu sắc của vùng ảnh đã khoanh chọn.
              </p>
              <div className="rounded-lg border border-white/10 bg-[#292929] p-5">
                <div className="mb-4 text-center font-bold">
                  Hue-Saturation
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFeedback('');
                    setStage('adjust');
                  }}
                  className="mx-auto flex items-center gap-3 rounded-lg border-2 border-amber-400 bg-amber-500/10 px-8 py-4"
                >
                  <span className="h-5 w-5 rounded-full border-4 border-amber-400" />
                  <span className="font-bold text-amber-300">Master</span>
                </button>
                <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs text-slate-400">
                  <span>Red</span>
                  <span>Green</span>
                  <span>Blue</span>
                </div>
              </div>
              {feedback && <p role="alert" className="text-sm text-red-300">{feedback}</p>}
            </div>
          )}

          {/* HUE SATURATION LIGHTNESS */}
          {stage === 'adjust' && task && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-amber-300">
                  Điều chỉnh {task.name}
                </h3>
                <span className="rounded bg-blue-500/20 px-3 py-1 text-xs text-blue-300">
                  {taskIndex + 1}/3
                </span>
              </div>

              <div className="rounded-lg border border-white/10 bg-[#292929] p-4">
                <div className="mb-4 flex justify-between font-bold">
                  <span>Hue-Saturation</span>
                  <span className="text-amber-300">Master ✓</span>
                </div>

                <p className="mb-4 rounded bg-amber-500/10 p-3 text-sm text-slate-200">
                  <strong className="text-amber-300">
                    {task.name} – {task.vietnamese}
                  </strong>
                  <br />
                  {task.description}
                </p>

                <div className="space-y-4">
                  {TASKS.map((item, index) => (
                    <div
                      key={item.name}
                      className={`rounded-lg border p-3 ${
                        index === taskIndex
                          ? 'border-amber-400/50'
                          : 'border-white/10 opacity-40'
                      }`}
                    >
                      <div className="mb-2 flex justify-between text-sm">
                        <span className="font-semibold">{item.name}</span>
                        <span className="tabular-nums">
                          {formatNumber(values[index])}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={item.min}
                        max={item.max}
                        step={0.1}
                        value={values[index]}
                        disabled={index !== taskIndex || isCorrect}
                        onChange={(event) =>
                          updateSlider(Number(event.target.value))
                        }
                        className="w-full accent-amber-400 disabled:cursor-not-allowed"
                      />
                      <div className="flex justify-between text-[10px] text-slate-500">
                        <span>{item.min}</span>
                        <span>0</span>
                        <span>+{item.max}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  disabled={isCorrect}
                  onClick={() => {
                    setValues((previous) =>
                      previous.map((value, index) =>
                        index === taskIndex ? 0 : value
                      )
                    );
                    setFeedback('');
                  }}
                  className="mt-4 rounded border border-white/20 px-4 py-2 text-xs disabled:opacity-40"
                >
                  Reset Color
                </button>
              </div>

              {isCorrect ? (
                <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-4">
                  <p className="font-bold text-emerald-400">
                    ✓ {task.name} chính xác!
                  </p>
                  <p className="mt-1 text-sm text-slate-200">
                    Hãy nhấn OK để xác nhận và tiếp tục.
                  </p>
                  <button
                    type="button"
                    onClick={confirmTask}
                    className="mt-3 w-full rounded-lg bg-emerald-600 py-3 font-bold hover:bg-emerald-500"
                  >
                    OK – Tiếp tục
                  </button>
                </div>
              ) : (
                <p className="rounded bg-white/5 p-3 text-xs text-slate-400">
                  Hãy kéo thanh trượt đến đúng mốc đáp án.
                  Khi đạt yêu cầu, nút OK sẽ xuất hiện.
                </p>
              )}
            </div>
          )}

          {/* FINAL IMAGE */}
          {stage === 'result' && (
            <div className="space-y-4 text-center">
              <h3 className="text-2xl font-bold text-emerald-400">
                ĐÃ HOÀN THÀNH CHỈNH SỬA MÀU!
              </h3>
              <img
                src={finalImage}
                alt="Giỏ táo với một quả táo màu xanh"
                className="mx-auto max-h-96 w-full rounded-lg bg-white object-contain"
              />
              <p className="text-sm text-slate-300">
                Chỉ quả táo đã chọn được thay đổi màu. Các phần còn lại
                của hình ảnh được giữ nguyên.
              </p>
              <button
                type="button"
                onClick={() => {
                  setFeedback('');
                  setStage('export');
                }}
                className="w-full rounded-lg bg-emerald-600 py-3 font-bold hover:bg-emerald-500"
              >
                OK – Tiếp tục Export As
              </button>
            </div>
          )}

          {/* EXPORT */}
          {stage === 'export' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-amber-300">
                Bước 7. File → Export As
              </h3>
              <p className="text-sm text-slate-300">
                Nhập tên file theo đúng cấu trúc:
              </p>
              <div className="rounded-lg bg-white/5 p-4">
                <code className="break-all text-emerald-300">
                  BAI26_LOP_STT_NVA.png
                </code>
                <p className="mt-2 text-xs text-slate-400">
                  Ví dụ: BAI26_12A1_05_NVA.png
                </p>
              </div>

              <label className="block text-sm font-semibold">
                Tên file xuất:
                <input
                  type="text"
                  value={fileName}
                  onChange={(event) => {
                    setFileName(event.target.value);
                    setExported(false);
                    setFeedback('');
                  }}
                  placeholder="BAI26_12A1_05_NVA.png"
                  className="mt-2 w-full rounded-lg border border-white/20 bg-[#171a20] px-3 py-3 text-white outline-none focus:border-amber-400"
                />
              </label>

              <p className="text-xs text-slate-400">
                Quy tắc: BAI26 + Lớp + Số thứ tự + NVA + đuôi .png.
              </p>

              {fileName.trim() && !validFileName && (
                <p role="alert" className="rounded bg-red-500/10 p-3 text-sm text-red-300">
                  ✕ Tên file chưa đúng cấu trúc. Hãy kiểm tra lại.
                </p>
              )}

              {validFileName && (
                <p className="rounded bg-emerald-500/10 p-3 text-sm text-emerald-300">
                  ✓ Tên file hợp lệ!
                </p>
              )}

              {validFileName && !exported && (
                <a
                  href={finalImage}
                  download={fileName.trim()}
                  onClick={() => setExported(true)}
                  className="block w-full rounded-lg bg-blue-600 py-3 text-center font-bold text-white hover:bg-blue-500"
                >
                  EXPORT AS – TẢI ẢNH
                </a>
              )}

              {exported && (
                <div className="space-y-3 rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-4">
                  <p className="font-bold text-emerald-400">
                    ✓ Đã hoàn tất thao tác Export As!
                  </p>
                  <p className="break-all text-sm text-slate-200">
                    {fileName}
                  </p>
                  <button
                    type="button"
                    onClick={() => setStage('completed')}
                    className="w-full rounded-lg bg-emerald-600 py-3 font-bold"
                  >
                    XÁC NHẬN HOÀN THÀNH
                  </button>
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
                Bạn đã hoàn thành Free Select Mission!
              </p>
              <img
                src={finalImage}
                alt="Sản phẩm hoàn thành"
                className="mx-auto max-h-80 rounded-lg bg-white object-contain"
              />
              <div className="rounded-lg bg-emerald-500/10 p-4 text-sm text-emerald-300">
                Free Select ✓ · Hue-Saturation ✓ · Export As ✓
                <p className="mt-2 break-all font-semibold">{fileName}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-lg bg-emerald-600 py-3 font-bold hover:bg-emerald-500"
              >
                HOÀN TẤT
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
                Bạn có chắc muốn thoát khỏi bài thực hành này?
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
