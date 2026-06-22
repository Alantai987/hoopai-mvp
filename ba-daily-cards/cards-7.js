window.cardDeckParts = window.cardDeckParts || [];
window.cardDeckParts.push({"id":"d7","date":"2026-06-30","name":"D7 AI/深度","topic":"深度学习与 AI 管理挑战","cards":[
{"type":"flash","tag":"定义","q":"什么是深度学习？","answerText":"深度学习是机器学习的一个领域，源于人工神经网络，通过组合低层特征形成更抽象的高层特征，从大量数据中学习有效特征表示。","source":"11 Deep learning.pdf 第4页；期末复习.pdf 第7页"},
{"type":"choice","tag":"位置","q":"深度学习与机器学习的关系是？","options":["深度学习是机器学习的子领域","机器学习是深度学习的子领域","二者毫无关系","深度学习只能做文本挖掘"],"answer":0,"explain":"课件明确写 DL is a subset of ML。","source":"11 Deep learning.pdf 第4页"},
{"type":"choice","tag":"特征处理","q":"深度学习和传统机器学习在特征处理上的区别是？","options":["传统 ML 通常依赖人工特征，DL 可从数据中学习高层特征","DL 完全不需要数据","传统 ML 一定比 DL 慢","DL 只能手工提取特征"],"answer":0,"explain":"这是简答题高频比较点：数据依赖、硬件依赖、特征处理、端到端、可解释性。","source":"11 Deep learning.pdf 第5-6页；期末复习.pdf 第7页"},
{"type":"choice","tag":"硬件","q":"为什么深度学习更依赖 GPU？","options":["大量矩阵运算需要高效并行计算","因为 GPU 能提高 Support","因为 GPU 用于分词","因为 GPU 能增加样本标签"],"answer":0,"explain":"课件提到 DL 算法需要大量矩阵运算，需要 GPU 高效优化。","source":"11 Deep learning.pdf 第5页"},
{"type":"choice","tag":"端到端","q":"“端到端”更接近哪种说法？","options":["直接从输入数据学习到输出结果","先人工拆成多个固定子问题再合并","只做数据清洗","只做规则挖掘"],"answer":0,"explain":"深度学习倾向直接端到端解决问题，传统 ML 往往拆分为多个子任务。","source":"11 Deep learning.pdf 第6页"},
{"type":"choice","tag":"黑盒","q":"深度学习在管理应用中的一个常见问题是？","options":["可解释性较弱，像黑盒","永远不需要数据","不能做分类","不需要算力"],"answer":0,"explain":"课件明确提到 DL 算法是黑盒模型，论述题可联系透明度、责任和信任问题。","source":"11 Deep learning.pdf 第6页"},
{"type":"flash","tag":"神经网络","q":"神经网络结构中输入层、隐藏层、输出层分别怎么理解？","answerText":"输入层接收特征，隐藏层学习中间表示，输出层给出预测结果。连接线对应权重，需要通过训练得到，本质是用参数和激活函数拟合关系。","source":"11 Deep learning.pdf 第8-9页"},
{"type":"choice","tag":"CNN","q":"CNN 更典型的应用是什么？","options":["图像特征提取和分类","网络密度计算","购物篮规则","手工停用词表"],"answer":0,"explain":"CNN 包含卷积和池化等模块，卷积块用于特征提取，全连接块用于分类。","source":"11 Deep learning.pdf 第36页"},
{"type":"choice","tag":"RNN","q":"RNN 更适合处理哪类数据？","options":["序列数据","无向图密度","购物篮支持度","K-means 初始中心"],"answer":0,"explain":"RNN 以序列数据为输入，具有记忆功能，当前输出与前面信息有关。","source":"11 Deep learning.pdf 第42-43页"},
{"type":"choice","tag":"AI 风险","q":"AI 用于招聘或信贷时可能对某些群体不公平，属于哪类管理挑战？","options":["算法公平和伦理","网络直径","支持度","数据离散化"],"answer":0,"explain":"期末复习提示 AI 时代要关注数据质量、隐私伦理、算法应用边界和管理变革。","source":"商务分析方法与工具_期末复习.pdf 第3页、第7页"},
{"type":"flash","tag":"论述模板","q":"AI 时代商务分析论述题怎么组织？","answerText":"先写机会：自动化、预测、个性化、多模态和生成式能力提升决策效率；再写风险：数据质量、隐私、伦理、公平、透明、过度依赖和组织能力；最后写管理建议。","source":"商务分析方法与工具_期末复习.pdf 第3页、第7页"},
{"type":"write","tag":"简答练习","q":"比较深度学习与传统机器学习，至少写 4 点。","hint":"可写：数据依赖、硬件依赖、特征处理、问题解决方式、端到端建模、可解释性。每点都用一句话解释。","source":"11 Deep learning.pdf 第5-6页；期末复习.pdf 第7页"},
{"type":"write","tag":"论述练习","q":"请说明 AI 给商务分析带来的机会和风险。","hint":"机会写效率、自动化、预测能力、个性化服务；风险写隐私、公平、透明、算法边界、数据质量、组织能力和人类监督。","source":"商务分析方法与工具_期末复习.pdf 第3页、第7页"}
]});
