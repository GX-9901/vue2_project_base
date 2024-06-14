/**
 * 构造树型结构数据
 * @param {*} data 原始数据
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId parentId字段 默认 'parentId'
 * @param {*} children children字段 默认 'children'
 * @returns
 */
export const handleTree = (
  data,
  id = "id",
  parentId = "parentId",
  children = "children",
) => {
  const config = {
    id,
    parentId,
    children,
  };

  const nodeIds = {};

  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    if (nodeIds[item[config.parentId]]) {
      nodeIds[item[config.parentId]].push(item);
    } else {
      nodeIds[item[config.parentId]] = [item];
    }
  }

  // 一级分类
  const list = nodeIds["0"];

  // 二级分类
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    item[config.children] = nodeIds[item[config.id]];
  }

  return list;
};

export const defaultProps = {
  children: "children",
  label: "name",
  value: "id",
  isLeaf: "leaf",
  emitPath: false, // 用于 cascader 组件：在选中节点改变时，是否返回由该节点所在的各级菜单的值所组成的数组，若设置 false，则只返回该节点的值
};
