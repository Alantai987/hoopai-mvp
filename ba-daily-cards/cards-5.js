window.cardDeckParts = window.cardDeckParts || [];
window.cardDeckParts.push({"id":"d5","date":"2026-06-26","name":"D5 聚类","topic":"聚类与三类方法对比","cards":[
{"type":"flash","tag":"定义","q":"什么是聚类？","answerText":"聚类是在没有预设类别的情况下，把原始数据划分成簇，使类内对象足够相似、类间对象尽量不同。","source":"9 Clustering.pdf 第3-4页"},
{"type":"choice","tag":"场景","q":"没有客户标签，只想按行为把客户分群，适合用什么？","options":["聚类","分类","关联规则","朴素贝叶斯"],"answer":0,"explain":"没有预设类别是聚类的典型条件，客户分群、市场细分、画像分组都常用聚类。","source":"9 Clustering.pdf 第3-4页；期末复习.pdf 第5页"},
{"type":"choice","tag":"聚类标准","q":"好的聚类结果应该怎样？","options":["类内相似度高，类间相似度低","类内差异大，类间完全相同","只要簇数量多就好","只看 Accuracy"],"answer":0,"explain":"聚类准则就是 cohesive within clusters、distinctive between clusters。","source":"9 Clustering.pdf 第4页、第7页"},
{"type":"choice","tag":"聚类 vs 分类","q":"聚类和分类最大的区别是？","options":["聚类无预设类别，分类有已知标签训练","聚类只能算文本","分类不需要数据","二者都必须先有标签"],"answer":0,"explain":"分类是监督学习，聚类是无监督学习。应用题选方法时很常考。","source":"9 Clustering.pdf 第4页、第6页；期末复习.pdf 第5页"},
{"type":"choice","tag":"距离","q":"在聚类中，距离/相似度主要用来做什么？","options":["判断对象之间相似程度","计算 Precision","判断 Lift","生成停用词表"],"answer":0,"explain":"对象间距离越小通常越相似；不同数据类型应考虑不同距离或相似度。","source":"9 Clustering.pdf 第8-10页"},
{"type":"choice","tag":"K-means","q":"K-means 属于哪类聚类方法？","options":["划分型聚类","层次聚类","基于密度聚类","文本分词"],"answer":0,"explain":"划分法包括 K-means、K-medoids 等，目标是把 n 个对象分到 k 个类。","source":"9 Clustering.pdf 第14-15页"},
{"type":"choice","tag":"K-means 限制","q":"K-means 的一个常见限制是？","options":["需要提前指定 k，且对初始中心敏感","只能用于有向网络","不能处理数值数据","只适合关联规则"],"answer":0,"explain":"课件提到初始中心选择会影响结果，通常也需要给定 k。","source":"9 Clustering.pdf 第15页、第25页"},
{"type":"choice","tag":"层次聚类","q":"层次聚类主要特点是？","options":["形成从细到粗或从粗到细的层次结构","只计算置信度","只能做二分类","只用于 RNN"],"answer":0,"explain":"层次法包括凝聚型和分裂型，常形成树状层次。","source":"9 Clustering.pdf 第14页、第25-31页"},
{"type":"choice","tag":"DBSCAN","q":"DBSCAN 更适合处理什么情况？","options":["发现高密度区域和噪声点，识别不规则形状簇","计算混淆矩阵","中文分词","预测类别标签"],"answer":0,"explain":"DBSCAN 是基于密度的聚类，可发现密度相连区域，并能识别噪声。","source":"9 Clustering.pdf 第42-47页"},
{"type":"choice","tag":"方法选择","q":"购物篮交叉销售、信用风险预测、客户分群分别对应？","options":["关联规则、分类、聚类","分类、聚类、关联规则","聚类、关联规则、分类","关联规则、聚类、分类"],"answer":0,"explain":"这类三方法对比是应用题高频：共现关系用关联规则，有标签预测用分类，无标签分群用聚类。","source":"商务分析方法与工具_期末复习.pdf 第5页"},
{"type":"flash","tag":"三方法模板","q":"关联规则、分类、聚类如何一句话区分？","answerText":"关联规则发现项目/行为共现关系；分类根据已知标签预测新对象类别；聚类在无预设标签时按相似性自动分群。","source":"商务分析方法与工具_期末复习.pdf 第5页"},
{"type":"write","tag":"应用练习","q":"某银行想对客户做精细化营销，但没有现成客户类型标签。请设计聚类思路。","hint":"写客户特征、清洗标准化、选择距离、尝试 K-means/层次/DBSCAN、评估类内相似和类间差异、解释各簇并制定营销动作。","source":"9 Clustering.pdf 第3-15页；期末复习.pdf 第5-6页"},
{"type":"write","tag":"对比练习","q":"做一张三列表：关联规则、分类、聚类分别解决什么问题、需要什么数据、业务例子。","hint":"这是及格必会题。重点写：共现/交易数据/交叉销售；有标签/训练集/流失预测；无标签/特征数据/市场细分。","source":"商务分析方法与工具_期末复习.pdf 第5页"}
]});
