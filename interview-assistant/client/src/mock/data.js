// Mock data for all frontend pages

export const mockUser = {
  id: 'user-001',
  email: 'demo@example.com',
  created_at: '2024-01-15T08:00:00Z',
}

export const mockSessions = [
  {
    id: 'session-001',
    user_id: 'user-001',
    job_title: '后端开发工程师',
    company: '字节跳动',
    status: 'completed',
    created_at: '2024-05-18T14:32:00Z',
    completed_at: '2024-05-18T15:00:00Z',
    question_count: 6,
    duration_minutes: 28,
    overall_score: 7.5,
  },
  {
    id: 'session-002',
    user_id: 'user-001',
    job_title: '产品经理',
    company: '腾讯科技',
    status: 'completed',
    created_at: '2024-05-16T19:10:00Z',
    completed_at: '2024-05-16T19:45:00Z',
    question_count: 8,
    duration_minutes: 35,
    overall_score: 8.0,
  },
  {
    id: 'session-003',
    user_id: 'user-001',
    job_title: '算法工程师',
    company: '阿里巴巴',
    status: 'active',
    created_at: '2024-05-15T10:45:00Z',
    completed_at: null,
    question_count: 6,
    duration_minutes: 26,
    overall_score: null,
  },
  {
    id: 'session-004',
    user_id: 'user-001',
    job_title: '前端开发工程师',
    company: '美团',
    status: 'completed',
    created_at: '2024-05-12T16:20:00Z',
    completed_at: '2024-05-12T16:42:00Z',
    question_count: 5,
    duration_minutes: 22,
    overall_score: 6.5,
  },
  {
    id: 'session-005',
    user_id: 'user-001',
    job_title: '数据分析师',
    company: '拼多多',
    status: 'completed',
    created_at: '2024-05-10T11:05:00Z',
    completed_at: '2024-05-10T11:29:00Z',
    question_count: 6,
    duration_minutes: 24,
    overall_score: 7.0,
  },
]

export const mockCurrentSession = {
  id: 'session-active',
  user_id: 'user-001',
  job_title: '后端开发工程师',
  company: '字节跳动',
  resume_text: '具有3年后端开发经验，熟悉Java/Go/Python，有微服务架构设计经验...',
  status: 'active',
  created_at: '2024-05-20T10:00:00Z',
  completed_at: null,
}

export const mockQuestions = [
  {
    id: 'q-001',
    session_id: 'session-active',
    content: '请做一下自我介绍。',
    question_type: 'behavioral',
    order_index: 1,
    created_at: '2024-05-20T10:00:10Z',
  },
  {
    id: 'q-002',
    session_id: 'session-active',
    content: '你认为你最大的优点是什么？',
    question_type: 'behavioral',
    order_index: 2,
    created_at: '2024-05-20T10:03:00Z',
  },
  {
    id: 'q-003',
    session_id: 'session-active',
    content: '请描述一次你在团队项目中遇到的重大挑战，你是如何分析问题、制定解决方案并最终推动解决的？',
    question_type: 'behavioral',
    order_index: 3,
    created_at: '2024-05-20T10:07:00Z',
  },
  {
    id: 'q-004',
    session_id: 'session-active',
    content: '你如何看待加班？',
    question_type: 'behavioral',
    order_index: 4,
    created_at: '2024-05-20T10:11:00Z',
  },
  {
    id: 'q-005',
    session_id: 'session-active',
    content: '你最希望我们公司有什么了解？',
    question_type: 'resume_based',
    order_index: 5,
    created_at: '2024-05-20T10:15:00Z',
  },
  {
    id: 'q-006',
    session_id: 'session-active',
    content: '你还有什么问题要问我们的吗？',
    question_type: 'behavioral',
    order_index: 6,
    created_at: '2024-05-20T10:19:00Z',
  },
]

export const mockAnswers = [
  {
    id: 'a-001',
    session_id: 'session-active',
    question_id: 'q-001',
    content: '介绍了教育背景、实习经历和核心技能、表达流畅...',
    input_type: 'text',
    score: 8,
    feedback_content: '自我介绍结构清晰，涵盖了教育背景、实习经历和核心技能。表达流畅，重点突出。',
    feedback_structure: '逻辑清晰，但缺少具体数字支撑（如项目规模、技术栈版本）。',
    feedback_improvement: '建议加入一个具体的成果数据，例如"优化了某服务响应时间30%"，让自我介绍更有说服力。',
    created_at: '2024-05-20T10:02:00Z',
  },
  {
    id: 'a-002',
    session_id: 'session-active',
    question_id: 'q-002',
    content: '优点包括了工具体、结合了具体事例，能够独立分析问题、思考逻辑...',
    input_type: 'text',
    score: 6,
    feedback_content: '回答了具体事例，能够独立分析问题、思考逻辑，展示出良好的自我认知能力。',
    feedback_structure: '基本符合 STAR 结构，但 Action 部分略显简单，可以更具体。',
    feedback_improvement: '建议在描述"优点"时，用1-2个具体项目案例佐证，而非仅说明特质本身。',
    created_at: '2024-05-20T10:05:00Z',
  },
]

export const mockFeedback = {
  score: 7,
  feedback_content: '回答能够抓住题眼，描述了主要挑战，但结果的量化表达不够具体，影响说服力。',
  feedback_structure: '基本符合 STAR 结构，但在 Task 和 Action 部分可以更细化，具体说明你的决策过程。',
  feedback_improvement: '建议补充更多背景数据（如团队规模、项目规模），量化结果（如提升了多少效率/用户数），开发你的领域竞争壁垒。',
}

export const mockReport = {
  id: 'report-001',
  session_id: 'session-001',
  overall_score: 7.5,
  overall_summary: '整体表现良好，思路清晰、表达流畅，展现了较强的专业能力和学习能力。在结构化表达和量化业务方面还有提升空间，继续练习将帮助你在真实面试中更加自信从容。',
  strengths: [
    '逻辑清晰，能够有条理地组织答案',
    '技术基础扎实，能够将项目经验与岗位匹配',
    '沟通表达自然，展现出良好的学习习惯',
    '具备团队协作意识，能从整体角度思考问题',
  ],
  improvements: [
    '在答案中多使用数据和案例来支撑结论',
    '进一步提升 STAR 结构的完整度',
    '减少口头禅和重复表达，提升语言简洁度',
    '对问题的边界和影响范围可以更充分',
  ],
  created_at: '2024-05-18T15:00:00Z',
}

export const mockReportItems = [
  {
    question: {
      id: 'q-001',
      content: '请做一下自我介绍。',
      question_type: 'behavioral',
      order_index: 1,
    },
    answer: {
      id: 'a-001',
      content: '介绍了教育背景、实习经历和核心技能、表达流畅…',
      input_type: 'text',
      score: 8,
      feedback_content: '自我介绍结构清晰，涵盖教育背景与核心技能。',
      feedback_structure: '逻辑清晰，但缺少具体数字支撑。',
      feedback_improvement: '建议加入一个具体的成果数据。',
    },
  },
  {
    question: {
      id: 'q-002',
      content: '你认为你最大的优点是什么？',
      question_type: 'behavioral',
      order_index: 2,
    },
    answer: {
      id: 'a-002',
      content: '优点包括了具体事例，能够独立分析问题、思考逻辑…',
      input_type: 'text',
      score: 6,
      feedback_content: '有具体事例支撑，展示良好自我认知。',
      feedback_structure: 'Action 部分略显简单，可以更具体。',
      feedback_improvement: '用 1-2 个具体项目案例佐证特质本身。',
    },
  },
  {
    question: {
      id: 'q-003',
      content: '请描述一次你在团队项目中遇到的重大挑战…',
      question_type: 'behavioral',
      order_index: 3,
    },
    answer: {
      id: 'a-003',
      content: '使用了 STAR 结构、案例具体，但结果量化不足…',
      input_type: 'text',
      score: 7,
      feedback_content: '场景描述清晰，解决方案有逻辑性。',
      feedback_structure: '基本符合 STAR 结构，Task 部分偏弱。',
      feedback_improvement: '量化最终结果（如节省时间 30%）。',
    },
  },
  {
    question: {
      id: 'q-004',
      content: '你如何看待加班？',
      question_type: 'behavioral',
      order_index: 4,
    },
    answer: {
      id: 'a-004',
      content: '观点积极，能从公司和个人两个角度思考…',
      input_type: 'text',
      score: 8,
      feedback_content: '回答积极务实，显示出职业成熟度。',
      feedback_structure: '条理清晰，立场明确。',
      feedback_improvement: '可补充如何高效工作以减少不必要加班。',
    },
  },
  {
    question: {
      id: 'q-005',
      content: '你最希望我们公司有什么了解？',
      question_type: 'resume_based',
      order_index: 5,
    },
    answer: {
      id: 'a-005',
      content: '你对我们公司、业务和产品的了解，表达真诚…',
      input_type: 'text',
      score: 8,
      feedback_content: '展示了对公司的深入研究，真诚加分。',
      feedback_structure: '结构完整，问题有针对性。',
      feedback_improvement: '可以对公司最新动态做更具体的引用。',
    },
  },
  {
    question: {
      id: 'q-006',
      content: '你还有什么问题要问我们的吗？',
      question_type: 'behavioral',
      order_index: 6,
    },
    answer: {
      id: 'a-006',
      content: '提出了有深度的问题，展现出对岗位的兴趣…',
      input_type: 'text',
      score: 8,
      feedback_content: '提问质量高，体现了主动思考。',
      feedback_structure: '问题聚焦，简洁明了。',
      feedback_improvement: '可以进一步问关于团队文化和成长路径的问题。',
    },
  },
]
