import pandas as pd
import numpy as np
from sklearn.tree import DecisionTreeClassifier
from sklearn.tree import _tree
from sklearn.model_selection import train_test_split
from sklearn.tree import export_graphviz
import graphviz
import mysql.connector

mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    password="0000",
    database="test_db"
)

def getRules(tree, feature_names, class_names):
    tree_ = tree.tree_
    feature_name = [
        feature_names[i] if i != _tree.TREE_UNDEFINED else "undefined!"
        for i in tree_.feature
    ]

    paths = []
    path = [0,24,1,7, 0, 6]


    def myRecurse(node, path, paths):
        if tree_.feature[node] != _tree.TREE_UNDEFINED:
            name = feature_name[node]
            threshold = int(tree_.threshold[node])
            p1, p2 = list(path), list(path)
            
            if name == 'myHour':
                p1[0] = threshold
            elif name == 'myDay':
                p1[2] = threshold
            elif name == 'prior':
                p1[4] = threshold
            myRecurse(tree_.children_right[node], p1, paths)
            
            if name == 'myHour':
                p2[1] = threshold
            elif name == 'myDay':
                p2[3] = threshold
            elif name == 'prior':
                p2[5] = threshold
            myRecurse(tree_.children_left[node], p2, paths)
        else:
            path += [(tree_.value[node], tree_.n_node_samples[node])]
            paths += [path]
            
    myRecurse(0,path, paths)
    
    rules = []
    for curPath in paths:
        rule = curPath
        if class_names is None:
            rule += "response: "+str(np.round(curPath[-1][0][0][0],3))
        else:
            classes = curPath[-1][0][0]
            l = np.argmax(classes)
            rule[-1] = f"{class_names[l]}"

        rules += [rule]
        
    return rules

file_path = "C:/Users/pies6/Desktop/캡스톤/project/visits/useableVisits.csv"
data = pd.read_csv(file_path)
data_features = ["myDay", "myHour", "prior"]

y = data.storeType
X = data[data_features]

X_train, X_test, y_train, y_test = train_test_split(X, y, random_state=1)

tree = DecisionTreeClassifier(random_state=0)
tree.fit(X_train, y_train)

#export_graphviz(tree, out_file = "useableVisits.dot", class_names = tree.classes_,
#                feature_names = data_features, impurity = False, filled = True, precision=0)

rules = getRules(tree, data_features, tree.classes_)
mycursor = mydb.cursor()
cnt = 1
for rule in rules:
    query = "INSERT INTO treeResults VALUES(%s, %s, %s, %s, %s, %s, %s, %s)"
    val = (cnt, rule[0], rule[1], rule[2], rule[3], rule[4], rule[5], rule[6])
    mycursor.execute(query, val)

    mydb.commit()
    cnt +=1
print("DONE")

