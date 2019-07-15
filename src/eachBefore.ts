// from https://github.com/d3/d3-hierarchy
export default function<T = any>(node: T, callback: (node: T) => void) {
  var nodes = [node], children, i;
  while (node = nodes.pop()) {
    callback(node), children = node.children;
    if (children) for (i = children.length - 1; i >= 0; --i) {
      nodes.push(children[i]);
    }
  }
}
