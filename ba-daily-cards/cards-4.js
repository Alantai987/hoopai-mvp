window.cardDeckParts = window.cardDeckParts || [];
window.cardDeckParts.push({
  "id":"d4",
  "date":"2026-06-25",
  "name":"D4 分类",
  "topic":"分类方法与混淆矩阵",
  "cards":[
    {"type":"flash","tag":"定义","q":"什么是分类分析？","answerText":"分类是把一个事件或对象划分到给定类别上的方法，常用于信用风险、疾病诊断、产品类型、用户流失等离散标签预测。","source":"07 Classification.pdf 第3页"},
    {"type":"choice","tag":"分类判断","q":"预测用户“是否流失”属于什么问题？","options":["分类","关联规则","无监督聚类","文本分词"],"answer":0,"explain":"是否流失是离散类别标签，因此属于分类。","source":"07 Classification.pdf 第3页；期末复习.pdf 第5页"},
    {"type":"choice","tag":"预测 vs 分类","q":"分类和回归预测的主要区别是？","options":["分类预测类别标签，回归多预测连续数值","分类只能处理文本","回归只能处理图片","二者完全一样"],"answer":0,"explain":"课件中预测分析通常处理连续数值，分类主要处理类别标签。Logistic 回归也可用于分类。","source":"07 Classification.pdf 第14-18页"},
    {"type":"choice","tag":"懒惰型","q":"KNN 属于哪类分类方法？","options":["懒惰型分类","深度学习","关联规则","密度聚类"],"answer":0,"explain":"懒惰型方法不先构造复杂分类器，而是保存训练集，预测时找最相似样本。","source":"07 Classification.pdf 第5页、第21-22页"},
    {"type":"flash","tag":"KNN","q":"KNN 的基本思想是什么？","answerText":"如果一个样本在特征空间中最相似的 k 个邻居大多数属于某类，则该样本也被分到该类。最近邻通常基于距离判断。","source":"07 Classification.pdf 第21-23页"},
    {"type":"flash","tag":"决策树","q":"决策树为什么适合简答题？","answerText":"决策树用树结构自上而下给出分类规则，内部节点是分裂属性，叶子节点是类别。优点是直观、易理解、分类准确率较好。","source":"07 Classification.pdf 第25页"},
    {"type":"flash","tag":"朴素贝叶斯","q":"朴素贝叶斯的核心思想是什么？","answerText":"基于贝叶斯定理，计算样本属于各类别的概率，并把样本划分到概率最大的类别。朴素之处在于类条件独立性假设。","source":"07 Classification.pdf 第58-64页"},
    {"type":"choice","tag":"两步过程","q":"急切型分类分析一般包含哪两步？","options":["先用已知类别数据构建分类器，再用分类器预测未知样本","先聚类再购物篮分析","先部署再理解业务","只做数据可视化"],"answer":0,"explain":"训练集用于总结模型，测试集或新数据用于预测和验证。","source":"07 Classification.pdf 第6页"},
    {"type":"choice","tag":"混淆矩阵","q":"混淆矩阵主要用来做什么？","options":["评价分类模型表现","计算购物篮支持度","计算网络密度","进行中文分词"],"answer":0,"explain":"混淆矩阵是分类准确率评价的基础，TP/FP/TN/FN 都从这里来。","source":"07 Classification.pdf 第73页"},
    {"type":"choice","tag":"Precision","q":"TP=40，FP=10，Precision 是？","options":["0.50","0.67","0.80","0.90"],"answer":2,"explain":"Precision=TP/(TP+FP)=40/(40+10)=0.80，表示预测为正的样本中有多少是真的正。","source":"07 Classification.pdf 第74-76页；期末复习.pdf 第6页"},
    {"type":"choice","tag":"Recall","q":"TP=40，FN=20，Recall 是？","options":["0.50","0.67","0.80","0.90"],"answer":1,"explain":"Recall=TP/(TP+FN)=40/(40+20)=0.67，表示真实正类中找回了多少。","source":"07 Classification.pdf 第74-76页"},
    {"type":"choice","tag":"Specificity","q":"TN=90，FP=10，Specificity 是？","options":["0.10","0.50","0.90","1.00"],"answer":2,"explain":"Specificity=TN/(TN+FP)=90/(90+10)=0.90，表示负类识别能力。","source":"07 Classification.pdf 第74-75页"},
    {"type":"flash","tag":"Accuracy 局限","q":"为什么类别不平衡时 Accuracy 不够好？","answerText":"如果负类占 97%，模型全预测负类也能有 97% 准确率，但完全识别不出真正关心的少数正类，如欺诈事件。因此要看 Precision、Recall、F1 等。","source":"07 Classification.pdf 第74页"},
    {"type":"write","tag":"业务解释","q":"请解释 Precision 和 Recall 的区别，并各举一个业务含义。","hint":"Precision 看预测为正的有多少是真的，适合关注误报成本；Recall 看真实正类找回多少，适合关注漏报成本，如欺诈检测、疾病筛查。","source":"07 Classification.pdf 第74-76页"}
  ]
});
