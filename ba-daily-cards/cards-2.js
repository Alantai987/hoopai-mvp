window.cardDeckParts = window.cardDeckParts || [];
window.cardDeckParts.push({
  "id": "d2",
  "date": "2026-06-23",
  "name": "D2 数据",
  "topic": "数据探索、质量、预处理",
  "cards": [
    {"type":"flash","tag":"今天重点","q":"数据探索这部分最容易考什么？","answerText":"重点不是代码，而是知道数据理解、数据描述、数据质量识别、数据预处理分别做什么，以及它们为什么会影响后续建模。","source":"03 Data Exploration.pdf 第6-10页；期末复习.pdf 第4页"},
    {"type":"choice","tag":"数据描述","q":"下面哪项属于数据描述的内容？","options":["数据量、变量类型、编码方案、分布特征","只看模型准确率","只写最终业务结论","只部署系统"],"answer":0,"explain":"数据描述用于让建模人员了解数据规模、类型、编码和分布，减少后续建模错误。","source":"03 Data Exploration.pdf 第8页；期末复习.pdf 第4页"},
    {"type":"choice","tag":"数据质量","q":"下列哪项不是课件列出的常见数据质量问题？","options":["缺失值","错误值","编码不一致","模型部署"],"answer":3,"explain":"模型部署是 CRISP-DM 最后阶段，不属于数据质量问题。数据质量常见问题包括缺失、错误、离群、编码不一致、无效数据。","source":"03 Data Exploration.pdf 第10页"},
    {"type":"flash","tag":"清洗对象","q":"缺失值、错误值、离群值、编码不一致分别怎么理解？","answerText":"缺失值是字段没有记录；错误值是不可能或明显错误的取值，如年龄为负；离群值是少数极端但不一定错误的值；编码不一致是同一含义用不同编码或格式表示。","source":"03 Data Exploration.pdf 第10页"},
    {"type":"choice","tag":"缺失处理","q":"处理缺失数据时，哪种做法是课件提到的合理选择？","options":["永远删除整列","明确缺失原因，必要时删除对象或用均值/中位数/众数等替代","把缺失值全部填 0","忽略缺失值"],"answer":1,"explain":"缺失值处理要先判断原因，再选择删除、统计量替代或用预测方法估计。","source":"03 Data Exploration.pdf 第58页"},
    {"type":"choice","tag":"异常值","q":"关于异常值，哪句话更准确？","options":["异常值一定是错误数据","异常值可能有业务意义，但也可能影响均值、极差和模型","异常值永远不能删除","异常值只存在于文本数据"],"answer":1,"explain":"课件强调异常值不一定都是错误，在欺诈等业务场景中可能很有意义。","source":"03 Data Exploration.pdf 第10页、第58页"},
    {"type":"choice","tag":"采样","q":"为什么超大数据库中常需要采样？","options":["为了故意丢掉重要信息","降低成本、提升速度，只要样本有代表性也能发现模式","因为模型不能使用完整数据","为了避免数据清洗"],"answer":1,"explain":"采样可以降低成本、提升速度、扩大灵活性；关键是代表性。","source":"03 Data Exploration.pdf 第44-46页"},
    {"type":"choice","tag":"分层抽样","q":"希望样本中保持不同客户层级的比例，更适合哪种抽样？","options":["简单随机抽样","系统抽样","分层抽样","整群抽样"],"answer":2,"explain":"分层抽样会按名义/有序属性划分层，并在各层内抽样，以保持总体各层比例。","source":"03 Data Exploration.pdf 第49页"},
    {"type":"choice","tag":"标准化","q":"为什么要做数据规范化/标准化？","options":["让不同属性取值范围统一，避免量纲大的一项支配距离或模型","让数据变得更复杂","删除所有类别变量","替代模型评估"],"answer":0,"explain":"如身高、体重、年龄量纲差异很大，直接算距离会让取值范围大的属性影响过重。","source":"03 Data Exploration.pdf 第52页、第54-55页"},
    {"type":"choice","tag":"离散化","q":"把连续年龄分成“青年/中年/老年”属于什么处理？","options":["数据离散化/概念分层","混淆矩阵","提升度","网络直径"],"answer":0,"explain":"离散化是把连续值或细粒度值转成区间或更高层概念，便于分析和建模。","source":"03 Data Exploration.pdf 第60-62页"},
    {"type":"choice","tag":"特征构建","q":"由身份证号推导出生日期、性别、籍贯，属于哪类处理？","options":["创建新变量/特征构建","模型部署","网络密度","Apriori 剪枝"],"answer":0,"explain":"从原字段生成新的、有业务意义的字段，就是特征构建。","source":"02 Challenges of Big Data  Process of Business Analytics.pdf 第59页；03 Data Exploration.pdf 第15页"},
    {"type":"write","tag":"简答练习","q":"请列出 5 类数据质量问题，并说明其中 2 类如何处理。","hint":"可写：缺失、错误、离群、编码不一致、无效/重复。处理写删除、替代、统一编码、去重、用回归/分类预测缺失值等。","source":"03 Data Exploration.pdf 第10页、第58页；期末复习.pdf 第4页"},
    {"type":"write","tag":"应用练习","q":"某公司要做用户流失预测，建模前你会怎样做数据准备？","hint":"写选择有效用户记录、清理缺失和异常、统一编码、构造活跃度/消费频次/投诉次数等特征、标准化数值字段、划分训练测试数据。","source":"03 Data Exploration.pdf 第8-10页；02 Challenges of Big Data  Process of Business Analytics.pdf 第59-61页"}
  ]
});
