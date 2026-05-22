export function generateMockCoverLetter(fileName: string, jobText: string): string {
  const baseName = fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
  const candidateName = baseName.split(' ')[0] || 'Кандидат';

  const companies = [
    'Яндекс',
    'Сбер',
    'Тинькофф',
    'VK',
    'Ozon',
    'Avito',
    'Alfa Bank',
    'Kaspi',
    'Vercel',
  ];
  let company = 'Ваша компания';

  for (const c of companies) {
    if (jobText.toLowerCase().includes(c.toLowerCase())) {
      company = c;
      break;
    }
  }

  const jobTitles = [
    'Frontend Developer',
    'Backend Developer',
    'Fullstack Developer',
    'React Developer',
    'Software Engineer',
    'UI/UX Designer',
    'Product Manager',
    'DevOps Engineer',
    'QA Automation',
  ];
  let jobTitle = 'Разработчик';

  for (const t of jobTitles) {
    if (jobText.toLowerCase().includes(t.toLowerCase())) {
      jobTitle = t;
      break;
    }
  }

  const skills = [
    'React',
    'TypeScript',
    'Next.js',
    'Node.js',
    'Tailwind CSS',
    'Vue.js',
    'Python',
    'Go',
    'Docker',
    'PostgreSQL',
    'GraphQL',
    'Prisma',
  ];
  const matchedSkills: string[] = [];

  for (const s of skills) {
    if (jobText.toLowerCase().includes(s.toLowerCase())) {
      matchedSkills.push(s);
    }
  }

  if (matchedSkills.length === 0) {
    matchedSkills.push('современные веб-технологии', 'TypeScript', 'React');
  }

  const skillString = matchedSkills.join(', ');

  return `Уважаемая команда найма ${company},

С большим интересом ознакомился с вашей вакансией на позицию ${jobTitle}. Мой профессиональный опыт и технологический стек отлично соответствуют требованиям, которые вы предъявляете к кандидатам.

Внимательно изучив описание вакансии, я заметил, что ключевыми задачами являются проектирование масштабируемой архитектуры приложений и тесное взаимодействие с продуктовой командой. За время работы я накопил солидный опыт в разработке сложных систем с использованием ${skillString}, что позволяет мне быстро вливаться в процессы и приносить ценность продукту с первых дней.

Мой подход к работе строится на принципах чистого кода, строгой типизации и внимания к деталям интерфейса, что перекликается с высокими стандартами инженерии в ${company}. Я стремлюсь создавать не просто рабочие решения, а производительные системы, которые легко поддерживать и масштабировать. Загруженный файл моего резюме содержит более подробную информацию о моих реализованных кейсах и архитектурных решениях.

Буду очень рад возможности обсудить, как мои навыки разработки и инженерный подход помогут в решении амбициозных задач вашей команды на детальном техническом интервью. Спасибо за ваше время и внимание.

С уважением,
${candidateName}`;
}
