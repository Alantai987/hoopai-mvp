window.cardDeckParts = window.cardDeckParts || [];
window.cardDeckParts.push({"id":"d8","date":"2026-07-01","name":"D8 冲刺","topic":"混合模拟与模板","cards":[
{"type":"flash","tag":"冲刺策略","q":"考前最后一天应该怎么刷？","answerText":"不再大范围学新内容。优先刷错题、公式、CRISP-DM 六阶段、三类方法对比、SNA 中心性和 AI 论述模板。","source":"商务分析方法与工具_期末复习.pdf 第2-7页"},
{"type":"choice","tag":"题型分配","q":"计算题大概占多少分？","options":["15分","20分","30分","50分"],"answer":0,"explain":"计算题 15 分，重点是分类指标、关联规则指标、社交网络指标和聚类相似度。","source":"商务分析方法与工具_期末复习.pdf 第2页、第6页"},
{"type":"choice","tag":"方法选择","q":"用户流失预警、购物篮组合推荐、用户画像分群分别对应？","options":["分类、关联规则、聚类","聚类、分类、关联规则","关联规则、聚类、分类","分类、聚类、关联规则"],"answer":0,"explain":"流失预警有标签预测；组合推荐看共现；画像分群无预设类别。","source":"商务分析方法与工具_期末复习.pdf 第5页"},
{"type":"choice","tag":"公式","q":"TP=30，FP=10，FN=15，Precision 是？","options":["0.50","0.67","0.75","0.80"],"answer":2,"explain":"Precision=TP/(TP+FP)=30/(30+10)=0.75。","source":"07 Classification.pdf 第74-76页；期末复习.pdf 第6页"},
{"type":"choice","tag":"公式","q":"TP=30，FN=15，Recall 是？","options":["0.50","0.67","0.75","0.80"],"answer":1,"explain":"Recall=TP/(TP+FN)=30/(30+15)=0.67。","source":"07 Classification.pdf 第74-76页"},
{"type":"choice","tag":"公式","q":"某规则 Support=20%，Confidence=50%，P(B)=25%，Lift 是？","options":["0.5","1","2","4"],"answer":2,"explain":"Lift=Confidence/P(B)=0.50/0.25=2。","source":"06 Association Rule Mining.pdf 第45-48页"},
{"type":"choice","tag":"公式","q":"无向网络 6 个节点最多有多少条边？","options":["12","15","30","36"],"answer":1,"explain":"无向图最多边数 n(n-1)/2=6*5/2=15。","source":"13 Social Network Analysis.pdf 第27页"},
{"type":"choice","tag":"概念","q":"“类内相似、类间差异”对应哪个方法？","options":["聚类","分类","文本停用词","神经网络黑盒"],"answer":0,"explain":"这是聚类的核心评价思路。","source":"9 Clustering.pdf 第4页、第7页"},
{"type":"choice","tag":"概念","q":"“前件是否真正提高后件出现概率”主要看哪个指标？","options":["Lift","Support","Accuracy","Density"],"answer":0,"explain":"Support 看常见程度，Confidence 看条件概率，Lift 看相对基准概率的提升。","source":"06 Association Rule Mining.pdf 第45-48页"},
{"type":"flash","tag":"应用题模板","q":"应用题万能写法是什么？","answerText":"套 CRISP-DM：业务目标 -> 数据需求和理解 -> 数据准备 -> 方法选择 -> 指标评估 -> 部署和业务行动。最后一定回到业务价值。","source":"02 Challenges of Big Data  Process of Business Analytics.pdf 第52-53页；期末复习.pdf 第3页"},
{"type":"write","tag":"模拟应用","q":"某电商希望提高交叉销售额，请用 CRISP-DM 设计分析方案。","hint":"业务目标：提高客单价/连带率；数据：订单购物篮、用户、商品；准备：清洗、构造项集；模型：关联规则；指标：Support/Confidence/Lift 和转化率；部署：捆绑促销/推荐位。","source":"06 Association Rule Mining.pdf 第6-12页、第45-50页；期末复习.pdf 第5-6页"},
{"type":"write","tag":"模拟应用","q":"某平台希望识别关键传播用户，请说明可用哪些 SNA 指标。","hint":"写网络节点和边定义；度中心性找活跃/受欢迎节点；中间中心性找桥接节点；接近中心性找能快速触达全网的节点；可补充网络密度和直径。","source":"13 Social Network Analysis.pdf 第5页、第25-40页"},
{"type":"write","tag":"论述模拟","q":"请论述商务分析如何帮助企业决策，并说明 AI 时代的新挑战。","hint":"先写商务分析定义和 CRISP-DM；再写数据探索、模型方法和指标评估；最后写 AI 带来的效率提升，以及隐私、公平、透明、数据质量、组织能力等挑战。","source":"02 Challenges of Big Data  Process of Business Analytics.pdf 第3页、第52-53页；期末复习.pdf 第3页、第7页"},
{"type":"flash","tag":"考前清单","q":"进考场前最后确认这 8 件事。","answerText":"会写商务分析定义；会写 4V 和思维变革；会默 CRISP-DM；会解释数据质量和预处理；会算 Support/Confidence/Lift；会算 Precision/Recall/Specificity；会区分关联/分类/聚类；会解释 SNA 三中心性和 AI 挑战。","source":"商务分析方法与工具_期末复习.pdf 第2-7页"}
]});
