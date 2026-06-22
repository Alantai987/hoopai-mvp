window.cardDeckParts = window.cardDeckParts || [];
window.cardDeckParts.push({
  "id": "d1",
  "date": "2026-06-22",
  "name": "D1 框架",
  "topic": "商务分析、大数据、CRISP-DM",
  "cards": [
    {
      "type": "flash",
      "tag": "先看考法",
      "q": "期末题型怎么分布？为什么不能只背名词？",
      "answerText": "题型包括名词解释20分、简答30分、计算15分、应用15分、论述20分。及格策略不是死背，而是把核心概念、公式计算、方法选择和业务方案模板都练到能写。",
      "source": "商务分析方法与工具_期末复习.pdf 第2页"
    },
    {
      "type": "choice",
      "tag": "商务分析",
      "q": "商务分析最核心的目标是什么？",
      "options": ["把所有业务流程自动化", "把数据转化为信息和知识，支持管理决策", "只制作可视化图表", "只训练复杂算法"],
      "answer": 1,
      "explain": "定义关键词是数据管理、分析与挖掘、信息和知识、快速正确决策。答名词解释时要把“数据到决策”写出来。",
      "source": "02 Challenges of Big Data  Process of Business Analytics.pdf 第3页；期末复习.pdf 第3页"
    },
    {
      "type": "write",
      "tag": "名词解释",
      "q": "请用 4-5 句话解释“商务分析”。",
      "hint": "建议结构：商务分析是什么 -> 用什么数据/方法 -> 产出信息和知识 -> 服务管理决策 -> 举一个企业例子。",
      "source": "02 Challenges of Big Data  Process of Business Analytics.pdf 第3页"
    },
    {
      "type": "choice",
      "tag": "4V",
      "q": "下列哪一组是大数据 4V？",
      "options": ["规模、速度、多样性、价值", "准确、完整、及时、低价", "可见、可控、可用、可复制", "分类、聚类、关联、回归"],
      "answer": 0,
      "explain": "Volume 是数据量大，Velocity 是速度快，Variety 是类型多样，Value 是价值。注意 Value 不等于价值密度高，课件提到价值密度低但商业价值高。",
      "source": "02 Challenges of Big Data  Process of Business Analytics.pdf 第4页"
    },
    {
      "type": "flash",
      "tag": "4V 展开",
      "q": "如果简答题问“大数据 4V 特征”，怎么写更完整？",
      "answerText": "写四点：数据量大，从 PB 到 EB/ZB；速度快，需要实时或近实时分析；类型多，包括结构化、半结构化、非结构化；价值方面，价值密度低但商业价值高。",
      "source": "02 Challenges of Big Data  Process of Business Analytics.pdf 第4页"
    },
    {
      "type": "choice",
      "tag": "思维变革",
      "q": "“不是随机样本，而是全体数据”强调的是什么？",
      "options": ["只需要更少的数据", "能收集更多甚至全部数据时，分析不再只依赖小样本抽样", "分析必须完全精确", "只能研究因果关系"],
      "answer": 1,
      "explain": "大数据思维变革包括更多、更杂、更好：全体数据、混杂性、相关关系。",
      "source": "02 Challenges of Big Data  Process of Business Analytics.pdf 第7页"
    },
    {
      "type": "choice",
      "tag": "相关关系",
      "q": "大数据时代“不是因果关系，而是相关关系”的正确理解是？",
      "options": ["相关关系等于因果关系", "相关关系可以帮助预测和决策，但不能直接证明因果", "因果关系完全没有价值", "只要数据多就不需要解释"],
      "answer": 1,
      "explain": "考试论述时可以写：相关关系支持预测和商业行动，但管理决策仍需注意解释边界和伦理风险。",
      "source": "02 Challenges of Big Data  Process of Business Analytics.pdf 第7页；期末复习.pdf 第3页"
    },
    {
      "type": "flash",
      "tag": "CRISP-DM",
      "q": "CRISP-DM 是什么？",
      "answerText": "CRISP-DM 是跨行业数据挖掘标准流程，是商务分析/数据挖掘项目实践中常用的方法论。它不是单纯建模流程，而是从业务理解到部署的完整项目流程。",
      "source": "02 Challenges of Big Data  Process of Business Analytics.pdf 第52页"
    },
    {
      "type": "choice",
      "tag": "六阶段",
      "q": "CRISP-DM 六个阶段的正确顺序是？",
      "options": ["商业理解 -> 数据理解 -> 数据准备 -> 建模 -> 评估 -> 部署", "数据准备 -> 商业理解 -> 建模 -> 部署 -> 评估 -> 数据理解", "建模 -> 数据理解 -> 数据准备 -> 商业理解 -> 评估 -> 部署", "商业理解 -> 建模 -> 数据准备 -> 数据理解 -> 部署 -> 评估"],
      "answer": 0,
      "explain": "一定要按业务理解、数据理解、数据准备、建模、评估、部署来背；但课件也强调阶段之间会反复迭代。",
      "source": "02 Challenges of Big Data  Process of Business Analytics.pdf 第53页；03 Data Exploration.pdf 第2页"
    },
    {
      "type": "choice",
      "tag": "迭代",
      "q": "关于 CRISP-DM，哪句话最准确？",
      "options": ["六阶段必须线性一次完成", "商业理解和数据理解、数据准备和建模之间可能反复循环", "只要建模准确就不需要部署", "数据准备不是正式阶段"],
      "answer": 1,
      "explain": "课件特别提醒：顺序不是固定的，实际项目中会根据发现的问题反复回到前一阶段。",
      "source": "02 Challenges of Big Data  Process of Business Analytics.pdf 第53页"
    },
    {
      "type": "write",
      "tag": "应用模板",
      "q": "某电商希望 GMV 提高 10%，请用 CRISP-DM 写一个分析方案框架。",
      "hint": "按六段写：业务目标和成功标准；收集用户行为、商品、交易数据；清洗和构造特征；选择分类/聚类/关联规则；用指标评估；部署到推荐、营销或运营系统。",
      "source": "03 Data Exploration.pdf 第3-5页；期末复习.pdf 第3页"
    },
    {
      "type": "flash",
      "tag": "及格主线",
      "q": "遇到不会的应用题，应该往哪条主线靠？",
      "answerText": "业务问题 -> 数据需求 -> 数据准备 -> 选择方法 -> 指标评估 -> 部署行动。即使细节不会，也要让答案看起来像一个完整商务分析项目。",
      "source": "商务分析方法与工具_期末复习.pdf 第2-3页"
    }
  ]
});
