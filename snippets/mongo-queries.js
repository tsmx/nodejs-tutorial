// example function for Robo-3T to select and print the object's tree
//
// parent 1
//   child 1.1
//     child 1.1.1
//     child 1.1.2
//   child 1.2
// parent 2
// ...

function processChildren(parent, level) {
    for (var i = 0, len = parent.children.length; i < len; i++) {
        var child = db.masterdata.findOne({ "_id": parent.children[i] });
        if (child == null) continue;
        var childName = "";
        for (var count = 0; count < level; count++) {
            childName = childName.concat(" ");
        }
        childName = childName.concat(child.name);
        print(childName);
        processChildren(child, level + 1);
    }
}

//var root = db.masterdata.find({ "parent": null, "children" : {$not: { $size: 0}}}); // all root-elements with children
var root = db.masterdata.find({ "parent": null }); // all root-elements with/without children
while (root.hasNext()) {
    var parent = root.next();
    print(parent.name);
    processChildren(parent, 1);
}