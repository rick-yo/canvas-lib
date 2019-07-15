// from https://github.com/d3/d3-hierarchy
export default function<T = any>(node: T, callback: (node: T) => void) {
  var nodes = [node], next = [], children, i, n;
  while (node = nodes.pop()) {
    next.push(node), children = node.children;
    if (children) for (i = 0, n = children.length; i < n; ++i) {
      nodes.push(children[i]);
    }
  }
  while (node = next.pop()) {
    callback(node);
  }
}
