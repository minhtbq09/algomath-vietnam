import type { Locale } from '@/algorithms/types';

export const LOCALES: Locale[] = ['vi', 'en'];
export const DEFAULT_LOCALE: Locale = 'vi';

/**
 * Mọi chuỗi giao diện nằm ở đây. Không viết chữ cứng trong component.
 * Muốn sửa một nhãn thì sửa đúng một chỗ, cả hai ngôn ngữ nằm cạnh nhau.
 */
const dict = {
  vi: {
    brand: 'AlgoMath Vietnam',
    tagline: 'Đưa tư duy Olympic Toán vào Khoa học Máy tính',
    nav: {
      map: 'Lộ trình',
      lessons: 'Bài học',
      viz: 'Mô phỏng',
      exercises: 'Bài tập',
      workshops: 'Workshop',
      impact: 'Kết quả',
      about: 'Về dự án',
    },
    home: {
      eyebrow: 'Dự án giáo dục phi lợi nhuận',
      heroLead:
        'Bạn đã biết quy nạp, đồng dư, tổ hợp và bất biến. Đó không phải là thứ khác với thuật toán, đó chính là thuật toán, chỉ chưa được viết ra thành các bước máy chạy được.',
      cta: 'Bắt đầu từ bài 1',
      ctaAlt: 'Xem lộ trình 20 bài',
      bridgeTitle: 'Ý tưởng Toán bạn đã có, thuật toán mà nó dẫn tới',
      bridgeNote:
        'Bấm vào một dòng để mở bài học tương ứng. Cột trái là thứ bạn đã học ở lớp chuyên. Cột phải là thứ mà nhiều người tưởng phải học lập trình mới hiểu được.',
      whyTitle: 'Học theo cách này thì khác gì?',
      statsNote: 'Số liệu sẽ được cập nhật sau mỗi workshop.',
    },
    lessons: {
      title: 'Hai mươi bài học',
      lead:
        'Mỗi bài đọc trong 10 đến 15 phút, đi theo cùng một mạch: một bài toán quen thuộc, ý tưởng Toán đằng sau nó, cách biến ý tưởng đó thành thuật toán, mô phỏng để nhìn tận mắt, rồi code và bài tập.',
      chapter: 'Chương',
      minutes: 'phút',
      prev: 'Bài trước',
      next: 'Bài sau',
      inThisLesson: 'Trong bài này',
      relatedViz: 'Mô phỏng của bài',
      relatedExercises: 'Bài tập của bài',
      draft: 'Bài này đang được viết',
      draftNote:
        'Nội dung sẽ được đăng theo tiến độ dự án. Bạn có thể học các bài đã hoàn thành trước.',
      fallbackNotice:
        'Bản tiếng Anh của bài này chưa hoàn thành, bạn đang đọc bản tiếng Việt.',
    },
    viz: {
      title: 'Mô phỏng tương tác',
      lead:
        'Mỗi mô phỏng chạy từng bước, dừng ở đâu cũng được, lùi lại được và luôn nói rõ bước đang diễn ra là gì. Dùng phím mũi tên trái phải để đi nhanh hơn.',
      openLesson: 'Đọc bài học',
      goal: 'Mục tiêu học tập',
    },
    exercises: {
      title: 'Kho bài tập',
      lead: 'Lọc theo chủ đề và độ khó. Mỗi bài có gợi ý trước, lời giải sau.',
      all: 'Tất cả',
      topic: 'Chủ đề',
      difficulty: 'Độ khó',
      easy: 'Cơ bản',
      medium: 'Trung bình',
      hard: 'Thử thách',
      showHint: 'Xem gợi ý',
      hideHint: 'Ẩn gợi ý',
      showSolution: 'Xem lời giải',
      hideSolution: 'Ẩn lời giải',
      hint: 'Gợi ý',
      solution: 'Lời giải tham khảo',
      empty: 'Không có bài nào khớp bộ lọc.',
      count: 'bài',
    },
    workshops: {
      title: 'Workshop',
      lead:
        'Ba buổi trực tiếp, mỗi buổi 75 đến 90 phút, có bài kiểm tra trước và sau để đo xem học sinh thực sự học được gì.',
      status: { planned: 'Sắp diễn ra', done: 'Đã tổ chức', open: 'Đang mở đăng ký' },
      agenda: 'Nội dung buổi học',
      materials: 'Tài liệu',
    },
    impact: {
      title: 'Kết quả và tác động',
      lead:
        'Trang này công bố số liệu thật, bao gồm cả những mục tiêu chưa đạt. Số liệu được cập nhật sau mỗi hoạt động.',
      pending: 'Chưa có dữ liệu',
      target: 'Mục tiêu',
      actual: 'Thực tế',
      evidence: 'Minh chứng',
      methodTitle: 'Cách đo',
      methodBody:
        'Học sinh làm bài kiểm tra trước và sau workshop. Hai bài được ghép với nhau bằng một mã ẩn danh in sẵn trên phiếu, ví dụ W1-042, chứ không hỏi họ tên. Nhờ vậy dự án tính được mức tiến bộ của từng em mà không lưu thông tin cá nhân nào.',
    },
    about: {
      title: 'Về dự án',
      team: 'Đội ngũ',
      advisors: 'Cố vấn',
      source: 'Mã nguồn',
      contact: 'Liên hệ',
    },
    footer: {
      free: 'Học liệu miễn phí, dùng lại được trong lớp học.',
      rights: 'Nội dung dùng cho mục đích giáo dục phi lợi nhuận.',
    },
    common: {
      readMore: 'Đọc tiếp',
      backToList: 'Về danh sách',
      switchLang: 'English',
      comingSoon: 'Sắp có',
    },
  },
  en: {
    brand: 'AlgoMath Vietnam',
    tagline: 'Bringing Olympiad thinking into computer science',
    nav: {
      map: 'Roadmap',
      lessons: 'Lessons',
      viz: 'Visualizations',
      exercises: 'Exercises',
      workshops: 'Workshops',
      impact: 'Impact',
      about: 'About',
    },
    home: {
      eyebrow: 'A non-profit education project',
      heroLead:
        'You already know induction, congruences, counting and invariants. Those are not a different subject from algorithms. They are algorithms, just not yet written as steps a machine can run.',
      cta: 'Start with lesson 1',
      ctaAlt: 'See the 20-lesson roadmap',
      bridgeTitle: 'The maths you have, and the algorithm it leads to',
      bridgeNote:
        'Tap a row to open the matching lesson. The left column is what you learn in a maths class. The right column is what most people assume requires programming first.',
      whyTitle: 'Why learn it this way?',
      statsNote: 'Figures are updated after each workshop.',
    },
    lessons: {
      title: 'Twenty lessons',
      lead:
        'Each lesson takes 10 to 15 minutes and follows the same path: a familiar problem, the mathematical idea behind it, how that idea becomes an algorithm, a simulation to watch it run, then code and exercises.',
      chapter: 'Chapter',
      minutes: 'min',
      prev: 'Previous',
      next: 'Next',
      inThisLesson: 'In this lesson',
      relatedViz: 'Simulation for this lesson',
      relatedExercises: 'Exercises for this lesson',
      draft: 'This lesson is being written',
      draftNote:
        'Lessons are published as the project progresses. The finished ones are ready to read now.',
      fallbackNotice:
        'The English version of this lesson is not finished yet, so you are reading the Vietnamese text.',
    },
    viz: {
      title: 'Interactive simulations',
      lead:
        'Every simulation runs step by step, pauses anywhere, steps backwards, and always says what the current step is doing. Use the left and right arrow keys to move faster.',
      openLesson: 'Read the lesson',
      goal: 'Learning goal',
    },
    exercises: {
      title: 'Exercise bank',
      lead: 'Filter by topic and difficulty. Every exercise has a hint first, a solution second.',
      all: 'All',
      topic: 'Topic',
      difficulty: 'Difficulty',
      easy: 'Basic',
      medium: 'Medium',
      hard: 'Challenge',
      showHint: 'Show hint',
      hideHint: 'Hide hint',
      showSolution: 'Show solution',
      hideSolution: 'Hide solution',
      hint: 'Hint',
      solution: 'Reference solution',
      empty: 'No exercise matches these filters.',
      count: 'exercises',
    },
    workshops: {
      title: 'Workshops',
      lead:
        'Three in-person sessions of 75 to 90 minutes, each with a pre-test and a post-test so we can tell what students actually learned.',
      status: { planned: 'Upcoming', done: 'Completed', open: 'Registration open' },
      agenda: 'Session plan',
      materials: 'Materials',
    },
    impact: {
      title: 'Results and impact',
      lead:
        'This page publishes real figures, including the targets that were missed. It is updated after each activity.',
      pending: 'No data yet',
      target: 'Target',
      actual: 'Actual',
      evidence: 'Evidence',
      methodTitle: 'How this is measured',
      methodBody:
        'Students take a test before and after each workshop. The two papers are matched by an anonymous code printed on the sheet, such as W1-042, rather than by name. That lets the project measure individual progress without storing any personal data.',
    },
    about: {
      title: 'About the project',
      team: 'Team',
      advisors: 'Advisors',
      source: 'Source code',
      contact: 'Contact',
    },
    footer: {
      free: 'Free to use and reuse in the classroom.',
      rights: 'Content is for non-profit educational use.',
    },
    common: {
      readMore: 'Read more',
      backToList: 'Back to list',
      switchLang: 'Tiếng Việt',
      comingSoon: 'Coming soon',
    },
  },
} as const;

export type Dictionary = (typeof dict)['vi'];

export function getDictionary(locale: Locale): Dictionary {
  return dict[locale] as Dictionary;
}

/**
 * Next.js đưa tham số route vào dưới dạng string. Hàm này thu hẹp nó về Locale
 * và trả về ngôn ngữ mặc định nếu gặp giá trị lạ, để không bao giờ vỡ trang.
 */
export function asLocale(value: string): Locale {
  return (LOCALES as string[]).includes(value) ? (value as Locale) : DEFAULT_LOCALE;
}
