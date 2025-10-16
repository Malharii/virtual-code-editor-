import { useEffect } from "react";
import { useTreeStructuerStore } from "../../../store/treeStructuerStore";
import { TreeNode } from "../../molecules/TreeNode/TreeNode";

export const TreesStructure = () => {
  const { treeStructuer, setTreeStructuer } = useTreeStructuerStore();

  useEffect(() => {
    if (treeStructuer) {
      console.log("tree:", treeStructuer);
    } else {
      setTreeStructuer();
    }
  }, [setTreeStructuer, treeStructuer]);

  return (
    <div>
      <TreeNode fileFolderData={treeStructuer} />
    </div>
  );
};
