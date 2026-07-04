// node_modules/.pnpm/d3-dispatch@3.0.1/node_modules/d3-dispatch/src/dispatch.js
var noop = { value: () => {
} };
function dispatch() {
  for (var i = 0, n = arguments.length, _2 = {}, t; i < n; ++i) {
    if (!(t = arguments[i] + "") || t in _2 || /[\s.]/.test(t)) throw new Error("illegal type: " + t);
    _2[t] = [];
  }
  return new Dispatch(_2);
}
function Dispatch(_2) {
  this._ = _2;
}
function parseTypenames(typenames, types) {
  return typenames.trim().split(/^|\s+/).map(function(t) {
    var name = "", i = t.indexOf(".");
    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
    if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
    return { type: t, name };
  });
}
Dispatch.prototype = dispatch.prototype = {
  constructor: Dispatch,
  on: function(typename, callback) {
    var _2 = this._, T2 = parseTypenames(typename + "", _2), t, i = -1, n = T2.length;
    if (arguments.length < 2) {
      while (++i < n) if ((t = (typename = T2[i]).type) && (t = get(_2[t], typename.name))) return t;
      return;
    }
    if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
    while (++i < n) {
      if (t = (typename = T2[i]).type) _2[t] = set(_2[t], typename.name, callback);
      else if (callback == null) for (t in _2) _2[t] = set(_2[t], typename.name, null);
    }
    return this;
  },
  copy: function() {
    var copy = {}, _2 = this._;
    for (var t in _2) copy[t] = _2[t].slice();
    return new Dispatch(copy);
  },
  call: function(type2, that) {
    if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) args[i] = arguments[i + 2];
    if (!this._.hasOwnProperty(type2)) throw new Error("unknown type: " + type2);
    for (t = this._[type2], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
  },
  apply: function(type2, that, args) {
    if (!this._.hasOwnProperty(type2)) throw new Error("unknown type: " + type2);
    for (var t = this._[type2], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
  }
};
function get(type2, name) {
  for (var i = 0, n = type2.length, c; i < n; ++i) {
    if ((c = type2[i]).name === name) {
      return c.value;
    }
  }
}
function set(type2, name, callback) {
  for (var i = 0, n = type2.length; i < n; ++i) {
    if (type2[i].name === name) {
      type2[i] = noop, type2 = type2.slice(0, i).concat(type2.slice(i + 1));
      break;
    }
  }
  if (callback != null) type2.push({ name, value: callback });
  return type2;
}
var dispatch_default = dispatch;

// node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/namespaces.js
var xhtml = "http://www.w3.org/1999/xhtml";
var namespaces_default = {
  svg: "http://www.w3.org/2000/svg",
  xhtml,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};

// node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/namespace.js
function namespace_default(name) {
  var prefix = name += "", i = prefix.indexOf(":");
  if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
  return namespaces_default.hasOwnProperty(prefix) ? { space: namespaces_default[prefix], local: name } : name;
}

// node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/creator.js
function creatorInherit(name) {
  return function() {
    var document2 = this.ownerDocument, uri = this.namespaceURI;
    return uri === xhtml && document2.documentElement.namespaceURI === xhtml ? document2.createElement(name) : document2.createElementNS(uri, name);
  };
}
function creatorFixed(fullname) {
  return function() {
    return this.ownerDocument.createElementNS(fullname.space, fullname.local);
  };
}
function creator_default(name) {
  var fullname = namespace_default(name);
  return (fullname.local ? creatorFixed : creatorInherit)(fullname);
}

// node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selector.js
function none() {
}
function selector_default(selector) {
  return selector == null ? none : function() {
    return this.querySelector(selector);
  };
}

// node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/select.js
function select_default(select) {
  if (typeof select !== "function") select = selector_default(select);
  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j2 = 0; j2 < m; ++j2) {
    for (var group = groups[j2], n = group.length, subgroup = subgroups[j2] = new Array(n), node, subnode, i = 0; i < n; ++i) {
      if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
        if ("__data__" in node) subnode.__data__ = node.__data__;
        subgroup[i] = subnode;
      }
    }
  }
  return new Selection(subgroups, this._parents);
}

// node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/array.js
function array(x2) {
  return x2 == null ? [] : Array.isArray(x2) ? x2 : Array.from(x2);
}

// node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selectorAll.js
function empty() {
  return [];
}
function selectorAll_default(selector) {
  return selector == null ? empty : function() {
    return this.querySelectorAll(selector);
  };
}

// node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/selectAll.js
function arrayAll(select) {
  return function() {
    return array(select.apply(this, arguments));
  };
}
function selectAll_default(select) {
  if (typeof select === "function") select = arrayAll(select);
  else select = selectorAll_default(select);
  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j2 = 0; j2 < m; ++j2) {
    for (var group = groups[j2], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        subgroups.push(select.call(node, node.__data__, i, group));
        parents.push(node);
      }
    }
  }
  return new Selection(subgroups, parents);
}

// node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/matcher.js
function matcher_default(selector) {
  return function() {
    return this.matches(selector);
  };
}
function childMatcher(selector) {
  return function(node) {
    return node.matches(selector);
  };
}

// node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/selectChild.js
var find = Array.prototype.find;
function childFind(match) {
  return function() {
    return find.call(this.children, match);
  };
}
function childFirst() {
  return this.firstElementChild;
}
function selectChild_default(match) {
  return this.select(match == null ? childFirst : childFind(typeof match === "function" ? match : childMatcher(match)));
}

// node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/selectChildren.js
var filter = Array.prototype.filter;
function children() {
  return Array.from(this.children);
}
function childrenFilter(match) {
  return function() {
    return filter.call(this.children, match);
  };
}
function selectChildren_default(match) {
  return this.selectAll(match == null ? children : childrenFilter(typeof match === "function" ? match : childMatcher(match)));
}

// node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/filter.js
function filter_default(match) {
  if (typeof match !== "function") match = matcher_default(match);
  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j2 = 0; j2 < m; ++j2) {
    for (var group = groups[j2], n = group.length, subgroup = subgroups[j2] = [], node, i = 0; i < n; ++i) {
      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
        subgroup.push(node);
      }
    }
  }
  return new Selection(subgroups, this._parents);
}

// node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/sparse.js
function sparse_default(update) {
  return new Array(update.length);
}

// node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/enter.js
function enter_default() {
  return new Selection(this._enter || this._groups.map(sparse_default), this._parents);
}
function EnterNode(parent, datum2) {
  this.ownerDocument = parent.ownerDocument;
  this.namespaceURI = parent.namespaceURI;
  this._next = null;
  this._parent = parent;
  this.__data__ = datum2;
}
EnterNode.prototype = {
  constructor: EnterNode,
  appendChild: function(child) {
    return this._parent.insertBefore(child, this._next);
  },
  insertBefore: function(child, next) {
    return this._parent.insertBefore(child, next);
  },
  querySelector: function(selector) {
    return this._parent.querySelector(selector);
  },
  querySelectorAll: function(selector) {
    return this._parent.querySelectorAll(selector);
  }
};

// node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/constant.js
function constant_default(x2) {
  return function() {
    return x2;
  };
}

// node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/data.js
function bindIndex(parent, group, enter, update, exit, data) {
  var i = 0, node, groupLength = group.length, dataLength = data.length;
  for (; i < dataLength; ++i) {
    if (node = group[i]) {
      node.__data__ = data[i];
      update[i] = node;
    } else {
      enter[i] = new EnterNode(parent, data[i]);
    }
  }
  for (; i < groupLength; ++i) {
    if (node = group[i]) {
      exit[i] = node;
    }
  }
}
function bindKey(parent, group, enter, update, exit, data, key) {
  var i, node, nodeByKeyValue = /* @__PURE__ */ new Map(), groupLength = group.length, dataLength = data.length, keyValues = new Array(groupLength), keyValue;
  for (i = 0; i < groupLength; ++i) {
    if (node = group[i]) {
      keyValues[i] = keyValue = key.call(node, node.__data__, i, group) + "";
      if (nodeByKeyValue.has(keyValue)) {
        exit[i] = node;
      } else {
        nodeByKeyValue.set(keyValue, node);
      }
    }
  }
  for (i = 0; i < dataLength; ++i) {
    keyValue = key.call(parent, data[i], i, data) + "";
    if (node = nodeByKeyValue.get(keyValue)) {
      update[i] = node;
      node.__data__ = data[i];
      nodeByKeyValue.delete(keyValue);
    } else {
      enter[i] = new EnterNode(parent, data[i]);
    }
  }
  for (i = 0; i < groupLength; ++i) {
    if ((node = group[i]) && nodeByKeyValue.get(keyValues[i]) === node) {
      exit[i] = node;
    }
  }
}
function datum(node) {
  return node.__data__;
}
function data_default(value, key) {
  if (!arguments.length) return Array.from(this, datum);
  var bind = key ? bindKey : bindIndex, parents = this._parents, groups = this._groups;
  if (typeof value !== "function") value = constant_default(value);
  for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j2 = 0; j2 < m; ++j2) {
    var parent = parents[j2], group = groups[j2], groupLength = group.length, data = arraylike(value.call(parent, parent && parent.__data__, j2, parents)), dataLength = data.length, enterGroup = enter[j2] = new Array(dataLength), updateGroup = update[j2] = new Array(dataLength), exitGroup = exit[j2] = new Array(groupLength);
    bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);
    for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
      if (previous = enterGroup[i0]) {
        if (i0 >= i1) i1 = i0 + 1;
        while (!(next = updateGroup[i1]) && ++i1 < dataLength) ;
        previous._next = next || null;
      }
    }
  }
  update = new Selection(update, parents);
  update._enter = enter;
  update._exit = exit;
  return update;
}
function arraylike(data) {
  return typeof data === "object" && "length" in data ? data : Array.from(data);
}

// node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/exit.js
function exit_default() {
  return new Selection(this._exit || this._groups.map(sparse_default), this._parents);
}

// node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/join.js
function join_default(onenter, onupdate, onexit) {
  var enter = this.enter(), update = this, exit = this.exit();
  if (typeof onenter === "function") {
    enter = onenter(enter);
    if (enter) enter = enter.selection();
  } else {
    enter = enter.append(onenter + "");
  }
  if (onupdate != null) {
    update = onupdate(update);
    if (update) update = update.selection();
  }
  if (onexit == null) exit.remove();
  else onexit(exit);
  return enter && update ? enter.merge(update).order() : update;
}

// node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/merge.js
function merge_default(context) {
  var selection2 = context.selection ? context.selection() : context;
  for (var groups0 = this._groups, groups1 = selection2._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j2 = 0; j2 < m; ++j2) {
    for (var group0 = groups0[j2], group1 = groups1[j2], n = group0.length, merge = merges[j2] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group0[i] || group1[i]) {
        merge[i] = node;
      }
    }
  }
  for (; j2 < m0; ++j2) {
    merges[j2] = groups0[j2];
  }
  return new Selection(merges, this._parents);
}

// node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/order.js
function order_default() {
  for (var groups = this._groups, j2 = -1, m = groups.length; ++j2 < m; ) {
    for (var group = groups[j2], i = group.length - 1, next = group[i], node; --i >= 0; ) {
      if (node = group[i]) {
        if (next && node.compareDocumentPosition(next) ^ 4) next.parentNode.insertBefore(node, next);
        next = node;
      }
    }
  }
  return this;
}

// node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/sort.js
function sort_default(compare) {
  if (!compare) compare = ascending;
  function compareNode(a, b) {
    return a && b ? compare(a.__data__, b.__data__) : !a - !b;
  }
  for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j2 = 0; j2 < m; ++j2) {
    for (var group = groups[j2], n = group.length, sortgroup = sortgroups[j2] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        sortgroup[i] = node;
      }
    }
    sortgroup.sort(compareNode);
  }
  return new Selection(sortgroups, this._parents).order();
}
function ascending(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}

// node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/call.js
function call_default() {
  var callback = arguments[0];
  arguments[0] = this;
  callback.apply(null, arguments);
  return this;
}

// node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/nodes.js
function nodes_default() {
  return Array.from(this);
}

// node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/node.js
function node_default() {
  for (var groups = this._groups, j2 = 0, m = groups.length; j2 < m; ++j2) {
    for (var group = groups[j2], i = 0, n = group.length; i < n; ++i) {
      var node = group[i];
      if (node) return node;
    }
  }
  return null;
}

// node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/size.js
function size_default() {
  let size = 0;
  for (const node of this) ++size;
  return size;
}

// node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/empty.js
function empty_default() {
  return !this.node();
}

// node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/each.js
function each_default(callback) {
  for (var groups = this._groups, j2 = 0, m = groups.length; j2 < m; ++j2) {
    for (var group = groups[j2], i = 0, n = group.length, node; i < n; ++i) {
      if (node = group[i]) callback.call(node, node.__data__, i, group);
    }
  }
  return this;
}

// node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/attr.js
function attrRemove(name) {
  return function() {
    this.removeAttribute(name);
  };
}
function attrRemoveNS(fullname) {
  return function() {
    this.removeAttributeNS(fullname.space, fullname.local);
  };
}
function attrConstant(name, value) {
  return function() {
    this.setAttribute(name, value);
  };
}
function attrConstantNS(fullname, value) {
  return function() {
    this.setAttributeNS(fullname.space, fullname.local, value);
  };
}
function attrFunction(name, value) {
  return function() {
    var v2 = value.apply(this, arguments);
    if (v2 == null) this.removeAttribute(name);
    else this.setAttribute(name, v2);
  };
}
function attrFunctionNS(fullname, value) {
  return function() {
    var v2 = value.apply(this, arguments);
    if (v2 == null) this.removeAttributeNS(fullname.space, fullname.local);
    else this.setAttributeNS(fullname.space, fullname.local, v2);
  };
}
function attr_default(name, value) {
  var fullname = namespace_default(name);
  if (arguments.length < 2) {
    var node = this.node();
    return fullname.local ? node.getAttributeNS(fullname.space, fullname.local) : node.getAttribute(fullname);
  }
  return this.each((value == null ? fullname.local ? attrRemoveNS : attrRemove : typeof value === "function" ? fullname.local ? attrFunctionNS : attrFunction : fullname.local ? attrConstantNS : attrConstant)(fullname, value));
}

// node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/window.js
function window_default(node) {
  return node.ownerDocument && node.ownerDocument.defaultView || node.document && node || node.defaultView;
}

// node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/style.js
function styleRemove(name) {
  return function() {
    this.style.removeProperty(name);
  };
}
function styleConstant(name, value, priority) {
  return function() {
    this.style.setProperty(name, value, priority);
  };
}
function styleFunction(name, value, priority) {
  return function() {
    var v2 = value.apply(this, arguments);
    if (v2 == null) this.style.removeProperty(name);
    else this.style.setProperty(name, v2, priority);
  };
}
function style_default(name, value, priority) {
  return arguments.length > 1 ? this.each((value == null ? styleRemove : typeof value === "function" ? styleFunction : styleConstant)(name, value, priority == null ? "" : priority)) : styleValue(this.node(), name);
}
function styleValue(node, name) {
  return node.style.getPropertyValue(name) || window_default(node).getComputedStyle(node, null).getPropertyValue(name);
}

// node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/property.js
function propertyRemove(name) {
  return function() {
    delete this[name];
  };
}
function propertyConstant(name, value) {
  return function() {
    this[name] = value;
  };
}
function propertyFunction(name, value) {
  return function() {
    var v2 = value.apply(this, arguments);
    if (v2 == null) delete this[name];
    else this[name] = v2;
  };
}
function property_default(name, value) {
  return arguments.length > 1 ? this.each((value == null ? propertyRemove : typeof value === "function" ? propertyFunction : propertyConstant)(name, value)) : this.node()[name];
}

// node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/classed.js
function classArray(string) {
  return string.trim().split(/^|\s+/);
}
function classList(node) {
  return node.classList || new ClassList(node);
}
function ClassList(node) {
  this._node = node;
  this._names = classArray(node.getAttribute("class") || "");
}
ClassList.prototype = {
  add: function(name) {
    var i = this._names.indexOf(name);
    if (i < 0) {
      this._names.push(name);
      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  remove: function(name) {
    var i = this._names.indexOf(name);
    if (i >= 0) {
      this._names.splice(i, 1);
      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  contains: function(name) {
    return this._names.indexOf(name) >= 0;
  }
};
function classedAdd(node, names) {
  var list = classList(node), i = -1, n = names.length;
  while (++i < n) list.add(names[i]);
}
function classedRemove(node, names) {
  var list = classList(node), i = -1, n = names.length;
  while (++i < n) list.remove(names[i]);
}
function classedTrue(names) {
  return function() {
    classedAdd(this, names);
  };
}
function classedFalse(names) {
  return function() {
    classedRemove(this, names);
  };
}
function classedFunction(names, value) {
  return function() {
    (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
  };
}
function classed_default(name, value) {
  var names = classArray(name + "");
  if (arguments.length < 2) {
    var list = classList(this.node()), i = -1, n = names.length;
    while (++i < n) if (!list.contains(names[i])) return false;
    return true;
  }
  return this.each((typeof value === "function" ? classedFunction : value ? classedTrue : classedFalse)(names, value));
}

// node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/text.js
function textRemove() {
  this.textContent = "";
}
function textConstant(value) {
  return function() {
    this.textContent = value;
  };
}
function textFunction(value) {
  return function() {
    var v2 = value.apply(this, arguments);
    this.textContent = v2 == null ? "" : v2;
  };
}
function text_default(value) {
  return arguments.length ? this.each(value == null ? textRemove : (typeof value === "function" ? textFunction : textConstant)(value)) : this.node().textContent;
}

// node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/html.js
function htmlRemove() {
  this.innerHTML = "";
}
function htmlConstant(value) {
  return function() {
    this.innerHTML = value;
  };
}
function htmlFunction(value) {
  return function() {
    var v2 = value.apply(this, arguments);
    this.innerHTML = v2 == null ? "" : v2;
  };
}
function html_default(value) {
  return arguments.length ? this.each(value == null ? htmlRemove : (typeof value === "function" ? htmlFunction : htmlConstant)(value)) : this.node().innerHTML;
}

// node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/raise.js
function raise() {
  if (this.nextSibling) this.parentNode.appendChild(this);
}
function raise_default() {
  return this.each(raise);
}

// node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/lower.js
function lower() {
  if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function lower_default() {
  return this.each(lower);
}

// node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/append.js
function append_default(name) {
  var create2 = typeof name === "function" ? name : creator_default(name);
  return this.select(function() {
    return this.appendChild(create2.apply(this, arguments));
  });
}

// node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/insert.js
function constantNull() {
  return null;
}
function insert_default(name, before) {
  var create2 = typeof name === "function" ? name : creator_default(name), select = before == null ? constantNull : typeof before === "function" ? before : selector_default(before);
  return this.select(function() {
    return this.insertBefore(create2.apply(this, arguments), select.apply(this, arguments) || null);
  });
}

// node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/remove.js
function remove() {
  var parent = this.parentNode;
  if (parent) parent.removeChild(this);
}
function remove_default() {
  return this.each(remove);
}

// node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/clone.js
function selection_cloneShallow() {
  var clone = this.cloneNode(false), parent = this.parentNode;
  return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}
function selection_cloneDeep() {
  var clone = this.cloneNode(true), parent = this.parentNode;
  return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}
function clone_default(deep) {
  return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
}

// node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/datum.js
function datum_default(value) {
  return arguments.length ? this.property("__data__", value) : this.node().__data__;
}

// node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/on.js
function contextListener(listener) {
  return function(event) {
    listener.call(this, event, this.__data__);
  };
}
function parseTypenames2(typenames) {
  return typenames.trim().split(/^|\s+/).map(function(t) {
    var name = "", i = t.indexOf(".");
    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
    return { type: t, name };
  });
}
function onRemove(typename) {
  return function() {
    var on2 = this.__on;
    if (!on2) return;
    for (var j2 = 0, i = -1, m = on2.length, o; j2 < m; ++j2) {
      if (o = on2[j2], (!typename.type || o.type === typename.type) && o.name === typename.name) {
        this.removeEventListener(o.type, o.listener, o.options);
      } else {
        on2[++i] = o;
      }
    }
    if (++i) on2.length = i;
    else delete this.__on;
  };
}
function onAdd(typename, value, options) {
  return function() {
    var on2 = this.__on, o, listener = contextListener(value);
    if (on2) for (var j2 = 0, m = on2.length; j2 < m; ++j2) {
      if ((o = on2[j2]).type === typename.type && o.name === typename.name) {
        this.removeEventListener(o.type, o.listener, o.options);
        this.addEventListener(o.type, o.listener = listener, o.options = options);
        o.value = value;
        return;
      }
    }
    this.addEventListener(typename.type, listener, options);
    o = { type: typename.type, name: typename.name, value, listener, options };
    if (!on2) this.__on = [o];
    else on2.push(o);
  };
}
function on_default(typename, value, options) {
  var typenames = parseTypenames2(typename + ""), i, n = typenames.length, t;
  if (arguments.length < 2) {
    var on2 = this.node().__on;
    if (on2) for (var j2 = 0, m = on2.length, o; j2 < m; ++j2) {
      for (i = 0, o = on2[j2]; i < n; ++i) {
        if ((t = typenames[i]).type === o.type && t.name === o.name) {
          return o.value;
        }
      }
    }
    return;
  }
  on2 = value ? onAdd : onRemove;
  for (i = 0; i < n; ++i) this.each(on2(typenames[i], value, options));
  return this;
}

// node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/dispatch.js
function dispatchEvent(node, type2, params) {
  var window2 = window_default(node), event = window2.CustomEvent;
  if (typeof event === "function") {
    event = new event(type2, params);
  } else {
    event = window2.document.createEvent("Event");
    if (params) event.initEvent(type2, params.bubbles, params.cancelable), event.detail = params.detail;
    else event.initEvent(type2, false, false);
  }
  node.dispatchEvent(event);
}
function dispatchConstant(type2, params) {
  return function() {
    return dispatchEvent(this, type2, params);
  };
}
function dispatchFunction(type2, params) {
  return function() {
    return dispatchEvent(this, type2, params.apply(this, arguments));
  };
}
function dispatch_default2(type2, params) {
  return this.each((typeof params === "function" ? dispatchFunction : dispatchConstant)(type2, params));
}

// node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/iterator.js
function* iterator_default() {
  for (var groups = this._groups, j2 = 0, m = groups.length; j2 < m; ++j2) {
    for (var group = groups[j2], i = 0, n = group.length, node; i < n; ++i) {
      if (node = group[i]) yield node;
    }
  }
}

// node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/index.js
var root = [null];
function Selection(groups, parents) {
  this._groups = groups;
  this._parents = parents;
}
function selection() {
  return new Selection([[document.documentElement]], root);
}
function selection_selection() {
  return this;
}
Selection.prototype = selection.prototype = {
  constructor: Selection,
  select: select_default,
  selectAll: selectAll_default,
  selectChild: selectChild_default,
  selectChildren: selectChildren_default,
  filter: filter_default,
  data: data_default,
  enter: enter_default,
  exit: exit_default,
  join: join_default,
  merge: merge_default,
  selection: selection_selection,
  order: order_default,
  sort: sort_default,
  call: call_default,
  nodes: nodes_default,
  node: node_default,
  size: size_default,
  empty: empty_default,
  each: each_default,
  attr: attr_default,
  style: style_default,
  property: property_default,
  classed: classed_default,
  text: text_default,
  html: html_default,
  raise: raise_default,
  lower: lower_default,
  append: append_default,
  insert: insert_default,
  remove: remove_default,
  clone: clone_default,
  datum: datum_default,
  on: on_default,
  dispatch: dispatch_default2,
  [Symbol.iterator]: iterator_default
};
var selection_default = selection;

// node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/select.js
function select_default2(selector) {
  return typeof selector === "string" ? new Selection([[document.querySelector(selector)]], [document.documentElement]) : new Selection([[selector]], root);
}

// node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/sourceEvent.js
function sourceEvent_default(event) {
  let sourceEvent;
  while (sourceEvent = event.sourceEvent) event = sourceEvent;
  return event;
}

// node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/pointer.js
function pointer_default(event, node) {
  event = sourceEvent_default(event);
  if (node === void 0) node = event.currentTarget;
  if (node) {
    var svg = node.ownerSVGElement || node;
    if (svg.createSVGPoint) {
      var point = svg.createSVGPoint();
      point.x = event.clientX, point.y = event.clientY;
      point = point.matrixTransform(node.getScreenCTM().inverse());
      return [point.x, point.y];
    }
    if (node.getBoundingClientRect) {
      var rect = node.getBoundingClientRect();
      return [event.clientX - rect.left - node.clientLeft, event.clientY - rect.top - node.clientTop];
    }
  }
  return [event.pageX, event.pageY];
}

// node_modules/.pnpm/d3-drag@3.0.0/node_modules/d3-drag/src/noevent.js
var nonpassivecapture = { capture: true, passive: false };
function noevent_default(event) {
  event.preventDefault();
  event.stopImmediatePropagation();
}

// node_modules/.pnpm/d3-drag@3.0.0/node_modules/d3-drag/src/nodrag.js
function nodrag_default(view) {
  var root2 = view.document.documentElement, selection2 = select_default2(view).on("dragstart.drag", noevent_default, nonpassivecapture);
  if ("onselectstart" in root2) {
    selection2.on("selectstart.drag", noevent_default, nonpassivecapture);
  } else {
    root2.__noselect = root2.style.MozUserSelect;
    root2.style.MozUserSelect = "none";
  }
}
function yesdrag(view, noclick) {
  var root2 = view.document.documentElement, selection2 = select_default2(view).on("dragstart.drag", null);
  if (noclick) {
    selection2.on("click.drag", noevent_default, nonpassivecapture);
    setTimeout(function() {
      selection2.on("click.drag", null);
    }, 0);
  }
  if ("onselectstart" in root2) {
    selection2.on("selectstart.drag", null);
  } else {
    root2.style.MozUserSelect = root2.__noselect;
    delete root2.__noselect;
  }
}

// node_modules/.pnpm/d3-color@3.1.0/node_modules/d3-color/src/define.js
function define_default(constructor, factory, prototype) {
  constructor.prototype = factory.prototype = prototype;
  prototype.constructor = constructor;
}
function extend(parent, definition) {
  var prototype = Object.create(parent.prototype);
  for (var key in definition) prototype[key] = definition[key];
  return prototype;
}

// node_modules/.pnpm/d3-color@3.1.0/node_modules/d3-color/src/color.js
function Color() {
}
var darker = 0.7;
var brighter = 1 / darker;
var reI = "\\s*([+-]?\\d+)\\s*";
var reN = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*";
var reP = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*";
var reHex = /^#([0-9a-f]{3,8})$/;
var reRgbInteger = new RegExp(`^rgb\\(${reI},${reI},${reI}\\)$`);
var reRgbPercent = new RegExp(`^rgb\\(${reP},${reP},${reP}\\)$`);
var reRgbaInteger = new RegExp(`^rgba\\(${reI},${reI},${reI},${reN}\\)$`);
var reRgbaPercent = new RegExp(`^rgba\\(${reP},${reP},${reP},${reN}\\)$`);
var reHslPercent = new RegExp(`^hsl\\(${reN},${reP},${reP}\\)$`);
var reHslaPercent = new RegExp(`^hsla\\(${reN},${reP},${reP},${reN}\\)$`);
var named = {
  aliceblue: 15792383,
  antiquewhite: 16444375,
  aqua: 65535,
  aquamarine: 8388564,
  azure: 15794175,
  beige: 16119260,
  bisque: 16770244,
  black: 0,
  blanchedalmond: 16772045,
  blue: 255,
  blueviolet: 9055202,
  brown: 10824234,
  burlywood: 14596231,
  cadetblue: 6266528,
  chartreuse: 8388352,
  chocolate: 13789470,
  coral: 16744272,
  cornflowerblue: 6591981,
  cornsilk: 16775388,
  crimson: 14423100,
  cyan: 65535,
  darkblue: 139,
  darkcyan: 35723,
  darkgoldenrod: 12092939,
  darkgray: 11119017,
  darkgreen: 25600,
  darkgrey: 11119017,
  darkkhaki: 12433259,
  darkmagenta: 9109643,
  darkolivegreen: 5597999,
  darkorange: 16747520,
  darkorchid: 10040012,
  darkred: 9109504,
  darksalmon: 15308410,
  darkseagreen: 9419919,
  darkslateblue: 4734347,
  darkslategray: 3100495,
  darkslategrey: 3100495,
  darkturquoise: 52945,
  darkviolet: 9699539,
  deeppink: 16716947,
  deepskyblue: 49151,
  dimgray: 6908265,
  dimgrey: 6908265,
  dodgerblue: 2003199,
  firebrick: 11674146,
  floralwhite: 16775920,
  forestgreen: 2263842,
  fuchsia: 16711935,
  gainsboro: 14474460,
  ghostwhite: 16316671,
  gold: 16766720,
  goldenrod: 14329120,
  gray: 8421504,
  green: 32768,
  greenyellow: 11403055,
  grey: 8421504,
  honeydew: 15794160,
  hotpink: 16738740,
  indianred: 13458524,
  indigo: 4915330,
  ivory: 16777200,
  khaki: 15787660,
  lavender: 15132410,
  lavenderblush: 16773365,
  lawngreen: 8190976,
  lemonchiffon: 16775885,
  lightblue: 11393254,
  lightcoral: 15761536,
  lightcyan: 14745599,
  lightgoldenrodyellow: 16448210,
  lightgray: 13882323,
  lightgreen: 9498256,
  lightgrey: 13882323,
  lightpink: 16758465,
  lightsalmon: 16752762,
  lightseagreen: 2142890,
  lightskyblue: 8900346,
  lightslategray: 7833753,
  lightslategrey: 7833753,
  lightsteelblue: 11584734,
  lightyellow: 16777184,
  lime: 65280,
  limegreen: 3329330,
  linen: 16445670,
  magenta: 16711935,
  maroon: 8388608,
  mediumaquamarine: 6737322,
  mediumblue: 205,
  mediumorchid: 12211667,
  mediumpurple: 9662683,
  mediumseagreen: 3978097,
  mediumslateblue: 8087790,
  mediumspringgreen: 64154,
  mediumturquoise: 4772300,
  mediumvioletred: 13047173,
  midnightblue: 1644912,
  mintcream: 16121850,
  mistyrose: 16770273,
  moccasin: 16770229,
  navajowhite: 16768685,
  navy: 128,
  oldlace: 16643558,
  olive: 8421376,
  olivedrab: 7048739,
  orange: 16753920,
  orangered: 16729344,
  orchid: 14315734,
  palegoldenrod: 15657130,
  palegreen: 10025880,
  paleturquoise: 11529966,
  palevioletred: 14381203,
  papayawhip: 16773077,
  peachpuff: 16767673,
  peru: 13468991,
  pink: 16761035,
  plum: 14524637,
  powderblue: 11591910,
  purple: 8388736,
  rebeccapurple: 6697881,
  red: 16711680,
  rosybrown: 12357519,
  royalblue: 4286945,
  saddlebrown: 9127187,
  salmon: 16416882,
  sandybrown: 16032864,
  seagreen: 3050327,
  seashell: 16774638,
  sienna: 10506797,
  silver: 12632256,
  skyblue: 8900331,
  slateblue: 6970061,
  slategray: 7372944,
  slategrey: 7372944,
  snow: 16775930,
  springgreen: 65407,
  steelblue: 4620980,
  tan: 13808780,
  teal: 32896,
  thistle: 14204888,
  tomato: 16737095,
  turquoise: 4251856,
  violet: 15631086,
  wheat: 16113331,
  white: 16777215,
  whitesmoke: 16119285,
  yellow: 16776960,
  yellowgreen: 10145074
};
define_default(Color, color, {
  copy(channels) {
    return Object.assign(new this.constructor(), this, channels);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: color_formatHex,
  // Deprecated! Use color.formatHex.
  formatHex: color_formatHex,
  formatHex8: color_formatHex8,
  formatHsl: color_formatHsl,
  formatRgb: color_formatRgb,
  toString: color_formatRgb
});
function color_formatHex() {
  return this.rgb().formatHex();
}
function color_formatHex8() {
  return this.rgb().formatHex8();
}
function color_formatHsl() {
  return hslConvert(this).formatHsl();
}
function color_formatRgb() {
  return this.rgb().formatRgb();
}
function color(format) {
  var m, l;
  format = (format + "").trim().toLowerCase();
  return (m = reHex.exec(format)) ? (l = m[1].length, m = parseInt(m[1], 16), l === 6 ? rgbn(m) : l === 3 ? new Rgb(m >> 8 & 15 | m >> 4 & 240, m >> 4 & 15 | m & 240, (m & 15) << 4 | m & 15, 1) : l === 8 ? rgba(m >> 24 & 255, m >> 16 & 255, m >> 8 & 255, (m & 255) / 255) : l === 4 ? rgba(m >> 12 & 15 | m >> 8 & 240, m >> 8 & 15 | m >> 4 & 240, m >> 4 & 15 | m & 240, ((m & 15) << 4 | m & 15) / 255) : null) : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) : named.hasOwnProperty(format) ? rgbn(named[format]) : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0) : null;
}
function rgbn(n) {
  return new Rgb(n >> 16 & 255, n >> 8 & 255, n & 255, 1);
}
function rgba(r, g, b, a) {
  if (a <= 0) r = g = b = NaN;
  return new Rgb(r, g, b, a);
}
function rgbConvert(o) {
  if (!(o instanceof Color)) o = color(o);
  if (!o) return new Rgb();
  o = o.rgb();
  return new Rgb(o.r, o.g, o.b, o.opacity);
}
function rgb(r, g, b, opacity) {
  return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
}
function Rgb(r, g, b, opacity) {
  this.r = +r;
  this.g = +g;
  this.b = +b;
  this.opacity = +opacity;
}
define_default(Rgb, rgb, extend(Color, {
  brighter(k2) {
    k2 = k2 == null ? brighter : Math.pow(brighter, k2);
    return new Rgb(this.r * k2, this.g * k2, this.b * k2, this.opacity);
  },
  darker(k2) {
    k2 = k2 == null ? darker : Math.pow(darker, k2);
    return new Rgb(this.r * k2, this.g * k2, this.b * k2, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new Rgb(clampi(this.r), clampi(this.g), clampi(this.b), clampa(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && (-0.5 <= this.g && this.g < 255.5) && (-0.5 <= this.b && this.b < 255.5) && (0 <= this.opacity && this.opacity <= 1);
  },
  hex: rgb_formatHex,
  // Deprecated! Use color.formatHex.
  formatHex: rgb_formatHex,
  formatHex8: rgb_formatHex8,
  formatRgb: rgb_formatRgb,
  toString: rgb_formatRgb
}));
function rgb_formatHex() {
  return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}`;
}
function rgb_formatHex8() {
  return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}${hex((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function rgb_formatRgb() {
  const a = clampa(this.opacity);
  return `${a === 1 ? "rgb(" : "rgba("}${clampi(this.r)}, ${clampi(this.g)}, ${clampi(this.b)}${a === 1 ? ")" : `, ${a})`}`;
}
function clampa(opacity) {
  return isNaN(opacity) ? 1 : Math.max(0, Math.min(1, opacity));
}
function clampi(value) {
  return Math.max(0, Math.min(255, Math.round(value) || 0));
}
function hex(value) {
  value = clampi(value);
  return (value < 16 ? "0" : "") + value.toString(16);
}
function hsla(h, s, l, a) {
  if (a <= 0) h = s = l = NaN;
  else if (l <= 0 || l >= 1) h = s = NaN;
  else if (s <= 0) h = NaN;
  return new Hsl(h, s, l, a);
}
function hslConvert(o) {
  if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
  if (!(o instanceof Color)) o = color(o);
  if (!o) return new Hsl();
  if (o instanceof Hsl) return o;
  o = o.rgb();
  var r = o.r / 255, g = o.g / 255, b = o.b / 255, min2 = Math.min(r, g, b), max2 = Math.max(r, g, b), h = NaN, s = max2 - min2, l = (max2 + min2) / 2;
  if (s) {
    if (r === max2) h = (g - b) / s + (g < b) * 6;
    else if (g === max2) h = (b - r) / s + 2;
    else h = (r - g) / s + 4;
    s /= l < 0.5 ? max2 + min2 : 2 - max2 - min2;
    h *= 60;
  } else {
    s = l > 0 && l < 1 ? 0 : h;
  }
  return new Hsl(h, s, l, o.opacity);
}
function hsl(h, s, l, opacity) {
  return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
}
function Hsl(h, s, l, opacity) {
  this.h = +h;
  this.s = +s;
  this.l = +l;
  this.opacity = +opacity;
}
define_default(Hsl, hsl, extend(Color, {
  brighter(k2) {
    k2 = k2 == null ? brighter : Math.pow(brighter, k2);
    return new Hsl(this.h, this.s, this.l * k2, this.opacity);
  },
  darker(k2) {
    k2 = k2 == null ? darker : Math.pow(darker, k2);
    return new Hsl(this.h, this.s, this.l * k2, this.opacity);
  },
  rgb() {
    var h = this.h % 360 + (this.h < 0) * 360, s = isNaN(h) || isNaN(this.s) ? 0 : this.s, l = this.l, m2 = l + (l < 0.5 ? l : 1 - l) * s, m1 = 2 * l - m2;
    return new Rgb(
      hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
      hsl2rgb(h, m1, m2),
      hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2),
      this.opacity
    );
  },
  clamp() {
    return new Hsl(clamph(this.h), clampt(this.s), clampt(this.l), clampa(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && (0 <= this.l && this.l <= 1) && (0 <= this.opacity && this.opacity <= 1);
  },
  formatHsl() {
    const a = clampa(this.opacity);
    return `${a === 1 ? "hsl(" : "hsla("}${clamph(this.h)}, ${clampt(this.s) * 100}%, ${clampt(this.l) * 100}%${a === 1 ? ")" : `, ${a})`}`;
  }
}));
function clamph(value) {
  value = (value || 0) % 360;
  return value < 0 ? value + 360 : value;
}
function clampt(value) {
  return Math.max(0, Math.min(1, value || 0));
}
function hsl2rgb(h, m1, m2) {
  return (h < 60 ? m1 + (m2 - m1) * h / 60 : h < 180 ? m2 : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60 : m1) * 255;
}

// node_modules/.pnpm/d3-interpolate@3.0.1/node_modules/d3-interpolate/src/basis.js
function basis(t1, v0, v1, v2, v3) {
  var t2 = t1 * t1, t3 = t2 * t1;
  return ((1 - 3 * t1 + 3 * t2 - t3) * v0 + (4 - 6 * t2 + 3 * t3) * v1 + (1 + 3 * t1 + 3 * t2 - 3 * t3) * v2 + t3 * v3) / 6;
}
function basis_default(values) {
  var n = values.length - 1;
  return function(t) {
    var i = t <= 0 ? t = 0 : t >= 1 ? (t = 1, n - 1) : Math.floor(t * n), v1 = values[i], v2 = values[i + 1], v0 = i > 0 ? values[i - 1] : 2 * v1 - v2, v3 = i < n - 1 ? values[i + 2] : 2 * v2 - v1;
    return basis((t - i / n) * n, v0, v1, v2, v3);
  };
}

// node_modules/.pnpm/d3-interpolate@3.0.1/node_modules/d3-interpolate/src/basisClosed.js
function basisClosed_default(values) {
  var n = values.length;
  return function(t) {
    var i = Math.floor(((t %= 1) < 0 ? ++t : t) * n), v0 = values[(i + n - 1) % n], v1 = values[i % n], v2 = values[(i + 1) % n], v3 = values[(i + 2) % n];
    return basis((t - i / n) * n, v0, v1, v2, v3);
  };
}

// node_modules/.pnpm/d3-interpolate@3.0.1/node_modules/d3-interpolate/src/constant.js
var constant_default2 = (x2) => () => x2;

// node_modules/.pnpm/d3-interpolate@3.0.1/node_modules/d3-interpolate/src/color.js
function linear(a, d) {
  return function(t) {
    return a + t * d;
  };
}
function exponential(a, b, y) {
  return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
    return Math.pow(a + t * b, y);
  };
}
function gamma(y) {
  return (y = +y) === 1 ? nogamma : function(a, b) {
    return b - a ? exponential(a, b, y) : constant_default2(isNaN(a) ? b : a);
  };
}
function nogamma(a, b) {
  var d = b - a;
  return d ? linear(a, d) : constant_default2(isNaN(a) ? b : a);
}

// node_modules/.pnpm/d3-interpolate@3.0.1/node_modules/d3-interpolate/src/rgb.js
var rgb_default = (function rgbGamma(y) {
  var color2 = gamma(y);
  function rgb2(start2, end) {
    var r = color2((start2 = rgb(start2)).r, (end = rgb(end)).r), g = color2(start2.g, end.g), b = color2(start2.b, end.b), opacity = nogamma(start2.opacity, end.opacity);
    return function(t) {
      start2.r = r(t);
      start2.g = g(t);
      start2.b = b(t);
      start2.opacity = opacity(t);
      return start2 + "";
    };
  }
  rgb2.gamma = rgbGamma;
  return rgb2;
})(1);
function rgbSpline(spline) {
  return function(colors) {
    var n = colors.length, r = new Array(n), g = new Array(n), b = new Array(n), i, color2;
    for (i = 0; i < n; ++i) {
      color2 = rgb(colors[i]);
      r[i] = color2.r || 0;
      g[i] = color2.g || 0;
      b[i] = color2.b || 0;
    }
    r = spline(r);
    g = spline(g);
    b = spline(b);
    color2.opacity = 1;
    return function(t) {
      color2.r = r(t);
      color2.g = g(t);
      color2.b = b(t);
      return color2 + "";
    };
  };
}
var rgbBasis = rgbSpline(basis_default);
var rgbBasisClosed = rgbSpline(basisClosed_default);

// node_modules/.pnpm/d3-interpolate@3.0.1/node_modules/d3-interpolate/src/number.js
function number_default(a, b) {
  return a = +a, b = +b, function(t) {
    return a * (1 - t) + b * t;
  };
}

// node_modules/.pnpm/d3-interpolate@3.0.1/node_modules/d3-interpolate/src/string.js
var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g;
var reB = new RegExp(reA.source, "g");
function zero(b) {
  return function() {
    return b;
  };
}
function one(b) {
  return function(t) {
    return b(t) + "";
  };
}
function string_default(a, b) {
  var bi = reA.lastIndex = reB.lastIndex = 0, am, bm, bs, i = -1, s = [], q2 = [];
  a = a + "", b = b + "";
  while ((am = reA.exec(a)) && (bm = reB.exec(b))) {
    if ((bs = bm.index) > bi) {
      bs = b.slice(bi, bs);
      if (s[i]) s[i] += bs;
      else s[++i] = bs;
    }
    if ((am = am[0]) === (bm = bm[0])) {
      if (s[i]) s[i] += bm;
      else s[++i] = bm;
    } else {
      s[++i] = null;
      q2.push({ i, x: number_default(am, bm) });
    }
    bi = reB.lastIndex;
  }
  if (bi < b.length) {
    bs = b.slice(bi);
    if (s[i]) s[i] += bs;
    else s[++i] = bs;
  }
  return s.length < 2 ? q2[0] ? one(q2[0].x) : zero(b) : (b = q2.length, function(t) {
    for (var i2 = 0, o; i2 < b; ++i2) s[(o = q2[i2]).i] = o.x(t);
    return s.join("");
  });
}

// node_modules/.pnpm/d3-interpolate@3.0.1/node_modules/d3-interpolate/src/transform/decompose.js
var degrees = 180 / Math.PI;
var identity = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function decompose_default(a, b, c, d, e, f) {
  var scaleX, scaleY, skewX;
  if (scaleX = Math.sqrt(a * a + b * b)) a /= scaleX, b /= scaleX;
  if (skewX = a * c + b * d) c -= a * skewX, d -= b * skewX;
  if (scaleY = Math.sqrt(c * c + d * d)) c /= scaleY, d /= scaleY, skewX /= scaleY;
  if (a * d < b * c) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
  return {
    translateX: e,
    translateY: f,
    rotate: Math.atan2(b, a) * degrees,
    skewX: Math.atan(skewX) * degrees,
    scaleX,
    scaleY
  };
}

// node_modules/.pnpm/d3-interpolate@3.0.1/node_modules/d3-interpolate/src/transform/parse.js
var svgNode;
function parseCss(value) {
  const m = new (typeof DOMMatrix === "function" ? DOMMatrix : WebKitCSSMatrix)(value + "");
  return m.isIdentity ? identity : decompose_default(m.a, m.b, m.c, m.d, m.e, m.f);
}
function parseSvg(value) {
  if (value == null) return identity;
  if (!svgNode) svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
  svgNode.setAttribute("transform", value);
  if (!(value = svgNode.transform.baseVal.consolidate())) return identity;
  value = value.matrix;
  return decompose_default(value.a, value.b, value.c, value.d, value.e, value.f);
}

// node_modules/.pnpm/d3-interpolate@3.0.1/node_modules/d3-interpolate/src/transform/index.js
function interpolateTransform(parse, pxComma, pxParen, degParen) {
  function pop(s) {
    return s.length ? s.pop() + " " : "";
  }
  function translate(xa, ya, xb, yb, s, q2) {
    if (xa !== xb || ya !== yb) {
      var i = s.push("translate(", null, pxComma, null, pxParen);
      q2.push({ i: i - 4, x: number_default(xa, xb) }, { i: i - 2, x: number_default(ya, yb) });
    } else if (xb || yb) {
      s.push("translate(" + xb + pxComma + yb + pxParen);
    }
  }
  function rotate(a, b, s, q2) {
    if (a !== b) {
      if (a - b > 180) b += 360;
      else if (b - a > 180) a += 360;
      q2.push({ i: s.push(pop(s) + "rotate(", null, degParen) - 2, x: number_default(a, b) });
    } else if (b) {
      s.push(pop(s) + "rotate(" + b + degParen);
    }
  }
  function skewX(a, b, s, q2) {
    if (a !== b) {
      q2.push({ i: s.push(pop(s) + "skewX(", null, degParen) - 2, x: number_default(a, b) });
    } else if (b) {
      s.push(pop(s) + "skewX(" + b + degParen);
    }
  }
  function scale(xa, ya, xb, yb, s, q2) {
    if (xa !== xb || ya !== yb) {
      var i = s.push(pop(s) + "scale(", null, ",", null, ")");
      q2.push({ i: i - 4, x: number_default(xa, xb) }, { i: i - 2, x: number_default(ya, yb) });
    } else if (xb !== 1 || yb !== 1) {
      s.push(pop(s) + "scale(" + xb + "," + yb + ")");
    }
  }
  return function(a, b) {
    var s = [], q2 = [];
    a = parse(a), b = parse(b);
    translate(a.translateX, a.translateY, b.translateX, b.translateY, s, q2);
    rotate(a.rotate, b.rotate, s, q2);
    skewX(a.skewX, b.skewX, s, q2);
    scale(a.scaleX, a.scaleY, b.scaleX, b.scaleY, s, q2);
    a = b = null;
    return function(t) {
      var i = -1, n = q2.length, o;
      while (++i < n) s[(o = q2[i]).i] = o.x(t);
      return s.join("");
    };
  };
}
var interpolateTransformCss = interpolateTransform(parseCss, "px, ", "px)", "deg)");
var interpolateTransformSvg = interpolateTransform(parseSvg, ", ", ")", ")");

// node_modules/.pnpm/d3-interpolate@3.0.1/node_modules/d3-interpolate/src/zoom.js
var epsilon2 = 1e-12;
function cosh(x2) {
  return ((x2 = Math.exp(x2)) + 1 / x2) / 2;
}
function sinh(x2) {
  return ((x2 = Math.exp(x2)) - 1 / x2) / 2;
}
function tanh(x2) {
  return ((x2 = Math.exp(2 * x2)) - 1) / (x2 + 1);
}
var zoom_default = (function zoomRho(rho, rho2, rho4) {
  function zoom(p0, p1) {
    var ux0 = p0[0], uy0 = p0[1], w0 = p0[2], ux1 = p1[0], uy1 = p1[1], w1 = p1[2], dx = ux1 - ux0, dy = uy1 - uy0, d2 = dx * dx + dy * dy, i, S2;
    if (d2 < epsilon2) {
      S2 = Math.log(w1 / w0) / rho;
      i = function(t) {
        return [
          ux0 + t * dx,
          uy0 + t * dy,
          w0 * Math.exp(rho * t * S2)
        ];
      };
    } else {
      var d1 = Math.sqrt(d2), b0 = (w1 * w1 - w0 * w0 + rho4 * d2) / (2 * w0 * rho2 * d1), b1 = (w1 * w1 - w0 * w0 - rho4 * d2) / (2 * w1 * rho2 * d1), r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0), r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
      S2 = (r1 - r0) / rho;
      i = function(t) {
        var s = t * S2, coshr0 = cosh(r0), u = w0 / (rho2 * d1) * (coshr0 * tanh(rho * s + r0) - sinh(r0));
        return [
          ux0 + u * dx,
          uy0 + u * dy,
          w0 * coshr0 / cosh(rho * s + r0)
        ];
      };
    }
    i.duration = S2 * 1e3 * rho / Math.SQRT2;
    return i;
  }
  zoom.rho = function(_2) {
    var _1 = Math.max(1e-3, +_2), _22 = _1 * _1, _4 = _22 * _22;
    return zoomRho(_1, _22, _4);
  };
  return zoom;
})(Math.SQRT2, 2, 4);

// node_modules/.pnpm/d3-timer@3.0.1/node_modules/d3-timer/src/timer.js
var frame = 0;
var timeout = 0;
var interval = 0;
var pokeDelay = 1e3;
var taskHead;
var taskTail;
var clockLast = 0;
var clockNow = 0;
var clockSkew = 0;
var clock = typeof performance === "object" && performance.now ? performance : Date;
var setFrame = typeof window === "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(f) {
  setTimeout(f, 17);
};
function now() {
  return clockNow || (setFrame(clearNow), clockNow = clock.now() + clockSkew);
}
function clearNow() {
  clockNow = 0;
}
function Timer() {
  this._call = this._time = this._next = null;
}
Timer.prototype = timer.prototype = {
  constructor: Timer,
  restart: function(callback, delay, time) {
    if (typeof callback !== "function") throw new TypeError("callback is not a function");
    time = (time == null ? now() : +time) + (delay == null ? 0 : +delay);
    if (!this._next && taskTail !== this) {
      if (taskTail) taskTail._next = this;
      else taskHead = this;
      taskTail = this;
    }
    this._call = callback;
    this._time = time;
    sleep();
  },
  stop: function() {
    if (this._call) {
      this._call = null;
      this._time = Infinity;
      sleep();
    }
  }
};
function timer(callback, delay, time) {
  var t = new Timer();
  t.restart(callback, delay, time);
  return t;
}
function timerFlush() {
  now();
  ++frame;
  var t = taskHead, e;
  while (t) {
    if ((e = clockNow - t._time) >= 0) t._call.call(void 0, e);
    t = t._next;
  }
  --frame;
}
function wake() {
  clockNow = (clockLast = clock.now()) + clockSkew;
  frame = timeout = 0;
  try {
    timerFlush();
  } finally {
    frame = 0;
    nap();
    clockNow = 0;
  }
}
function poke() {
  var now2 = clock.now(), delay = now2 - clockLast;
  if (delay > pokeDelay) clockSkew -= delay, clockLast = now2;
}
function nap() {
  var t0, t1 = taskHead, t2, time = Infinity;
  while (t1) {
    if (t1._call) {
      if (time > t1._time) time = t1._time;
      t0 = t1, t1 = t1._next;
    } else {
      t2 = t1._next, t1._next = null;
      t1 = t0 ? t0._next = t2 : taskHead = t2;
    }
  }
  taskTail = t0;
  sleep(time);
}
function sleep(time) {
  if (frame) return;
  if (timeout) timeout = clearTimeout(timeout);
  var delay = time - clockNow;
  if (delay > 24) {
    if (time < Infinity) timeout = setTimeout(wake, time - clock.now() - clockSkew);
    if (interval) interval = clearInterval(interval);
  } else {
    if (!interval) clockLast = clock.now(), interval = setInterval(poke, pokeDelay);
    frame = 1, setFrame(wake);
  }
}

// node_modules/.pnpm/d3-timer@3.0.1/node_modules/d3-timer/src/timeout.js
function timeout_default(callback, delay, time) {
  var t = new Timer();
  delay = delay == null ? 0 : +delay;
  t.restart((elapsed) => {
    t.stop();
    callback(elapsed + delay);
  }, delay, time);
  return t;
}

// node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/schedule.js
var emptyOn = dispatch_default("start", "end", "cancel", "interrupt");
var emptyTween = [];
var CREATED = 0;
var SCHEDULED = 1;
var STARTING = 2;
var STARTED = 3;
var RUNNING = 4;
var ENDING = 5;
var ENDED = 6;
function schedule_default(node, name, id2, index, group, timing) {
  var schedules = node.__transition;
  if (!schedules) node.__transition = {};
  else if (id2 in schedules) return;
  create(node, id2, {
    name,
    index,
    // For context during callback.
    group,
    // For context during callback.
    on: emptyOn,
    tween: emptyTween,
    time: timing.time,
    delay: timing.delay,
    duration: timing.duration,
    ease: timing.ease,
    timer: null,
    state: CREATED
  });
}
function init(node, id2) {
  var schedule = get2(node, id2);
  if (schedule.state > CREATED) throw new Error("too late; already scheduled");
  return schedule;
}
function set2(node, id2) {
  var schedule = get2(node, id2);
  if (schedule.state > STARTED) throw new Error("too late; already running");
  return schedule;
}
function get2(node, id2) {
  var schedule = node.__transition;
  if (!schedule || !(schedule = schedule[id2])) throw new Error("transition not found");
  return schedule;
}
function create(node, id2, self) {
  var schedules = node.__transition, tween;
  schedules[id2] = self;
  self.timer = timer(schedule, 0, self.time);
  function schedule(elapsed) {
    self.state = SCHEDULED;
    self.timer.restart(start2, self.delay, self.time);
    if (self.delay <= elapsed) start2(elapsed - self.delay);
  }
  function start2(elapsed) {
    var i, j2, n, o;
    if (self.state !== SCHEDULED) return stop();
    for (i in schedules) {
      o = schedules[i];
      if (o.name !== self.name) continue;
      if (o.state === STARTED) return timeout_default(start2);
      if (o.state === RUNNING) {
        o.state = ENDED;
        o.timer.stop();
        o.on.call("interrupt", node, node.__data__, o.index, o.group);
        delete schedules[i];
      } else if (+i < id2) {
        o.state = ENDED;
        o.timer.stop();
        o.on.call("cancel", node, node.__data__, o.index, o.group);
        delete schedules[i];
      }
    }
    timeout_default(function() {
      if (self.state === STARTED) {
        self.state = RUNNING;
        self.timer.restart(tick, self.delay, self.time);
        tick(elapsed);
      }
    });
    self.state = STARTING;
    self.on.call("start", node, node.__data__, self.index, self.group);
    if (self.state !== STARTING) return;
    self.state = STARTED;
    tween = new Array(n = self.tween.length);
    for (i = 0, j2 = -1; i < n; ++i) {
      if (o = self.tween[i].value.call(node, node.__data__, self.index, self.group)) {
        tween[++j2] = o;
      }
    }
    tween.length = j2 + 1;
  }
  function tick(elapsed) {
    var t = elapsed < self.duration ? self.ease.call(null, elapsed / self.duration) : (self.timer.restart(stop), self.state = ENDING, 1), i = -1, n = tween.length;
    while (++i < n) {
      tween[i].call(node, t);
    }
    if (self.state === ENDING) {
      self.on.call("end", node, node.__data__, self.index, self.group);
      stop();
    }
  }
  function stop() {
    self.state = ENDED;
    self.timer.stop();
    delete schedules[id2];
    for (var i in schedules) return;
    delete node.__transition;
  }
}

// node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/interrupt.js
function interrupt_default(node, name) {
  var schedules = node.__transition, schedule, active, empty2 = true, i;
  if (!schedules) return;
  name = name == null ? null : name + "";
  for (i in schedules) {
    if ((schedule = schedules[i]).name !== name) {
      empty2 = false;
      continue;
    }
    active = schedule.state > STARTING && schedule.state < ENDING;
    schedule.state = ENDED;
    schedule.timer.stop();
    schedule.on.call(active ? "interrupt" : "cancel", node, node.__data__, schedule.index, schedule.group);
    delete schedules[i];
  }
  if (empty2) delete node.__transition;
}

// node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/selection/interrupt.js
function interrupt_default2(name) {
  return this.each(function() {
    interrupt_default(this, name);
  });
}

// node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/tween.js
function tweenRemove(id2, name) {
  var tween0, tween1;
  return function() {
    var schedule = set2(this, id2), tween = schedule.tween;
    if (tween !== tween0) {
      tween1 = tween0 = tween;
      for (var i = 0, n = tween1.length; i < n; ++i) {
        if (tween1[i].name === name) {
          tween1 = tween1.slice();
          tween1.splice(i, 1);
          break;
        }
      }
    }
    schedule.tween = tween1;
  };
}
function tweenFunction(id2, name, value) {
  var tween0, tween1;
  if (typeof value !== "function") throw new Error();
  return function() {
    var schedule = set2(this, id2), tween = schedule.tween;
    if (tween !== tween0) {
      tween1 = (tween0 = tween).slice();
      for (var t = { name, value }, i = 0, n = tween1.length; i < n; ++i) {
        if (tween1[i].name === name) {
          tween1[i] = t;
          break;
        }
      }
      if (i === n) tween1.push(t);
    }
    schedule.tween = tween1;
  };
}
function tween_default(name, value) {
  var id2 = this._id;
  name += "";
  if (arguments.length < 2) {
    var tween = get2(this.node(), id2).tween;
    for (var i = 0, n = tween.length, t; i < n; ++i) {
      if ((t = tween[i]).name === name) {
        return t.value;
      }
    }
    return null;
  }
  return this.each((value == null ? tweenRemove : tweenFunction)(id2, name, value));
}
function tweenValue(transition2, name, value) {
  var id2 = transition2._id;
  transition2.each(function() {
    var schedule = set2(this, id2);
    (schedule.value || (schedule.value = {}))[name] = value.apply(this, arguments);
  });
  return function(node) {
    return get2(node, id2).value[name];
  };
}

// node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/interpolate.js
function interpolate_default(a, b) {
  var c;
  return (typeof b === "number" ? number_default : b instanceof color ? rgb_default : (c = color(b)) ? (b = c, rgb_default) : string_default)(a, b);
}

// node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/attr.js
function attrRemove2(name) {
  return function() {
    this.removeAttribute(name);
  };
}
function attrRemoveNS2(fullname) {
  return function() {
    this.removeAttributeNS(fullname.space, fullname.local);
  };
}
function attrConstant2(name, interpolate, value1) {
  var string00, string1 = value1 + "", interpolate0;
  return function() {
    var string0 = this.getAttribute(name);
    return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate(string00 = string0, value1);
  };
}
function attrConstantNS2(fullname, interpolate, value1) {
  var string00, string1 = value1 + "", interpolate0;
  return function() {
    var string0 = this.getAttributeNS(fullname.space, fullname.local);
    return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate(string00 = string0, value1);
  };
}
function attrFunction2(name, interpolate, value) {
  var string00, string10, interpolate0;
  return function() {
    var string0, value1 = value(this), string1;
    if (value1 == null) return void this.removeAttribute(name);
    string0 = this.getAttribute(name);
    string1 = value1 + "";
    return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
  };
}
function attrFunctionNS2(fullname, interpolate, value) {
  var string00, string10, interpolate0;
  return function() {
    var string0, value1 = value(this), string1;
    if (value1 == null) return void this.removeAttributeNS(fullname.space, fullname.local);
    string0 = this.getAttributeNS(fullname.space, fullname.local);
    string1 = value1 + "";
    return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
  };
}
function attr_default2(name, value) {
  var fullname = namespace_default(name), i = fullname === "transform" ? interpolateTransformSvg : interpolate_default;
  return this.attrTween(name, typeof value === "function" ? (fullname.local ? attrFunctionNS2 : attrFunction2)(fullname, i, tweenValue(this, "attr." + name, value)) : value == null ? (fullname.local ? attrRemoveNS2 : attrRemove2)(fullname) : (fullname.local ? attrConstantNS2 : attrConstant2)(fullname, i, value));
}

// node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/attrTween.js
function attrInterpolate(name, i) {
  return function(t) {
    this.setAttribute(name, i.call(this, t));
  };
}
function attrInterpolateNS(fullname, i) {
  return function(t) {
    this.setAttributeNS(fullname.space, fullname.local, i.call(this, t));
  };
}
function attrTweenNS(fullname, value) {
  var t0, i0;
  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0) t0 = (i0 = i) && attrInterpolateNS(fullname, i);
    return t0;
  }
  tween._value = value;
  return tween;
}
function attrTween(name, value) {
  var t0, i0;
  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0) t0 = (i0 = i) && attrInterpolate(name, i);
    return t0;
  }
  tween._value = value;
  return tween;
}
function attrTween_default(name, value) {
  var key = "attr." + name;
  if (arguments.length < 2) return (key = this.tween(key)) && key._value;
  if (value == null) return this.tween(key, null);
  if (typeof value !== "function") throw new Error();
  var fullname = namespace_default(name);
  return this.tween(key, (fullname.local ? attrTweenNS : attrTween)(fullname, value));
}

// node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/delay.js
function delayFunction(id2, value) {
  return function() {
    init(this, id2).delay = +value.apply(this, arguments);
  };
}
function delayConstant(id2, value) {
  return value = +value, function() {
    init(this, id2).delay = value;
  };
}
function delay_default(value) {
  var id2 = this._id;
  return arguments.length ? this.each((typeof value === "function" ? delayFunction : delayConstant)(id2, value)) : get2(this.node(), id2).delay;
}

// node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/duration.js
function durationFunction(id2, value) {
  return function() {
    set2(this, id2).duration = +value.apply(this, arguments);
  };
}
function durationConstant(id2, value) {
  return value = +value, function() {
    set2(this, id2).duration = value;
  };
}
function duration_default(value) {
  var id2 = this._id;
  return arguments.length ? this.each((typeof value === "function" ? durationFunction : durationConstant)(id2, value)) : get2(this.node(), id2).duration;
}

// node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/ease.js
function easeConstant(id2, value) {
  if (typeof value !== "function") throw new Error();
  return function() {
    set2(this, id2).ease = value;
  };
}
function ease_default(value) {
  var id2 = this._id;
  return arguments.length ? this.each(easeConstant(id2, value)) : get2(this.node(), id2).ease;
}

// node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/easeVarying.js
function easeVarying(id2, value) {
  return function() {
    var v2 = value.apply(this, arguments);
    if (typeof v2 !== "function") throw new Error();
    set2(this, id2).ease = v2;
  };
}
function easeVarying_default(value) {
  if (typeof value !== "function") throw new Error();
  return this.each(easeVarying(this._id, value));
}

// node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/filter.js
function filter_default2(match) {
  if (typeof match !== "function") match = matcher_default(match);
  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j2 = 0; j2 < m; ++j2) {
    for (var group = groups[j2], n = group.length, subgroup = subgroups[j2] = [], node, i = 0; i < n; ++i) {
      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
        subgroup.push(node);
      }
    }
  }
  return new Transition(subgroups, this._parents, this._name, this._id);
}

// node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/merge.js
function merge_default2(transition2) {
  if (transition2._id !== this._id) throw new Error();
  for (var groups0 = this._groups, groups1 = transition2._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j2 = 0; j2 < m; ++j2) {
    for (var group0 = groups0[j2], group1 = groups1[j2], n = group0.length, merge = merges[j2] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group0[i] || group1[i]) {
        merge[i] = node;
      }
    }
  }
  for (; j2 < m0; ++j2) {
    merges[j2] = groups0[j2];
  }
  return new Transition(merges, this._parents, this._name, this._id);
}

// node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/on.js
function start(name) {
  return (name + "").trim().split(/^|\s+/).every(function(t) {
    var i = t.indexOf(".");
    if (i >= 0) t = t.slice(0, i);
    return !t || t === "start";
  });
}
function onFunction(id2, name, listener) {
  var on0, on1, sit = start(name) ? init : set2;
  return function() {
    var schedule = sit(this, id2), on2 = schedule.on;
    if (on2 !== on0) (on1 = (on0 = on2).copy()).on(name, listener);
    schedule.on = on1;
  };
}
function on_default2(name, listener) {
  var id2 = this._id;
  return arguments.length < 2 ? get2(this.node(), id2).on.on(name) : this.each(onFunction(id2, name, listener));
}

// node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/remove.js
function removeFunction(id2) {
  return function() {
    var parent = this.parentNode;
    for (var i in this.__transition) if (+i !== id2) return;
    if (parent) parent.removeChild(this);
  };
}
function remove_default2() {
  return this.on("end.remove", removeFunction(this._id));
}

// node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/select.js
function select_default3(select) {
  var name = this._name, id2 = this._id;
  if (typeof select !== "function") select = selector_default(select);
  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j2 = 0; j2 < m; ++j2) {
    for (var group = groups[j2], n = group.length, subgroup = subgroups[j2] = new Array(n), node, subnode, i = 0; i < n; ++i) {
      if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
        if ("__data__" in node) subnode.__data__ = node.__data__;
        subgroup[i] = subnode;
        schedule_default(subgroup[i], name, id2, i, subgroup, get2(node, id2));
      }
    }
  }
  return new Transition(subgroups, this._parents, name, id2);
}

// node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/selectAll.js
function selectAll_default2(select) {
  var name = this._name, id2 = this._id;
  if (typeof select !== "function") select = selectorAll_default(select);
  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j2 = 0; j2 < m; ++j2) {
    for (var group = groups[j2], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        for (var children2 = select.call(node, node.__data__, i, group), child, inherit2 = get2(node, id2), k2 = 0, l = children2.length; k2 < l; ++k2) {
          if (child = children2[k2]) {
            schedule_default(child, name, id2, k2, children2, inherit2);
          }
        }
        subgroups.push(children2);
        parents.push(node);
      }
    }
  }
  return new Transition(subgroups, parents, name, id2);
}

// node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/selection.js
var Selection2 = selection_default.prototype.constructor;
function selection_default2() {
  return new Selection2(this._groups, this._parents);
}

// node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/style.js
function styleNull(name, interpolate) {
  var string00, string10, interpolate0;
  return function() {
    var string0 = styleValue(this, name), string1 = (this.style.removeProperty(name), styleValue(this, name));
    return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : interpolate0 = interpolate(string00 = string0, string10 = string1);
  };
}
function styleRemove2(name) {
  return function() {
    this.style.removeProperty(name);
  };
}
function styleConstant2(name, interpolate, value1) {
  var string00, string1 = value1 + "", interpolate0;
  return function() {
    var string0 = styleValue(this, name);
    return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate(string00 = string0, value1);
  };
}
function styleFunction2(name, interpolate, value) {
  var string00, string10, interpolate0;
  return function() {
    var string0 = styleValue(this, name), value1 = value(this), string1 = value1 + "";
    if (value1 == null) string1 = value1 = (this.style.removeProperty(name), styleValue(this, name));
    return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
  };
}
function styleMaybeRemove(id2, name) {
  var on0, on1, listener0, key = "style." + name, event = "end." + key, remove2;
  return function() {
    var schedule = set2(this, id2), on2 = schedule.on, listener = schedule.value[key] == null ? remove2 || (remove2 = styleRemove2(name)) : void 0;
    if (on2 !== on0 || listener0 !== listener) (on1 = (on0 = on2).copy()).on(event, listener0 = listener);
    schedule.on = on1;
  };
}
function style_default2(name, value, priority) {
  var i = (name += "") === "transform" ? interpolateTransformCss : interpolate_default;
  return value == null ? this.styleTween(name, styleNull(name, i)).on("end.style." + name, styleRemove2(name)) : typeof value === "function" ? this.styleTween(name, styleFunction2(name, i, tweenValue(this, "style." + name, value))).each(styleMaybeRemove(this._id, name)) : this.styleTween(name, styleConstant2(name, i, value), priority).on("end.style." + name, null);
}

// node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/styleTween.js
function styleInterpolate(name, i, priority) {
  return function(t) {
    this.style.setProperty(name, i.call(this, t), priority);
  };
}
function styleTween(name, value, priority) {
  var t, i0;
  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0) t = (i0 = i) && styleInterpolate(name, i, priority);
    return t;
  }
  tween._value = value;
  return tween;
}
function styleTween_default(name, value, priority) {
  var key = "style." + (name += "");
  if (arguments.length < 2) return (key = this.tween(key)) && key._value;
  if (value == null) return this.tween(key, null);
  if (typeof value !== "function") throw new Error();
  return this.tween(key, styleTween(name, value, priority == null ? "" : priority));
}

// node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/text.js
function textConstant2(value) {
  return function() {
    this.textContent = value;
  };
}
function textFunction2(value) {
  return function() {
    var value1 = value(this);
    this.textContent = value1 == null ? "" : value1;
  };
}
function text_default2(value) {
  return this.tween("text", typeof value === "function" ? textFunction2(tweenValue(this, "text", value)) : textConstant2(value == null ? "" : value + ""));
}

// node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/textTween.js
function textInterpolate(i) {
  return function(t) {
    this.textContent = i.call(this, t);
  };
}
function textTween(value) {
  var t0, i0;
  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0) t0 = (i0 = i) && textInterpolate(i);
    return t0;
  }
  tween._value = value;
  return tween;
}
function textTween_default(value) {
  var key = "text";
  if (arguments.length < 1) return (key = this.tween(key)) && key._value;
  if (value == null) return this.tween(key, null);
  if (typeof value !== "function") throw new Error();
  return this.tween(key, textTween(value));
}

// node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/transition.js
function transition_default() {
  var name = this._name, id0 = this._id, id1 = newId();
  for (var groups = this._groups, m = groups.length, j2 = 0; j2 < m; ++j2) {
    for (var group = groups[j2], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        var inherit2 = get2(node, id0);
        schedule_default(node, name, id1, i, group, {
          time: inherit2.time + inherit2.delay + inherit2.duration,
          delay: 0,
          duration: inherit2.duration,
          ease: inherit2.ease
        });
      }
    }
  }
  return new Transition(groups, this._parents, name, id1);
}

// node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/end.js
function end_default() {
  var on0, on1, that = this, id2 = that._id, size = that.size();
  return new Promise(function(resolve, reject) {
    var cancel = { value: reject }, end = { value: function() {
      if (--size === 0) resolve();
    } };
    that.each(function() {
      var schedule = set2(this, id2), on2 = schedule.on;
      if (on2 !== on0) {
        on1 = (on0 = on2).copy();
        on1._.cancel.push(cancel);
        on1._.interrupt.push(cancel);
        on1._.end.push(end);
      }
      schedule.on = on1;
    });
    if (size === 0) resolve();
  });
}

// node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/index.js
var id = 0;
function Transition(groups, parents, name, id2) {
  this._groups = groups;
  this._parents = parents;
  this._name = name;
  this._id = id2;
}
function transition(name) {
  return selection_default().transition(name);
}
function newId() {
  return ++id;
}
var selection_prototype = selection_default.prototype;
Transition.prototype = transition.prototype = {
  constructor: Transition,
  select: select_default3,
  selectAll: selectAll_default2,
  selectChild: selection_prototype.selectChild,
  selectChildren: selection_prototype.selectChildren,
  filter: filter_default2,
  merge: merge_default2,
  selection: selection_default2,
  transition: transition_default,
  call: selection_prototype.call,
  nodes: selection_prototype.nodes,
  node: selection_prototype.node,
  size: selection_prototype.size,
  empty: selection_prototype.empty,
  each: selection_prototype.each,
  on: on_default2,
  attr: attr_default2,
  attrTween: attrTween_default,
  style: style_default2,
  styleTween: styleTween_default,
  text: text_default2,
  textTween: textTween_default,
  remove: remove_default2,
  tween: tween_default,
  delay: delay_default,
  duration: duration_default,
  ease: ease_default,
  easeVarying: easeVarying_default,
  end: end_default,
  [Symbol.iterator]: selection_prototype[Symbol.iterator]
};

// node_modules/.pnpm/d3-ease@3.0.1/node_modules/d3-ease/src/cubic.js
function cubicInOut(t) {
  return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
}

// node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/selection/transition.js
var defaultTiming = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: cubicInOut
};
function inherit(node, id2) {
  var timing;
  while (!(timing = node.__transition) || !(timing = timing[id2])) {
    if (!(node = node.parentNode)) {
      throw new Error(`transition ${id2} not found`);
    }
  }
  return timing;
}
function transition_default2(name) {
  var id2, timing;
  if (name instanceof Transition) {
    id2 = name._id, name = name._name;
  } else {
    id2 = newId(), (timing = defaultTiming).time = now(), name = name == null ? null : name + "";
  }
  for (var groups = this._groups, m = groups.length, j2 = 0; j2 < m; ++j2) {
    for (var group = groups[j2], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        schedule_default(node, name, id2, i, group, timing || inherit(node, id2));
      }
    }
  }
  return new Transition(groups, this._parents, name, id2);
}

// node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/selection/index.js
selection_default.prototype.interrupt = interrupt_default2;
selection_default.prototype.transition = transition_default2;

// node_modules/.pnpm/d3-brush@3.0.0/node_modules/d3-brush/src/brush.js
var { abs, max, min } = Math;
function number1(e) {
  return [+e[0], +e[1]];
}
function number2(e) {
  return [number1(e[0]), number1(e[1])];
}
var X = {
  name: "x",
  handles: ["w", "e"].map(type),
  input: function(x2, e) {
    return x2 == null ? null : [[+x2[0], e[0][1]], [+x2[1], e[1][1]]];
  },
  output: function(xy) {
    return xy && [xy[0][0], xy[1][0]];
  }
};
var Y = {
  name: "y",
  handles: ["n", "s"].map(type),
  input: function(y, e) {
    return y == null ? null : [[e[0][0], +y[0]], [e[1][0], +y[1]]];
  },
  output: function(xy) {
    return xy && [xy[0][1], xy[1][1]];
  }
};
var XY = {
  name: "xy",
  handles: ["n", "w", "e", "s", "nw", "ne", "sw", "se"].map(type),
  input: function(xy) {
    return xy == null ? null : number2(xy);
  },
  output: function(xy) {
    return xy;
  }
};
function type(t) {
  return { type: t };
}

// node_modules/.pnpm/d3-zoom@3.0.0/node_modules/d3-zoom/src/constant.js
var constant_default4 = (x2) => () => x2;

// node_modules/.pnpm/d3-zoom@3.0.0/node_modules/d3-zoom/src/event.js
function ZoomEvent(type2, {
  sourceEvent,
  target,
  transform: transform2,
  dispatch: dispatch2
}) {
  Object.defineProperties(this, {
    type: { value: type2, enumerable: true, configurable: true },
    sourceEvent: { value: sourceEvent, enumerable: true, configurable: true },
    target: { value: target, enumerable: true, configurable: true },
    transform: { value: transform2, enumerable: true, configurable: true },
    _: { value: dispatch2 }
  });
}

// node_modules/.pnpm/d3-zoom@3.0.0/node_modules/d3-zoom/src/transform.js
function Transform(k2, x2, y) {
  this.k = k2;
  this.x = x2;
  this.y = y;
}
Transform.prototype = {
  constructor: Transform,
  scale: function(k2) {
    return k2 === 1 ? this : new Transform(this.k * k2, this.x, this.y);
  },
  translate: function(x2, y) {
    return x2 === 0 & y === 0 ? this : new Transform(this.k, this.x + this.k * x2, this.y + this.k * y);
  },
  apply: function(point) {
    return [point[0] * this.k + this.x, point[1] * this.k + this.y];
  },
  applyX: function(x2) {
    return x2 * this.k + this.x;
  },
  applyY: function(y) {
    return y * this.k + this.y;
  },
  invert: function(location) {
    return [(location[0] - this.x) / this.k, (location[1] - this.y) / this.k];
  },
  invertX: function(x2) {
    return (x2 - this.x) / this.k;
  },
  invertY: function(y) {
    return (y - this.y) / this.k;
  },
  rescaleX: function(x2) {
    return x2.copy().domain(x2.range().map(this.invertX, this).map(x2.invert, x2));
  },
  rescaleY: function(y) {
    return y.copy().domain(y.range().map(this.invertY, this).map(y.invert, y));
  },
  toString: function() {
    return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
  }
};
var identity2 = new Transform(1, 0, 0);
transform.prototype = Transform.prototype;
function transform(node) {
  while (!node.__zoom) if (!(node = node.parentNode)) return identity2;
  return node.__zoom;
}

// node_modules/.pnpm/d3-zoom@3.0.0/node_modules/d3-zoom/src/noevent.js
function nopropagation2(event) {
  event.stopImmediatePropagation();
}
function noevent_default3(event) {
  event.preventDefault();
  event.stopImmediatePropagation();
}

// node_modules/.pnpm/d3-zoom@3.0.0/node_modules/d3-zoom/src/zoom.js
function defaultFilter(event) {
  return (!event.ctrlKey || event.type === "wheel") && !event.button;
}
function defaultExtent() {
  var e = this;
  if (e instanceof SVGElement) {
    e = e.ownerSVGElement || e;
    if (e.hasAttribute("viewBox")) {
      e = e.viewBox.baseVal;
      return [[e.x, e.y], [e.x + e.width, e.y + e.height]];
    }
    return [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]];
  }
  return [[0, 0], [e.clientWidth, e.clientHeight]];
}
function defaultTransform() {
  return this.__zoom || identity2;
}
function defaultWheelDelta(event) {
  return -event.deltaY * (event.deltaMode === 1 ? 0.05 : event.deltaMode ? 1 : 2e-3) * (event.ctrlKey ? 10 : 1);
}
function defaultTouchable() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function defaultConstrain(transform2, extent, translateExtent) {
  var dx0 = transform2.invertX(extent[0][0]) - translateExtent[0][0], dx1 = transform2.invertX(extent[1][0]) - translateExtent[1][0], dy0 = transform2.invertY(extent[0][1]) - translateExtent[0][1], dy1 = transform2.invertY(extent[1][1]) - translateExtent[1][1];
  return transform2.translate(
    dx1 > dx0 ? (dx0 + dx1) / 2 : Math.min(0, dx0) || Math.max(0, dx1),
    dy1 > dy0 ? (dy0 + dy1) / 2 : Math.min(0, dy0) || Math.max(0, dy1)
  );
}
function zoom_default2() {
  var filter2 = defaultFilter, extent = defaultExtent, constrain = defaultConstrain, wheelDelta = defaultWheelDelta, touchable = defaultTouchable, scaleExtent = [0, Infinity], translateExtent = [[-Infinity, -Infinity], [Infinity, Infinity]], duration = 250, interpolate = zoom_default, listeners = dispatch_default("start", "zoom", "end"), touchstarting, touchfirst, touchending, touchDelay = 500, wheelDelay = 150, clickDistance2 = 0, tapDistance = 10;
  function zoom(selection2) {
    selection2.property("__zoom", defaultTransform).on("wheel.zoom", wheeled, { passive: false }).on("mousedown.zoom", mousedowned).on("dblclick.zoom", dblclicked).filter(touchable).on("touchstart.zoom", touchstarted).on("touchmove.zoom", touchmoved).on("touchend.zoom touchcancel.zoom", touchended).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  zoom.transform = function(collection, transform2, point, event) {
    var selection2 = collection.selection ? collection.selection() : collection;
    selection2.property("__zoom", defaultTransform);
    if (collection !== selection2) {
      schedule(collection, transform2, point, event);
    } else {
      selection2.interrupt().each(function() {
        gesture(this, arguments).event(event).start().zoom(null, typeof transform2 === "function" ? transform2.apply(this, arguments) : transform2).end();
      });
    }
  };
  zoom.scaleBy = function(selection2, k2, p2, event) {
    zoom.scaleTo(selection2, function() {
      var k0 = this.__zoom.k, k1 = typeof k2 === "function" ? k2.apply(this, arguments) : k2;
      return k0 * k1;
    }, p2, event);
  };
  zoom.scaleTo = function(selection2, k2, p2, event) {
    zoom.transform(selection2, function() {
      var e = extent.apply(this, arguments), t0 = this.__zoom, p0 = p2 == null ? centroid(e) : typeof p2 === "function" ? p2.apply(this, arguments) : p2, p1 = t0.invert(p0), k1 = typeof k2 === "function" ? k2.apply(this, arguments) : k2;
      return constrain(translate(scale(t0, k1), p0, p1), e, translateExtent);
    }, p2, event);
  };
  zoom.translateBy = function(selection2, x2, y, event) {
    zoom.transform(selection2, function() {
      return constrain(this.__zoom.translate(
        typeof x2 === "function" ? x2.apply(this, arguments) : x2,
        typeof y === "function" ? y.apply(this, arguments) : y
      ), extent.apply(this, arguments), translateExtent);
    }, null, event);
  };
  zoom.translateTo = function(selection2, x2, y, p2, event) {
    zoom.transform(selection2, function() {
      var e = extent.apply(this, arguments), t = this.__zoom, p0 = p2 == null ? centroid(e) : typeof p2 === "function" ? p2.apply(this, arguments) : p2;
      return constrain(identity2.translate(p0[0], p0[1]).scale(t.k).translate(
        typeof x2 === "function" ? -x2.apply(this, arguments) : -x2,
        typeof y === "function" ? -y.apply(this, arguments) : -y
      ), e, translateExtent);
    }, p2, event);
  };
  function scale(transform2, k2) {
    k2 = Math.max(scaleExtent[0], Math.min(scaleExtent[1], k2));
    return k2 === transform2.k ? transform2 : new Transform(k2, transform2.x, transform2.y);
  }
  function translate(transform2, p0, p1) {
    var x2 = p0[0] - p1[0] * transform2.k, y = p0[1] - p1[1] * transform2.k;
    return x2 === transform2.x && y === transform2.y ? transform2 : new Transform(transform2.k, x2, y);
  }
  function centroid(extent2) {
    return [(+extent2[0][0] + +extent2[1][0]) / 2, (+extent2[0][1] + +extent2[1][1]) / 2];
  }
  function schedule(transition2, transform2, point, event) {
    transition2.on("start.zoom", function() {
      gesture(this, arguments).event(event).start();
    }).on("interrupt.zoom end.zoom", function() {
      gesture(this, arguments).event(event).end();
    }).tween("zoom", function() {
      var that = this, args = arguments, g = gesture(that, args).event(event), e = extent.apply(that, args), p2 = point == null ? centroid(e) : typeof point === "function" ? point.apply(that, args) : point, w2 = Math.max(e[1][0] - e[0][0], e[1][1] - e[0][1]), a = that.__zoom, b = typeof transform2 === "function" ? transform2.apply(that, args) : transform2, i = interpolate(a.invert(p2).concat(w2 / a.k), b.invert(p2).concat(w2 / b.k));
      return function(t) {
        if (t === 1) t = b;
        else {
          var l = i(t), k2 = w2 / l[2];
          t = new Transform(k2, p2[0] - l[0] * k2, p2[1] - l[1] * k2);
        }
        g.zoom(null, t);
      };
    });
  }
  function gesture(that, args, clean) {
    return !clean && that.__zooming || new Gesture(that, args);
  }
  function Gesture(that, args) {
    this.that = that;
    this.args = args;
    this.active = 0;
    this.sourceEvent = null;
    this.extent = extent.apply(that, args);
    this.taps = 0;
  }
  Gesture.prototype = {
    event: function(event) {
      if (event) this.sourceEvent = event;
      return this;
    },
    start: function() {
      if (++this.active === 1) {
        this.that.__zooming = this;
        this.emit("start");
      }
      return this;
    },
    zoom: function(key, transform2) {
      if (this.mouse && key !== "mouse") this.mouse[1] = transform2.invert(this.mouse[0]);
      if (this.touch0 && key !== "touch") this.touch0[1] = transform2.invert(this.touch0[0]);
      if (this.touch1 && key !== "touch") this.touch1[1] = transform2.invert(this.touch1[0]);
      this.that.__zoom = transform2;
      this.emit("zoom");
      return this;
    },
    end: function() {
      if (--this.active === 0) {
        delete this.that.__zooming;
        this.emit("end");
      }
      return this;
    },
    emit: function(type2) {
      var d = select_default2(this.that).datum();
      listeners.call(
        type2,
        this.that,
        new ZoomEvent(type2, {
          sourceEvent: this.sourceEvent,
          target: zoom,
          type: type2,
          transform: this.that.__zoom,
          dispatch: listeners
        }),
        d
      );
    }
  };
  function wheeled(event, ...args) {
    if (!filter2.apply(this, arguments)) return;
    var g = gesture(this, args).event(event), t = this.__zoom, k2 = Math.max(scaleExtent[0], Math.min(scaleExtent[1], t.k * Math.pow(2, wheelDelta.apply(this, arguments)))), p2 = pointer_default(event);
    if (g.wheel) {
      if (g.mouse[0][0] !== p2[0] || g.mouse[0][1] !== p2[1]) {
        g.mouse[1] = t.invert(g.mouse[0] = p2);
      }
      clearTimeout(g.wheel);
    } else if (t.k === k2) return;
    else {
      g.mouse = [p2, t.invert(p2)];
      interrupt_default(this);
      g.start();
    }
    noevent_default3(event);
    g.wheel = setTimeout(wheelidled, wheelDelay);
    g.zoom("mouse", constrain(translate(scale(t, k2), g.mouse[0], g.mouse[1]), g.extent, translateExtent));
    function wheelidled() {
      g.wheel = null;
      g.end();
    }
  }
  function mousedowned(event, ...args) {
    if (touchending || !filter2.apply(this, arguments)) return;
    var currentTarget = event.currentTarget, g = gesture(this, args, true).event(event), v2 = select_default2(event.view).on("mousemove.zoom", mousemoved, true).on("mouseup.zoom", mouseupped, true), p2 = pointer_default(event, currentTarget), x0 = event.clientX, y0 = event.clientY;
    nodrag_default(event.view);
    nopropagation2(event);
    g.mouse = [p2, this.__zoom.invert(p2)];
    interrupt_default(this);
    g.start();
    function mousemoved(event2) {
      noevent_default3(event2);
      if (!g.moved) {
        var dx = event2.clientX - x0, dy = event2.clientY - y0;
        g.moved = dx * dx + dy * dy > clickDistance2;
      }
      g.event(event2).zoom("mouse", constrain(translate(g.that.__zoom, g.mouse[0] = pointer_default(event2, currentTarget), g.mouse[1]), g.extent, translateExtent));
    }
    function mouseupped(event2) {
      v2.on("mousemove.zoom mouseup.zoom", null);
      yesdrag(event2.view, g.moved);
      noevent_default3(event2);
      g.event(event2).end();
    }
  }
  function dblclicked(event, ...args) {
    if (!filter2.apply(this, arguments)) return;
    var t0 = this.__zoom, p0 = pointer_default(event.changedTouches ? event.changedTouches[0] : event, this), p1 = t0.invert(p0), k1 = t0.k * (event.shiftKey ? 0.5 : 2), t1 = constrain(translate(scale(t0, k1), p0, p1), extent.apply(this, args), translateExtent);
    noevent_default3(event);
    if (duration > 0) select_default2(this).transition().duration(duration).call(schedule, t1, p0, event);
    else select_default2(this).call(zoom.transform, t1, p0, event);
  }
  function touchstarted(event, ...args) {
    if (!filter2.apply(this, arguments)) return;
    var touches = event.touches, n = touches.length, g = gesture(this, args, event.changedTouches.length === n).event(event), started, i, t, p2;
    nopropagation2(event);
    for (i = 0; i < n; ++i) {
      t = touches[i], p2 = pointer_default(t, this);
      p2 = [p2, this.__zoom.invert(p2), t.identifier];
      if (!g.touch0) g.touch0 = p2, started = true, g.taps = 1 + !!touchstarting;
      else if (!g.touch1 && g.touch0[2] !== p2[2]) g.touch1 = p2, g.taps = 0;
    }
    if (touchstarting) touchstarting = clearTimeout(touchstarting);
    if (started) {
      if (g.taps < 2) touchfirst = p2[0], touchstarting = setTimeout(function() {
        touchstarting = null;
      }, touchDelay);
      interrupt_default(this);
      g.start();
    }
  }
  function touchmoved(event, ...args) {
    if (!this.__zooming) return;
    var g = gesture(this, args).event(event), touches = event.changedTouches, n = touches.length, i, t, p2, l;
    noevent_default3(event);
    for (i = 0; i < n; ++i) {
      t = touches[i], p2 = pointer_default(t, this);
      if (g.touch0 && g.touch0[2] === t.identifier) g.touch0[0] = p2;
      else if (g.touch1 && g.touch1[2] === t.identifier) g.touch1[0] = p2;
    }
    t = g.that.__zoom;
    if (g.touch1) {
      var p0 = g.touch0[0], l0 = g.touch0[1], p1 = g.touch1[0], l1 = g.touch1[1], dp = (dp = p1[0] - p0[0]) * dp + (dp = p1[1] - p0[1]) * dp, dl = (dl = l1[0] - l0[0]) * dl + (dl = l1[1] - l0[1]) * dl;
      t = scale(t, Math.sqrt(dp / dl));
      p2 = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2];
      l = [(l0[0] + l1[0]) / 2, (l0[1] + l1[1]) / 2];
    } else if (g.touch0) p2 = g.touch0[0], l = g.touch0[1];
    else return;
    g.zoom("touch", constrain(translate(t, p2, l), g.extent, translateExtent));
  }
  function touchended(event, ...args) {
    if (!this.__zooming) return;
    var g = gesture(this, args).event(event), touches = event.changedTouches, n = touches.length, i, t;
    nopropagation2(event);
    if (touchending) clearTimeout(touchending);
    touchending = setTimeout(function() {
      touchending = null;
    }, touchDelay);
    for (i = 0; i < n; ++i) {
      t = touches[i];
      if (g.touch0 && g.touch0[2] === t.identifier) delete g.touch0;
      else if (g.touch1 && g.touch1[2] === t.identifier) delete g.touch1;
    }
    if (g.touch1 && !g.touch0) g.touch0 = g.touch1, delete g.touch1;
    if (g.touch0) g.touch0[1] = this.__zoom.invert(g.touch0[0]);
    else {
      g.end();
      if (g.taps === 2) {
        t = pointer_default(t, this);
        if (Math.hypot(touchfirst[0] - t[0], touchfirst[1] - t[1]) < tapDistance) {
          var p2 = select_default2(this).on("dblclick.zoom");
          if (p2) p2.apply(this, arguments);
        }
      }
    }
  }
  zoom.wheelDelta = function(_2) {
    return arguments.length ? (wheelDelta = typeof _2 === "function" ? _2 : constant_default4(+_2), zoom) : wheelDelta;
  };
  zoom.filter = function(_2) {
    return arguments.length ? (filter2 = typeof _2 === "function" ? _2 : constant_default4(!!_2), zoom) : filter2;
  };
  zoom.touchable = function(_2) {
    return arguments.length ? (touchable = typeof _2 === "function" ? _2 : constant_default4(!!_2), zoom) : touchable;
  };
  zoom.extent = function(_2) {
    return arguments.length ? (extent = typeof _2 === "function" ? _2 : constant_default4([[+_2[0][0], +_2[0][1]], [+_2[1][0], +_2[1][1]]]), zoom) : extent;
  };
  zoom.scaleExtent = function(_2) {
    return arguments.length ? (scaleExtent[0] = +_2[0], scaleExtent[1] = +_2[1], zoom) : [scaleExtent[0], scaleExtent[1]];
  };
  zoom.translateExtent = function(_2) {
    return arguments.length ? (translateExtent[0][0] = +_2[0][0], translateExtent[1][0] = +_2[1][0], translateExtent[0][1] = +_2[0][1], translateExtent[1][1] = +_2[1][1], zoom) : [[translateExtent[0][0], translateExtent[0][1]], [translateExtent[1][0], translateExtent[1][1]]];
  };
  zoom.constrain = function(_2) {
    return arguments.length ? (constrain = _2, zoom) : constrain;
  };
  zoom.duration = function(_2) {
    return arguments.length ? (duration = +_2, zoom) : duration;
  };
  zoom.interpolate = function(_2) {
    return arguments.length ? (interpolate = _2, zoom) : interpolate;
  };
  zoom.on = function() {
    var value = listeners.on.apply(listeners, arguments);
    return value === listeners ? zoom : value;
  };
  zoom.clickDistance = function(_2) {
    return arguments.length ? (clickDistance2 = (_2 = +_2) * _2, zoom) : Math.sqrt(clickDistance2);
  };
  zoom.tapDistance = function(_2) {
    return arguments.length ? (tapDistance = +_2, zoom) : tapDistance;
  };
  return zoom;
}

// node_modules/.pnpm/@dagrejs+dagre@3.0.0/node_modules/@dagrejs/dagre/dist/dagre.esm.js
var ge = Object.defineProperty;
var hn = (e, n, t) => n in e ? ge(e, n, { enumerable: true, configurable: true, writable: true, value: t }) : e[n] = t;
var fn = (e, n) => {
  for (var t in n) ge(e, t, { get: n[t], enumerable: true });
};
var pe = (e, n, t) => hn(e, typeof n != "symbol" ? n + "" : n, t);
var z = {};
fn(z, { Graph: () => p, alg: () => R, json: () => ye, version: () => pn });
var bn = Object.defineProperty;
var Le = (e, n) => {
  for (var t in n) bn(e, t, { get: n[t], enumerable: true });
};
var p = class {
  constructor(e) {
    this._isDirected = true, this._isMultigraph = false, this._isCompound = false, this._nodes = {}, this._in = {}, this._preds = {}, this._out = {}, this._sucs = {}, this._edgeObjs = {}, this._edgeLabels = {}, this._nodeCount = 0, this._edgeCount = 0, this._defaultNodeLabelFn = () => {
    }, this._defaultEdgeLabelFn = () => {
    }, e && (this._isDirected = "directed" in e ? e.directed : true, this._isMultigraph = "multigraph" in e ? e.multigraph : false, this._isCompound = "compound" in e ? e.compound : false), this._isCompound && (this._parent = {}, this._children = {}, this._children["\0"] = {});
  }
  isDirected() {
    return this._isDirected;
  }
  isMultigraph() {
    return this._isMultigraph;
  }
  isCompound() {
    return this._isCompound;
  }
  setGraph(e) {
    return this._label = e, this;
  }
  graph() {
    return this._label;
  }
  setDefaultNodeLabel(e) {
    return typeof e != "function" ? this._defaultNodeLabelFn = () => e : this._defaultNodeLabelFn = e, this;
  }
  nodeCount() {
    return this._nodeCount;
  }
  nodes() {
    return Object.keys(this._nodes);
  }
  sources() {
    return this.nodes().filter((e) => Object.keys(this._in[e]).length === 0);
  }
  sinks() {
    return this.nodes().filter((e) => Object.keys(this._out[e]).length === 0);
  }
  setNodes(e, n) {
    return e.forEach((t) => {
      n !== void 0 ? this.setNode(t, n) : this.setNode(t);
    }), this;
  }
  setNode(e, n) {
    return e in this._nodes ? (arguments.length > 1 && (this._nodes[e] = n), this) : (this._nodes[e] = arguments.length > 1 ? n : this._defaultNodeLabelFn(e), this._isCompound && (this._parent[e] = "\0", this._children[e] = {}, this._children["\0"][e] = true), this._in[e] = {}, this._preds[e] = {}, this._out[e] = {}, this._sucs[e] = {}, ++this._nodeCount, this);
  }
  node(e) {
    return this._nodes[e];
  }
  hasNode(e) {
    return e in this._nodes;
  }
  removeNode(e) {
    if (e in this._nodes) {
      let n = (t) => this.removeEdge(this._edgeObjs[t]);
      delete this._nodes[e], this._isCompound && (this._removeFromParentsChildList(e), delete this._parent[e], this.children(e).forEach((t) => {
        this.setParent(t);
      }), delete this._children[e]), Object.keys(this._in[e]).forEach(n), delete this._in[e], delete this._preds[e], Object.keys(this._out[e]).forEach(n), delete this._out[e], delete this._sucs[e], --this._nodeCount;
    }
    return this;
  }
  setParent(e, n) {
    if (!this._isCompound) throw new Error("Cannot set parent in a non-compound graph");
    if (n === void 0) n = "\0";
    else {
      n += "";
      for (let t = n; t !== void 0; t = this.parent(t)) if (t === e) throw new Error("Setting " + n + " as parent of " + e + " would create a cycle");
      this.setNode(n);
    }
    return this.setNode(e), this._removeFromParentsChildList(e), this._parent[e] = n, this._children[n][e] = true, this;
  }
  parent(e) {
    if (this._isCompound) {
      let n = this._parent[e];
      if (n !== "\0") return n;
    }
  }
  children(e = "\0") {
    if (this._isCompound) {
      let n = this._children[e];
      if (n) return Object.keys(n);
    } else {
      if (e === "\0") return this.nodes();
      if (this.hasNode(e)) return [];
    }
    return [];
  }
  predecessors(e) {
    let n = this._preds[e];
    if (n) return Object.keys(n);
  }
  successors(e) {
    let n = this._sucs[e];
    if (n) return Object.keys(n);
  }
  neighbors(e) {
    let n = this.predecessors(e);
    if (n) {
      let t = new Set(n);
      for (let r of this.successors(e)) t.add(r);
      return Array.from(t.values());
    }
  }
  isLeaf(e) {
    let n;
    return this.isDirected() ? n = this.successors(e) : n = this.neighbors(e), n.length === 0;
  }
  filterNodes(e) {
    let n = new this.constructor({ directed: this._isDirected, multigraph: this._isMultigraph, compound: this._isCompound });
    n.setGraph(this.graph()), Object.entries(this._nodes).forEach(([o, i]) => {
      e(o) && n.setNode(o, i);
    }), Object.values(this._edgeObjs).forEach((o) => {
      n.hasNode(o.v) && n.hasNode(o.w) && n.setEdge(o, this.edge(o));
    });
    let t = {}, r = (o) => {
      let i = this.parent(o);
      return !i || n.hasNode(i) ? (t[o] = i != null ? i : void 0, i != null ? i : void 0) : i in t ? t[i] : r(i);
    };
    return this._isCompound && n.nodes().forEach((o) => n.setParent(o, r(o))), n;
  }
  setDefaultEdgeLabel(e) {
    return typeof e != "function" ? this._defaultEdgeLabelFn = () => e : this._defaultEdgeLabelFn = e, this;
  }
  edgeCount() {
    return this._edgeCount;
  }
  edges() {
    return Object.values(this._edgeObjs);
  }
  setPath(e, n) {
    return e.reduce((t, r) => (n !== void 0 ? this.setEdge(t, r, n) : this.setEdge(t, r), r)), this;
  }
  setEdge(e, n, t, r) {
    let o, i, s, a, d = false;
    typeof e == "object" && e !== null && "v" in e ? (o = e.v, i = e.w, s = e.name, arguments.length === 2 && (a = n, d = true)) : (o = e, i = n, s = r, arguments.length > 2 && (a = t, d = true)), o = "" + o, i = "" + i, s !== void 0 && (s = "" + s);
    let l = C(this._isDirected, o, i, s);
    if (l in this._edgeLabels) return d && (this._edgeLabels[l] = a), this;
    if (s !== void 0 && !this._isMultigraph) throw new Error("Cannot set a named edge when isMultigraph = false");
    this.setNode(o), this.setNode(i), this._edgeLabels[l] = d ? a : this._defaultEdgeLabelFn(o, i, s);
    let u = gn(this._isDirected, o, i, s);
    return o = u.v, i = u.w, Object.freeze(u), this._edgeObjs[l] = u, me(this._preds[i], o), me(this._sucs[o], i), this._in[i][l] = u, this._out[o][l] = u, this._edgeCount++, this;
  }
  edge(e, n, t) {
    let r = arguments.length === 1 ? Y2(this._isDirected, e) : C(this._isDirected, e, n, t);
    return this._edgeLabels[r];
  }
  edgeAsObj(e, n, t) {
    let r = arguments.length === 1 ? this.edge(e) : this.edge(e, n, t);
    return typeof r != "object" ? { label: r } : r;
  }
  hasEdge(e, n, t) {
    return (arguments.length === 1 ? Y2(this._isDirected, e) : C(this._isDirected, e, n, t)) in this._edgeLabels;
  }
  removeEdge(e, n, t) {
    let r = arguments.length === 1 ? Y2(this._isDirected, e) : C(this._isDirected, e, n, t), o = this._edgeObjs[r];
    if (o) {
      let i = o.v, s = o.w;
      delete this._edgeLabels[r], delete this._edgeObjs[r], Ee(this._preds[s], i), Ee(this._sucs[i], s), delete this._in[s][r], delete this._out[i][r], this._edgeCount--;
    }
    return this;
  }
  inEdges(e, n) {
    return this.isDirected() ? this.filterEdges(this._in[e], e, n) : this.nodeEdges(e, n);
  }
  outEdges(e, n) {
    return this.isDirected() ? this.filterEdges(this._out[e], e, n) : this.nodeEdges(e, n);
  }
  nodeEdges(e, n) {
    if (e in this._nodes) return this.filterEdges({ ...this._in[e], ...this._out[e] }, e, n);
  }
  _removeFromParentsChildList(e) {
    delete this._children[this._parent[e]][e];
  }
  filterEdges(e, n, t) {
    if (!e) return;
    let r = Object.values(e);
    return t ? r.filter((o) => o.v === n && o.w === t || o.v === t && o.w === n) : r;
  }
};
function me(e, n) {
  e[n] ? e[n]++ : e[n] = 1;
}
function Ee(e, n) {
  e[n] !== void 0 && !--e[n] && delete e[n];
}
function C(e, n, t, r) {
  let o = "" + n, i = "" + t;
  if (!e && o > i) {
    let s = o;
    o = i, i = s;
  }
  return o + "" + i + "" + (r === void 0 ? "\0" : r);
}
function gn(e, n, t, r) {
  let o = "" + n, i = "" + t;
  if (!e && o > i) {
    let a = o;
    o = i, i = a;
  }
  let s = { v: o, w: i };
  return r && (s.name = r), s;
}
function Y2(e, n) {
  return C(e, n.v, n.w, n.name);
}
var pn = "4.0.1";
var ye = {};
Le(ye, { read: () => yn, write: () => mn });
function mn(e) {
  let n = { options: { directed: e.isDirected(), multigraph: e.isMultigraph(), compound: e.isCompound() }, nodes: En(e), edges: Ln(e) }, t = e.graph();
  return t !== void 0 && (n.value = structuredClone(t)), n;
}
function En(e) {
  return e.nodes().map((n) => {
    let t = e.node(n), r = e.parent(n), o = { v: n };
    return t !== void 0 && (o.value = t), r !== void 0 && (o.parent = r), o;
  });
}
function Ln(e) {
  return e.edges().map((n) => {
    let t = e.edge(n), r = { v: n.v, w: n.w };
    return n.name !== void 0 && (r.name = n.name), t !== void 0 && (r.value = t), r;
  });
}
function yn(e) {
  let n = new p(e.options);
  return e.value !== void 0 && n.setGraph(e.value), e.nodes.forEach((t) => {
    n.setNode(t.v, t.value), t.parent && n.setParent(t.v, t.parent);
  }), e.edges.forEach((t) => {
    n.setEdge({ v: t.v, w: t.w, name: t.name }, t.value);
  }), n;
}
var R = {};
Le(R, { CycleException: () => D, bellmanFord: () => we, components: () => Gn, dijkstra: () => F, dijkstraAll: () => _n, findCycles: () => xn, floydWarshall: () => On, isAcyclic: () => Cn, postorder: () => Pn, preorder: () => Mn, prim: () => jn, shortestPaths: () => Sn, tarjan: () => Ge, topsort: () => ke });
var wn = () => 1;
function we(e, n, t, r) {
  return Nn(e, String(n), t || wn, r || function(o) {
    return e.outEdges(o);
  });
}
function Nn(e, n, t, r) {
  let o = {}, i, s = 0, a = e.nodes(), d = function(c) {
    let h = t(c);
    o[c.v].distance + h < o[c.w].distance && (o[c.w] = { distance: o[c.v].distance + h, predecessor: c.v }, i = true);
  }, l = function() {
    a.forEach(function(c) {
      r(c).forEach(function(h) {
        let f = h.v === c ? h.v : h.w, g = f === h.v ? h.w : h.v;
        d({ v: f, w: g });
      });
    });
  };
  a.forEach(function(c) {
    let h = c === n ? 0 : Number.POSITIVE_INFINITY;
    o[c] = { distance: h, predecessor: "" };
  });
  let u = a.length;
  for (let c = 1; c < u && (i = false, s++, l(), !!i); c++) ;
  if (s === u - 1 && (i = false, l(), i)) throw new Error("The graph contains a negative weight cycle");
  return o;
}
function Gn(e) {
  let n = {}, t = [], r;
  function o(i) {
    i in n || (n[i] = true, r.push(i), e.successors(i).forEach(o), e.predecessors(i).forEach(o));
  }
  return e.nodes().forEach(function(i) {
    r = [], o(i), r.length && t.push(r);
  }), t;
}
var Ne = class {
  constructor() {
    this._arr = [], this._keyIndices = {};
  }
  size() {
    return this._arr.length;
  }
  keys() {
    return this._arr.map((e) => e.key);
  }
  has(e) {
    return e in this._keyIndices;
  }
  priority(e) {
    let n = this._keyIndices[e];
    if (n !== void 0) return this._arr[n].priority;
  }
  min() {
    if (this.size() === 0) throw new Error("Queue underflow");
    return this._arr[0].key;
  }
  add(e, n) {
    let t = this._keyIndices, r = String(e);
    if (!(r in t)) {
      let o = this._arr, i = o.length;
      return t[r] = i, o.push({ key: r, priority: n }), this._decrease(i), true;
    }
    return false;
  }
  removeMin() {
    this._swap(0, this._arr.length - 1);
    let e = this._arr.pop();
    return delete this._keyIndices[e.key], this._heapify(0), e.key;
  }
  decrease(e, n) {
    let t = this._keyIndices[e];
    if (t === void 0) throw new Error(`Key not found: ${e}`);
    let r = this._arr[t].priority;
    if (n > r) throw new Error(`New priority is greater than current priority. Key: ${e} Old: ${r} New: ${n}`);
    this._arr[t].priority = n, this._decrease(t);
  }
  _heapify(e) {
    let n = this._arr, t = 2 * e, r = t + 1, o = e;
    t < n.length && (o = n[t].priority < n[o].priority ? t : o, r < n.length && (o = n[r].priority < n[o].priority ? r : o), o !== e && (this._swap(e, o), this._heapify(o)));
  }
  _decrease(e) {
    let n = this._arr, t = n[e].priority, r;
    for (; e !== 0 && (r = e >> 1, !(n[r].priority < t)); ) this._swap(e, r), e = r;
  }
  _swap(e, n) {
    let t = this._arr, r = this._keyIndices, o = t[e], i = t[n];
    t[e] = i, t[n] = o, r[i.key] = e, r[o.key] = n;
  }
};
var kn = () => 1;
function F(e, n, t, r) {
  let o = function(i) {
    return e.outEdges(i);
  };
  return vn(e, String(n), t || kn, r || o);
}
function vn(e, n, t, r) {
  let o = {}, i = new Ne(), s, a, d = function(l) {
    let u = l.v !== s ? l.v : l.w, c = o[u], h = t(l), f = a.distance + h;
    if (h < 0) throw new Error("dijkstra does not allow negative edge weights. Bad edge: " + l + " Weight: " + h);
    f < c.distance && (c.distance = f, c.predecessor = s, i.decrease(u, f));
  };
  for (e.nodes().forEach(function(l) {
    let u = l === n ? 0 : Number.POSITIVE_INFINITY;
    o[l] = { distance: u, predecessor: "" }, i.add(l, u);
  }); i.size() > 0 && (s = i.removeMin(), a = o[s], a.distance !== Number.POSITIVE_INFINITY); ) r(s).forEach(d);
  return o;
}
function _n(e, n, t) {
  return e.nodes().reduce(function(r, o) {
    return r[o] = F(e, o, n, t), r;
  }, {});
}
function Ge(e) {
  let n = 0, t = [], r = {}, o = [];
  function i(s) {
    let a = r[s] = { onStack: true, lowlink: n, index: n++ };
    if (t.push(s), e.successors(s).forEach(function(d) {
      d in r ? r[d].onStack && (a.lowlink = Math.min(a.lowlink, r[d].index)) : (i(d), a.lowlink = Math.min(a.lowlink, r[d].lowlink));
    }), a.lowlink === a.index) {
      let d = [], l;
      do
        l = t.pop(), r[l].onStack = false, d.push(l);
      while (s !== l);
      o.push(d);
    }
  }
  return e.nodes().forEach(function(s) {
    s in r || i(s);
  }), o;
}
function xn(e) {
  return Ge(e).filter(function(n) {
    return n.length > 1 || n.length === 1 && e.hasEdge(n[0], n[0]);
  });
}
var Tn = () => 1;
function On(e, n, t) {
  return In(e, n || Tn, t || function(r) {
    return e.outEdges(r);
  });
}
function In(e, n, t) {
  let r = {}, o = e.nodes();
  return o.forEach(function(i) {
    r[i] = {}, r[i][i] = { distance: 0, predecessor: "" }, o.forEach(function(s) {
      i !== s && (r[i][s] = { distance: Number.POSITIVE_INFINITY, predecessor: "" });
    }), t(i).forEach(function(s) {
      let a = s.v === i ? s.w : s.v, d = n(s);
      r[i][a] = { distance: d, predecessor: i };
    });
  }), o.forEach(function(i) {
    let s = r[i];
    o.forEach(function(a) {
      let d = r[a];
      o.forEach(function(l) {
        let u = d[i], c = s[l], h = d[l], f = u.distance + c.distance;
        f < h.distance && (h.distance = f, h.predecessor = c.predecessor);
      });
    });
  }), r;
}
var D = class extends Error {
  constructor(...e) {
    super(...e);
  }
};
function ke(e) {
  let n = {}, t = {}, r = [];
  function o(i) {
    if (i in t) throw new D();
    i in n || (t[i] = true, n[i] = true, e.predecessors(i).forEach(o), delete t[i], r.push(i));
  }
  if (e.sinks().forEach(o), Object.keys(n).length !== e.nodeCount()) throw new D();
  return r;
}
function Cn(e) {
  try {
    ke(e);
  } catch (n) {
    if (n instanceof D) return false;
    throw n;
  }
  return true;
}
function Rn(e, n, t, r, o) {
  Array.isArray(n) || (n = [n]);
  let i = ((a) => {
    var d;
    return (d = e.isDirected() ? e.successors(a) : e.neighbors(a)) != null ? d : [];
  }), s = {};
  return n.forEach(function(a) {
    if (!e.hasNode(a)) throw new Error("Graph does not have node: " + a);
    o = ve(e, a, t === "post", s, i, r, o);
  }), o;
}
function ve(e, n, t, r, o, i, s) {
  return n in r || (r[n] = true, t || (s = i(s, n)), o(n).forEach(function(a) {
    s = ve(e, a, t, r, o, i, s);
  }), t && (s = i(s, n))), s;
}
function _e(e, n, t) {
  return Rn(e, n, t, function(r, o) {
    return r.push(o), r;
  }, []);
}
function Pn(e, n) {
  return _e(e, n, "post");
}
function Mn(e, n) {
  return _e(e, n, "pre");
}
function jn(e, n) {
  let t = new p(), r = {}, o = new Ne(), i;
  function s(d) {
    let l = d.v === i ? d.w : d.v, u = o.priority(l);
    if (u !== void 0) {
      let c = n(d);
      c < u && (r[l] = i, o.decrease(l, c));
    }
  }
  if (e.nodeCount() === 0) return t;
  e.nodes().forEach(function(d) {
    o.add(d, Number.POSITIVE_INFINITY), t.setNode(d);
  }), o.decrease(e.nodes()[0], 0);
  let a = false;
  for (; o.size() > 0; ) {
    if (i = o.removeMin(), i in r) t.setEdge(i, r[i]);
    else {
      if (a) throw new Error("Input graph is not connected: " + e);
      a = true;
    }
    e.nodeEdges(i).forEach(s);
  }
  return t;
}
function Sn(e, n, t, r) {
  return Fn(e, n, t, r != null ? r : ((o) => {
    let i = e.outEdges(o);
    return i != null ? i : [];
  }));
}
function Fn(e, n, t, r) {
  if (t === void 0) return F(e, n, t, r);
  let o = false, i = e.nodes();
  for (let s = 0; s < i.length; s++) {
    let a = r(i[s]);
    for (let d = 0; d < a.length; d++) {
      let l = a[d], u = l.v === i[s] ? l.v : l.w, c = u === l.v ? l.w : l.v;
      t({ v: u, w: c }) < 0 && (o = true);
    }
    if (o) return we(e, n, t, r);
  }
  return F(e, n, t, r);
}
function w(e, n, t, r) {
  let o = r;
  for (; e.hasNode(o); ) o = j(r);
  return t.dummy = n, e.setNode(o, t), o;
}
function xe(e) {
  let n = new p().setGraph(e.graph());
  return e.nodes().forEach((t) => n.setNode(t, e.node(t))), e.edges().forEach((t) => {
    let r = n.edge(t.v, t.w) || { weight: 0, minlen: 1 }, o = e.edge(t);
    n.setEdge(t.v, t.w, { weight: r.weight + o.weight, minlen: Math.max(r.minlen, o.minlen) });
  }), n;
}
function A(e) {
  let n = new p({ multigraph: e.isMultigraph() }).setGraph(e.graph());
  return e.nodes().forEach((t) => {
    e.children(t).length || n.setNode(t, e.node(t));
  }), e.edges().forEach((t) => {
    n.setEdge(t, e.edge(t));
  }), n;
}
function H(e, n) {
  let t = e.x, r = e.y, o = n.x - t, i = n.y - r, s = e.width / 2, a = e.height / 2;
  if (!o && !i) throw new Error("Not possible to find intersection inside of the rectangle");
  let d, l;
  return Math.abs(i) * s > Math.abs(o) * a ? (i < 0 && (a = -a), d = a * o / i, l = a) : (o < 0 && (s = -s), d = s, l = s * i / o), { x: t + d, y: r + l };
}
function N(e) {
  let n = k(X2(e) + 1).map(() => []);
  return e.nodes().forEach((t) => {
    let r = e.node(t), o = r.rank;
    o !== void 0 && (n[o] || (n[o] = []), n[o][r.order] = t);
  }), n;
}
function Te(e) {
  let n = e.nodes().map((r) => {
    let o = e.node(r).rank;
    return o === void 0 ? Number.MAX_VALUE : o;
  }), t = L(Math.min, n);
  e.nodes().forEach((r) => {
    let o = e.node(r);
    Object.hasOwn(o, "rank") && (o.rank -= t);
  });
}
function Oe(e) {
  let n = e.nodes().map((s) => e.node(s).rank).filter((s) => s !== void 0), t = L(Math.min, n), r = [];
  e.nodes().forEach((s) => {
    let a = e.node(s).rank - t;
    r[a] || (r[a] = []), r[a].push(s);
  });
  let o = 0, i = e.graph().nodeRankFactor;
  Array.from(r).forEach((s, a) => {
    s === void 0 && a % i !== 0 ? --o : s !== void 0 && o && s.forEach((d) => e.node(d).rank += o);
  });
}
function q(e, n, t, r) {
  let o = { width: 0, height: 0 };
  return arguments.length >= 4 && (o.rank = t, o.order = r), w(e, "border", o, n);
}
function Dn(e, n = Ie) {
  let t = [];
  for (let r = 0; r < e.length; r += n) {
    let o = e.slice(r, r + n);
    t.push(o);
  }
  return t;
}
var Ie = 65535;
function L(e, n) {
  if (n.length > Ie) {
    let t = Dn(n);
    return e(...t.map((r) => e(...r)));
  } else return e(...n);
}
function X2(e) {
  let t = e.nodes().map((r) => {
    let o = e.node(r).rank;
    return o === void 0 ? Number.MIN_VALUE : o;
  });
  return L(Math.max, t);
}
function Ce(e, n) {
  let t = { lhs: [], rhs: [] };
  return e.forEach((r) => {
    n(r) ? t.lhs.push(r) : t.rhs.push(r);
  }), t;
}
function P(e, n) {
  let t = Date.now();
  try {
    return n();
  } finally {
    console.log(e + " time: " + (Date.now() - t) + "ms");
  }
}
function M(e, n) {
  return n();
}
var An = 0;
function j(e) {
  let n = ++An;
  return e + ("" + n);
}
function k(e, n, t = 1) {
  n == null && (n = e, e = 0);
  let r = (i) => i < n;
  t < 0 && (r = (i) => n < i);
  let o = [];
  for (let i = e; r(i); i += t) o.push(i);
  return o;
}
function T(e, n) {
  let t = {};
  for (let r of n) e[r] !== void 0 && (t[r] = e[r]);
  return t;
}
function O(e, n) {
  let t;
  return typeof n == "string" ? t = (r) => r[n] : t = n, Object.entries(e).reduce((r, [o, i]) => (r[o] = t(i, o), r), {});
}
function Re(e, n) {
  return e.reduce((t, r, o) => (t[r] = n[o], t), {});
}
var _ = "\0";
var U = "3.0.0";
var K = class {
  constructor() {
    pe(this, "_sentinel");
    let n = {};
    n._next = n._prev = n, this._sentinel = n;
  }
  dequeue() {
    let n = this._sentinel, t = n._prev;
    if (t !== n) return Pe(t), t;
  }
  enqueue(n) {
    let t = this._sentinel;
    n._prev && n._next && Pe(n), n._next = t._next, t._next._prev = n, t._next = n, n._prev = t;
  }
  toString() {
    let n = [], t = this._sentinel, r = t._prev;
    for (; r !== t; ) n.push(JSON.stringify(r, Vn)), r = r._prev;
    return "[" + n.join(", ") + "]";
  }
};
function Pe(e) {
  e._prev._next = e._next, e._next._prev = e._prev, delete e._next, delete e._prev;
}
function Vn(e, n) {
  if (e !== "_next" && e !== "_prev") return n;
}
var Me = K;
var Wn = () => 1;
function Q(e, n) {
  if (e.nodeCount() <= 1) return [];
  let t = Yn(e, n || Wn);
  return Bn(t.graph, t.buckets, t.zeroIdx).flatMap((o) => e.outEdges(o.v, o.w) || []);
}
function Bn(e, n, t) {
  var a;
  let r = [], o = n[n.length - 1], i = n[0], s;
  for (; e.nodeCount(); ) {
    for (; s = i.dequeue(); ) $(e, n, t, s);
    for (; s = o.dequeue(); ) $(e, n, t, s);
    if (e.nodeCount()) {
      for (let d = n.length - 2; d > 0; --d) if (s = (a = n[d]) == null ? void 0 : a.dequeue(), s) {
        r = r.concat($(e, n, t, s, true) || []);
        break;
      }
    }
  }
  return r;
}
function $(e, n, t, r, o) {
  let i = [], s = o ? i : void 0;
  return (e.inEdges(r.v) || []).forEach((a) => {
    let d = e.edge(a), l = e.node(a.v);
    o && i.push({ v: a.v, w: a.w }), l.out -= d, J(n, t, l);
  }), (e.outEdges(r.v) || []).forEach((a) => {
    let d = e.edge(a), l = a.w, u = e.node(l);
    u.in -= d, J(n, t, u);
  }), e.removeNode(r.v), s;
}
function Yn(e, n) {
  let t = new p(), r = 0, o = 0;
  e.nodes().forEach((a) => {
    t.setNode(a, { v: a, in: 0, out: 0 });
  }), e.edges().forEach((a) => {
    let d = t.edge(a.v, a.w) || 0, l = n(a), u = d + l;
    t.setEdge(a.v, a.w, u);
    let c = t.node(a.v), h = t.node(a.w);
    o = Math.max(o, c.out += l), r = Math.max(r, h.in += l);
  });
  let i = zn(o + r + 3).map(() => new Me()), s = r + 1;
  return t.nodes().forEach((a) => {
    J(i, s, t.node(a));
  }), { graph: t, buckets: i, zeroIdx: s };
}
function J(e, n, t) {
  var r, o, i;
  t.out ? t.in ? (i = e[t.out - t.in + n]) == null || i.enqueue(t) : (o = e[e.length - 1]) == null || o.enqueue(t) : (r = e[0]) == null || r.enqueue(t);
}
function zn(e) {
  let n = [];
  for (let t = 0; t < e; t++) n.push(t);
  return n;
}
function je(e) {
  (e.graph().acyclicer === "greedy" ? Q(e, t(e)) : Hn(e)).forEach((r) => {
    let o = e.edge(r);
    e.removeEdge(r), o.forwardName = r.name, o.reversed = true, e.setEdge(r.w, r.v, o, j("rev"));
  });
  function t(r) {
    return (o) => r.edge(o).weight;
  }
}
function Hn(e) {
  let n = [], t = {}, r = {};
  function o(i) {
    Object.hasOwn(r, i) || (r[i] = true, t[i] = true, e.outEdges(i).forEach((s) => {
      Object.hasOwn(t, s.w) ? n.push(s) : o(s.w);
    }), delete t[i]);
  }
  return e.nodes().forEach(o), n;
}
function Se(e) {
  e.edges().forEach((n) => {
    let t = e.edge(n);
    if (t.reversed) {
      e.removeEdge(n);
      let r = t.forwardName;
      delete t.reversed, delete t.forwardName, e.setEdge(n.w, n.v, t, r);
    }
  });
}
function Fe(e) {
  e.graph().dummyChains = [], e.edges().forEach((n) => Xn(e, n));
}
function Xn(e, n) {
  let t = n.v, r = e.node(t).rank, o = n.w, i = e.node(o).rank, s = n.name, a = e.edge(n), d = a.labelRank;
  if (i === r + 1) return;
  e.removeEdge(n);
  let l, u, c;
  for (c = 0, ++r; r < i; ++c, ++r) a.points = [], u = { width: 0, height: 0, edgeLabel: a, edgeObj: n, rank: r }, l = w(e, "edge", u, "_d"), r === d && (u.width = a.width, u.height = a.height, u.dummy = "edge-label", u.labelpos = a.labelpos), e.setEdge(t, l, { weight: a.weight }, s), c === 0 && e.graph().dummyChains.push(l), t = l;
  e.setEdge(t, o, { weight: a.weight }, s);
}
function De(e) {
  e.graph().dummyChains.forEach((n) => {
    let t = e.node(n), r = t.edgeLabel, o;
    for (e.setEdge(t.edgeObj, r); t.dummy; ) o = e.successors(n)[0], e.removeNode(n), r.points.push({ x: t.x, y: t.y }), t.dummy === "edge-label" && (r.x = t.x, r.y = t.y, r.width = t.width, r.height = t.height), n = o, t = e.node(n);
  });
}
function S(e) {
  let n = {};
  function t(r) {
    let o = e.node(r);
    if (Object.hasOwn(n, r)) return o.rank;
    n[r] = true;
    let i = e.outEdges(r), s = i ? i.map((d) => d == null ? Number.POSITIVE_INFINITY : t(d.w) - e.edge(d).minlen) : [], a = L(Math.min, s);
    return a === Number.POSITIVE_INFINITY && (a = 0), o.rank = a;
  }
  e.sources().forEach(t);
}
function v(e, n) {
  return e.node(n.w).rank - e.node(n.v).rank - e.edge(n).minlen;
}
var V = Kn;
function Kn(e) {
  let n = new p({ directed: false }), t = e.nodes();
  if (t.length === 0) throw new Error("Graph must have at least one node");
  let r = t[0], o = e.nodeCount();
  n.setNode(r, {});
  let i, s;
  for (; $n(n, e) < o && (i = Jn(n, e), !!i); ) s = n.hasNode(i.v) ? v(e, i) : -v(e, i), Qn(n, e, s);
  return n;
}
function $n(e, n) {
  function t(r) {
    let o = n.nodeEdges(r);
    o && o.forEach((i) => {
      let s = i.v, a = r === s ? i.w : s;
      !e.hasNode(a) && !v(n, i) && (e.setNode(a, {}), e.setEdge(r, a, {}), t(a));
    });
  }
  return e.nodes().forEach(t), e.nodeCount();
}
function Jn(e, n) {
  return n.edges().reduce((r, o) => {
    let i = Number.POSITIVE_INFINITY;
    return e.hasNode(o.v) !== e.hasNode(o.w) && (i = v(n, o)), i < r[0] ? [i, o] : r;
  }, [Number.POSITIVE_INFINITY, null])[1];
}
function Qn(e, n, t) {
  e.nodes().forEach((r) => n.node(r).rank += t);
}
var { preorder: Zn, postorder: et } = R;
var Ve = x;
x.initLowLimValues = ee;
x.initCutValues = Z;
x.calcCutValue = We;
x.leaveEdge = Ye;
x.enterEdge = ze;
x.exchangeEdges = He;
function x(e) {
  e = xe(e), S(e);
  let n = V(e);
  ee(n), Z(n, e);
  let t, r;
  for (; t = Ye(n); ) r = ze(n, e, t), He(n, e, t, r);
}
function Z(e, n) {
  let t = et(e, e.nodes());
  t = t.slice(0, t.length - 1), t.forEach((r) => nt(e, n, r));
}
function nt(e, n, t) {
  let o = e.node(t).parent, i = e.edge(t, o);
  i.cutvalue = We(e, n, t);
}
function We(e, n, t) {
  let o = e.node(t).parent, i = true, s = n.edge(t, o), a = 0;
  s || (i = false, s = n.edge(o, t)), a = s.weight;
  let d = n.nodeEdges(t);
  return d && d.forEach((l) => {
    let u = l.v === t, c = u ? l.w : l.v;
    if (c !== o) {
      let h = u === i, f = n.edge(l).weight;
      if (a += h ? f : -f, rt(e, t, c)) {
        let b = e.edge(t, c).cutvalue;
        a += h ? -b : b;
      }
    }
  }), a;
}
function ee(e, n) {
  arguments.length < 2 && (n = e.nodes()[0]), Be(e, {}, 1, n);
}
function Be(e, n, t, r, o) {
  let i = t, s = e.node(r);
  n[r] = true;
  let a = e.neighbors(r);
  return a && a.forEach((d) => {
    Object.hasOwn(n, d) || (t = Be(e, n, t, d, r));
  }), s.low = i, s.lim = t++, o ? s.parent = o : delete s.parent, t;
}
function Ye(e) {
  return e.edges().find((n) => e.edge(n).cutvalue < 0);
}
function ze(e, n, t) {
  let r = t.v, o = t.w;
  n.hasEdge(r, o) || (r = t.w, o = t.v);
  let i = e.node(r), s = e.node(o), a = i, d = false;
  return i.lim > s.lim && (a = s, d = true), n.edges().filter((u) => d === Ae(e, e.node(u.v), a) && d !== Ae(e, e.node(u.w), a)).reduce((u, c) => v(n, c) < v(n, u) ? c : u);
}
function He(e, n, t, r) {
  let o = t.v, i = t.w;
  e.removeEdge(o, i), e.setEdge(r.v, r.w, {}), ee(e), Z(e, n), tt(e, n);
}
function tt(e, n) {
  let t = e.nodes().find((o) => !e.node(o).parent);
  if (!t) return;
  let r = Zn(e, [t]);
  r = r.slice(1), r.forEach((o) => {
    let s = e.node(o).parent, a = n.edge(o, s), d = false;
    a || (a = n.edge(s, o), d = true), n.node(o).rank = n.node(s).rank + (d ? a.minlen : -a.minlen);
  });
}
function rt(e, n, t) {
  return e.hasEdge(n, t);
}
function Ae(e, n, t) {
  return t.low <= n.lim && n.lim <= t.lim;
}
var Xe = ot;
function ot(e) {
  let n = e.graph().ranker;
  if (typeof n == "function") return n(e);
  switch (n) {
    case "network-simplex":
      qe(e);
      break;
    case "tight-tree":
      st(e);
      break;
    case "longest-path":
      it(e);
      break;
    case "none":
      break;
    default:
      qe(e);
  }
}
var it = S;
function st(e) {
  S(e), V(e);
}
function qe(e) {
  Ve(e);
}
var Ue = at;
function at(e) {
  let n = lt(e);
  e.graph().dummyChains.forEach((t) => {
    let r = e.node(t), o = r.edgeObj, i = dt(e, n, o.v, o.w), s = i.path, a = i.lca, d = 0, l = s[d], u = true;
    for (; t !== o.w; ) {
      if (r = e.node(t), u) {
        for (; (l = s[d]) !== a && e.node(l).maxRank < r.rank; ) d++;
        l === a && (u = false);
      }
      if (!u) {
        for (; d < s.length - 1 && e.node(s[d + 1]).minRank <= r.rank; ) d++;
        l = s[d];
      }
      l !== void 0 && e.setParent(t, l), t = e.successors(t)[0];
    }
  });
}
function dt(e, n, t, r) {
  let o = [], i = [], s = Math.min(n[t].low, n[r].low), a = Math.max(n[t].lim, n[r].lim), d;
  d = t;
  do
    d = e.parent(d), o.push(d);
  while (d && (n[d].low > s || a > n[d].lim));
  let l = d, u = r;
  for (; (u = e.parent(u)) !== l; ) i.push(u);
  return { path: o.concat(i.reverse()), lca: l };
}
function lt(e) {
  let n = {}, t = 0;
  function r(o) {
    let i = t;
    e.children(o).forEach(r), n[o] = { low: i, lim: t++ };
  }
  return e.children(_).forEach(r), n;
}
function Ke(e) {
  let n = w(e, "root", {}, "_root"), t = ut(e), r = Object.values(t), o = L(Math.max, r) - 1, i = 2 * o + 1;
  e.graph().nestingRoot = n, e.edges().forEach((a) => e.edge(a).minlen *= i);
  let s = ct(e) + 1;
  e.children(_).forEach((a) => $e(e, n, i, s, o, t, a)), e.graph().nodeRankFactor = i;
}
function $e(e, n, t, r, o, i, s) {
  var c;
  let a = e.children(s);
  if (!a.length) {
    s !== n && e.setEdge(n, s, { weight: 0, minlen: t });
    return;
  }
  let d = q(e, "_bt"), l = q(e, "_bb"), u = e.node(s);
  e.setParent(d, s), u.borderTop = d, e.setParent(l, s), u.borderBottom = l, a.forEach((h) => {
    var y;
    $e(e, n, t, r, o, i, h);
    let f = e.node(h), g = f.borderTop ? f.borderTop : h, b = f.borderBottom ? f.borderBottom : h, m = f.borderTop ? r : 2 * r, E = g !== b ? 1 : o - ((y = i[s]) != null ? y : 0) + 1;
    e.setEdge(d, g, { weight: m, minlen: E, nestingEdge: true }), e.setEdge(b, l, { weight: m, minlen: E, nestingEdge: true });
  }), e.parent(s) || e.setEdge(n, d, { weight: 0, minlen: o + ((c = i[s]) != null ? c : 0) });
}
function ut(e) {
  let n = {};
  function t(r, o) {
    let i = e.children(r);
    i && i.length && i.forEach((s) => t(s, o + 1)), n[r] = o;
  }
  return e.children(_).forEach((r) => t(r, 1)), n;
}
function ct(e) {
  return e.edges().reduce((n, t) => n + e.edge(t).weight, 0);
}
function Je(e) {
  let n = e.graph();
  e.removeNode(n.nestingRoot), delete n.nestingRoot, e.edges().forEach((t) => {
    e.edge(t).nestingEdge && e.removeEdge(t);
  });
}
var Ze = ft;
function ft(e) {
  function n(t) {
    let r = e.children(t), o = e.node(t);
    if (r.length && r.forEach(n), Object.hasOwn(o, "minRank")) {
      o.borderLeft = [], o.borderRight = [];
      for (let i = o.minRank, s = o.maxRank + 1; i < s; ++i) Qe(e, "borderLeft", "_bl", t, o, i), Qe(e, "borderRight", "_br", t, o, i);
    }
  }
  e.children(_).forEach(n);
}
function Qe(e, n, t, r, o, i) {
  let s = { width: 0, height: 0, rank: i, borderType: n }, a = o[n][i - 1], d = w(e, "border", s, t);
  o[n][i] = d, e.setParent(d, r), a && e.setEdge(a, d, { weight: 1 });
}
function nn(e) {
  var t;
  let n = (t = e.graph().rankdir) == null ? void 0 : t.toLowerCase();
  (n === "lr" || n === "rl") && rn(e);
}
function tn(e) {
  var t;
  let n = (t = e.graph().rankdir) == null ? void 0 : t.toLowerCase();
  (n === "bt" || n === "rl") && bt(e), (n === "lr" || n === "rl") && (gt(e), rn(e));
}
function rn(e) {
  e.nodes().forEach((n) => en(e.node(n))), e.edges().forEach((n) => en(e.edge(n)));
}
function en(e) {
  let n = e.width;
  e.width = e.height, e.height = n;
}
function bt(e) {
  e.nodes().forEach((n) => ne(e.node(n))), e.edges().forEach((n) => {
    var r;
    let t = e.edge(n);
    (r = t.points) == null || r.forEach(ne), Object.hasOwn(t, "y") && ne(t);
  });
}
function ne(e) {
  e.y = -e.y;
}
function gt(e) {
  e.nodes().forEach((n) => te(e.node(n))), e.edges().forEach((n) => {
    var r;
    let t = e.edge(n);
    (r = t.points) == null || r.forEach(te), Object.hasOwn(t, "x") && te(t);
  });
}
function te(e) {
  let n = e.x;
  e.x = e.y, e.y = n;
}
function re(e) {
  let n = {}, t = e.nodes().filter((d) => !e.children(d).length), r = t.map((d) => e.node(d).rank), o = L(Math.max, r), i = k(o + 1).map(() => []);
  function s(d) {
    if (n[d]) return;
    n[d] = true;
    let l = e.node(d);
    i[l.rank].push(d);
    let u = e.successors(d);
    u && u.forEach(s);
  }
  return t.sort((d, l) => e.node(d).rank - e.node(l).rank).forEach(s), i;
}
function oe(e, n) {
  let t = 0;
  for (let r = 1; r < n.length; ++r) t += mt(e, n[r - 1], n[r]);
  return t;
}
function mt(e, n, t) {
  let r = Re(t, t.map((l, u) => u)), o = n.flatMap((l) => {
    let u = e.outEdges(l);
    return u ? u.map((c) => ({ pos: r[c.w], weight: e.edge(c).weight })).sort((c, h) => c.pos - h.pos) : [];
  }), i = 1;
  for (; i < t.length; ) i <<= 1;
  let s = 2 * i - 1;
  i -= 1;
  let a = new Array(s).fill(0), d = 0;
  return o.forEach((l) => {
    let u = l.pos + i;
    a[u] += l.weight;
    let c = 0;
    for (; u > 0; ) u % 2 && (c += a[u + 1]), u = u - 1 >> 1, a[u] += l.weight;
    d += l.weight * c;
  }), d;
}
function ie(e, n = []) {
  return n.map((t) => {
    let r = e.inEdges(t);
    if (!r || !r.length) return { v: t };
    {
      let o = r.reduce((i, s) => {
        let a = e.edge(s), d = e.node(s.v);
        return { sum: i.sum + a.weight * d.order, weight: i.weight + a.weight };
      }, { sum: 0, weight: 0 });
      return { v: t, barycenter: o.sum / o.weight, weight: o.weight };
    }
  });
}
function se(e, n) {
  let t = {};
  e.forEach((o, i) => {
    let s = { indegree: 0, in: [], out: [], vs: [o.v], i };
    o.barycenter !== void 0 && (s.barycenter = o.barycenter, s.weight = o.weight), t[o.v] = s;
  }), n.edges().forEach((o) => {
    let i = t[o.v], s = t[o.w];
    i !== void 0 && s !== void 0 && (s.indegree++, i.out.push(s));
  });
  let r = Object.values(t).filter((o) => !o.indegree);
  return Et(r);
}
function Et(e) {
  let n = [];
  function t(o) {
    return (i) => {
      i.merged || (i.barycenter === void 0 || o.barycenter === void 0 || i.barycenter >= o.barycenter) && Lt(o, i);
    };
  }
  function r(o) {
    return (i) => {
      i.in.push(o), --i.indegree === 0 && e.push(i);
    };
  }
  for (; e.length; ) {
    let o = e.pop();
    n.push(o), o.in.reverse().forEach(t(o)), o.out.forEach(r(o));
  }
  return n.filter((o) => !o.merged).map((o) => T(o, ["vs", "i", "barycenter", "weight"]));
}
function Lt(e, n) {
  let t = 0, r = 0;
  e.weight && (t += e.barycenter * e.weight, r += e.weight), n.weight && (t += n.barycenter * n.weight, r += n.weight), e.vs = n.vs.concat(e.vs), e.barycenter = t / r, e.weight = r, e.i = Math.min(n.i, e.i), n.merged = true;
}
function ae(e, n) {
  let t = Ce(e, (u) => Object.hasOwn(u, "barycenter")), r = t.lhs, o = t.rhs.sort((u, c) => c.i - u.i), i = [], s = 0, a = 0, d = 0;
  r.sort(yt(!!n)), d = on(i, o, d), r.forEach((u) => {
    d += u.vs.length, i.push(u.vs), s += u.barycenter * u.weight, a += u.weight, d = on(i, o, d);
  });
  let l = { vs: i.flat(1) };
  return a && (l.barycenter = s / a, l.weight = a), l;
}
function on(e, n, t) {
  let r;
  for (; n.length && (r = n[n.length - 1]).i <= t; ) n.pop(), e.push(r.vs), t++;
  return t;
}
function yt(e) {
  return (n, t) => n.barycenter < t.barycenter ? -1 : n.barycenter > t.barycenter ? 1 : e ? t.i - n.i : n.i - t.i;
}
function W(e, n, t, r) {
  let o = e.children(n), i = e.node(n), s = i ? i.borderLeft : void 0, a = i ? i.borderRight : void 0, d = {};
  s && (o = o.filter((h) => h !== s && h !== a));
  let l = ie(e, o);
  l.forEach((h) => {
    if (e.children(h.v).length) {
      let f = W(e, h.v, t, r);
      d[h.v] = f, Object.hasOwn(f, "barycenter") && Nt(h, f);
    }
  });
  let u = se(l, t);
  wt(u, d);
  let c = ae(u, r);
  if (s && a) {
    c.vs = [s, c.vs, a].flat(1);
    let h = e.predecessors(s);
    if (h && h.length) {
      let f = e.node(h[0]), g = e.predecessors(a), b = e.node(g[0]);
      Object.hasOwn(c, "barycenter") || (c.barycenter = 0, c.weight = 0), c.barycenter = (c.barycenter * c.weight + f.order + b.order) / (c.weight + 2), c.weight += 2;
    }
  }
  return c;
}
function wt(e, n) {
  e.forEach((t) => {
    t.vs = t.vs.flatMap((r) => n[r] ? n[r].vs : r);
  });
}
function Nt(e, n) {
  e.barycenter !== void 0 ? (e.barycenter = (e.barycenter * e.weight + n.barycenter * n.weight) / (e.weight + n.weight), e.weight += n.weight) : (e.barycenter = n.barycenter, e.weight = n.weight);
}
function de(e, n, t, r) {
  r || (r = e.nodes());
  let o = Gt(e), i = new p({ compound: true }).setGraph({ root: o }).setDefaultNodeLabel((s) => e.node(s));
  return r.forEach((s) => {
    let a = e.node(s), d = e.parent(s);
    if (a.rank === n || a.minRank <= n && n <= a.maxRank) {
      i.setNode(s), i.setParent(s, d || o);
      let l = e[t](s);
      l && l.forEach((u) => {
        let c = u.v === s ? u.w : u.v, h = i.edge(c, s), f = h !== void 0 ? h.weight : 0;
        i.setEdge(c, s, { weight: e.edge(u).weight + f });
      }), Object.hasOwn(a, "minRank") && i.setNode(s, { borderLeft: a.borderLeft[n], borderRight: a.borderRight[n] });
    }
  }), i;
}
function Gt(e) {
  let n;
  for (; e.hasNode(n = j("_root")); ) ;
  return n;
}
function le(e, n, t) {
  let r = {}, o;
  t.forEach((i) => {
    let s = e.parent(i), a, d;
    for (; s; ) {
      if (a = e.parent(s), a ? (d = r[a], r[a] = s) : (d = o, o = s), d && d !== s) {
        n.setEdge(d, s);
        return;
      }
      s = a;
    }
  });
}
function B(e, n = {}) {
  if (typeof n.customOrder == "function") {
    n.customOrder(e, B);
    return;
  }
  let t = X2(e), r = sn(e, k(1, t + 1), "inEdges"), o = sn(e, k(t - 1, -1, -1), "outEdges"), i = re(e);
  if (an(e, i), n.disableOptimalOrderHeuristic) return;
  let s = Number.POSITIVE_INFINITY, a, d = n.constraints || [];
  for (let l = 0, u = 0; u < 4; ++l, ++u) {
    kt(l % 2 ? r : o, l % 4 >= 2, d), i = N(e);
    let c = oe(e, i);
    c < s ? (u = 0, a = Object.assign({}, i), s = c) : c === s && (a = structuredClone(i));
  }
  an(e, a);
}
function sn(e, n, t) {
  let r = /* @__PURE__ */ new Map(), o = (i, s) => {
    r.has(i) || r.set(i, []), r.get(i).push(s);
  };
  for (let i of e.nodes()) {
    let s = e.node(i);
    if (typeof s.rank == "number" && o(s.rank, i), typeof s.minRank == "number" && typeof s.maxRank == "number") for (let a = s.minRank; a <= s.maxRank; a++) a !== s.rank && o(a, i);
  }
  return n.map(function(i) {
    return de(e, i, t, r.get(i) || []);
  });
}
function kt(e, n, t) {
  let r = new p();
  e.forEach(function(o) {
    t.forEach((a) => r.setEdge(a.left, a.right));
    let i = o.graph().root, s = W(o, i, r, n);
    s.vs.forEach((a, d) => o.node(a).order = d), le(o, r, s.vs);
  });
}
function an(e, n) {
  Object.values(n).forEach((t) => t.forEach((r, o) => e.node(r).order = o));
}
function vt(e, n) {
  let t = {};
  function r(o, i) {
    let s = 0, a = 0, d = o.length, l = i[i.length - 1];
    return i.forEach((u, c) => {
      let h = xt(e, u), f = h ? e.node(h).order : d;
      (h || u === l) && (i.slice(a, c + 1).forEach((g) => {
        let b = e.predecessors(g);
        b && b.forEach((m) => {
          let E = e.node(m), y = E.order;
          (y < s || f < y) && !(E.dummy && e.node(g).dummy) && dn(t, m, g);
        });
      }), a = c + 1, s = f);
    }), i;
  }
  return n.length && n.reduce(r), t;
}
function _t(e, n) {
  let t = {};
  function r(i, s, a, d, l) {
    k(s, a).forEach((u) => {
      let c = i[u];
      if (c !== void 0 && e.node(c).dummy) {
        let h = e.predecessors(c);
        h && h.forEach((f) => {
          if (f === void 0) return;
          let g = e.node(f);
          g.dummy && (g.order < d || g.order > l) && dn(t, f, c);
        });
      }
    });
  }
  function o(i, s) {
    let a = -1, d = -1, l = 0;
    return s.forEach((u, c) => {
      if (e.node(u).dummy === "border") {
        let h = e.predecessors(u);
        if (h && h.length) {
          let f = h[0];
          if (f === void 0) return;
          d = e.node(f).order, r(s, l, c, a, d), l = c, a = d;
        }
      }
      r(s, l, s.length, d, i.length);
    }), s;
  }
  return n.length && n.reduce(o), t;
}
function xt(e, n) {
  if (e.node(n).dummy) {
    let t = e.predecessors(n);
    if (t) return t.find((r) => e.node(r).dummy);
  }
}
function dn(e, n, t) {
  if (n > t) {
    let o = n;
    n = t, t = o;
  }
  let r = e[n];
  r || (e[n] = r = {}), r[t] = true;
}
function Tt(e, n, t) {
  if (n > t) {
    let o = n;
    n = t, t = o;
  }
  let r = e[n];
  return r !== void 0 && Object.hasOwn(r, t);
}
function Ot(e, n, t, r) {
  let o = {}, i = {}, s = {};
  return n.forEach((a) => {
    a.forEach((d, l) => {
      o[d] = d, i[d] = d, s[d] = l;
    });
  }), n.forEach((a) => {
    let d = -1;
    a.forEach((l) => {
      let u = r(l);
      if (u && u.length) {
        let c = u.sort((f, g) => {
          let b = s[f], m = s[g];
          return (b !== void 0 ? b : 0) - (m !== void 0 ? m : 0);
        }), h = (c.length - 1) / 2;
        for (let f = Math.floor(h), g = Math.ceil(h); f <= g; ++f) {
          let b = c[f];
          if (b === void 0) continue;
          let m = s[b];
          if (m !== void 0 && i[l] === l && d < m && !Tt(t, l, b)) {
            let E = o[b];
            E !== void 0 && (i[b] = l, i[l] = o[l] = E, d = m);
          }
        }
      }
    });
  }), { root: o, align: i };
}
function It(e, n, t, r, o = false) {
  let i = {}, s = Ct(e, n, t, o), a = o ? "borderLeft" : "borderRight";
  function d(f, g) {
    let b = s.nodes().slice(), m = {}, E = b.pop();
    for (; E; ) {
      if (m[E]) f(E);
      else {
        m[E] = true, b.push(E);
        for (let y of g(E)) b.push(y);
      }
      E = b.pop();
    }
  }
  function l(f) {
    let g = s.inEdges(f);
    g ? i[f] = g.reduce((b, m) => {
      var I;
      let E = (I = i[m.v]) != null ? I : 0, y = s.edge(m);
      return Math.max(b, E + (y !== void 0 ? y : 0));
    }, 0) : i[f] = 0;
  }
  function u(f) {
    let g = s.outEdges(f), b = Number.POSITIVE_INFINITY;
    g && (b = g.reduce((E, y) => {
      let I = i[y.w], be = s.edge(y);
      return Math.min(E, (I !== void 0 ? I : 0) - (be !== void 0 ? be : 0));
    }, Number.POSITIVE_INFINITY));
    let m = e.node(f);
    b !== Number.POSITIVE_INFINITY && m.borderType !== a && (i[f] = Math.max(i[f] !== void 0 ? i[f] : 0, b));
  }
  function c(f) {
    return s.predecessors(f) || [];
  }
  function h(f) {
    return s.successors(f) || [];
  }
  return d(l, c), d(u, h), Object.keys(r).forEach((f) => {
    var b;
    let g = t[f];
    g !== void 0 && (i[f] = (b = i[g]) != null ? b : 0);
  }), i;
}
function Ct(e, n, t, r) {
  let o = new p(), i = e.graph(), s = jt(i.nodesep, i.edgesep, r);
  return n.forEach((a) => {
    let d;
    a.forEach((l) => {
      let u = t[l];
      if (u !== void 0) {
        if (o.setNode(u), d !== void 0) {
          let c = t[d];
          if (c !== void 0) {
            let h = o.edge(c, u);
            o.setEdge(c, u, Math.max(s(e, l, d), h || 0));
          }
        }
        d = l;
      }
    });
  }), o;
}
function Rt(e, n) {
  return Object.values(n).reduce((t, r) => {
    let o = Number.NEGATIVE_INFINITY, i = Number.POSITIVE_INFINITY;
    Object.entries(r).forEach(([a, d]) => {
      let l = St(e, a) / 2;
      o = Math.max(d + l, o), i = Math.min(d - l, i);
    });
    let s = o - i;
    return s < t[0] && (t = [s, r]), t;
  }, [Number.POSITIVE_INFINITY, null])[1];
}
function Pt(e, n) {
  let t = Object.values(n), r = L(Math.min, t), o = L(Math.max, t);
  ["u", "d"].forEach((i) => {
    ["l", "r"].forEach((s) => {
      let a = i + s, d = e[a];
      if (!d || d === n) return;
      let l = Object.values(d), u = r - L(Math.min, l);
      s !== "l" && (u = o - L(Math.max, l)), u && (e[a] = O(d, (c) => c + u));
    });
  });
}
function Mt(e, n = void 0) {
  let t = e.ul;
  return t ? O(t, (r, o) => {
    var s, a;
    if (n) {
      let d = n.toLowerCase(), l = e[d];
      if (l && l[o] !== void 0) return l[o];
    }
    let i = Object.values(e).map((d) => {
      let l = d[o];
      return l !== void 0 ? l : 0;
    }).sort((d, l) => d - l);
    return (((s = i[1]) != null ? s : 0) + ((a = i[2]) != null ? a : 0)) / 2;
  }) : {};
}
function ln(e) {
  let n = N(e), t = Object.assign(vt(e, n), _t(e, n)), r = {}, o;
  ["u", "d"].forEach((s) => {
    o = s === "u" ? n : Object.values(n).reverse(), ["l", "r"].forEach((a) => {
      a === "r" && (o = o.map((c) => Object.values(c).reverse()));
      let l = Ot(e, o, t, (c) => (s === "u" ? e.predecessors(c) : e.successors(c)) || []), u = It(e, o, l.root, l.align, a === "r");
      a === "r" && (u = O(u, (c) => -c)), r[s + a] = u;
    });
  });
  let i = Rt(e, r);
  return Pt(r, i), Mt(r, e.graph().align);
}
function jt(e, n, t) {
  return (r, o, i) => {
    let s = r.node(o), a = r.node(i), d = 0, l;
    if (d += s.width / 2, Object.hasOwn(s, "labelpos")) switch (s.labelpos.toLowerCase()) {
      case "l":
        l = -s.width / 2;
        break;
      case "r":
        l = s.width / 2;
        break;
    }
    if (l && (d += t ? l : -l), l = void 0, d += (s.dummy ? n : e) / 2, d += (a.dummy ? n : e) / 2, d += a.width / 2, Object.hasOwn(a, "labelpos")) switch (a.labelpos.toLowerCase()) {
      case "l":
        l = a.width / 2;
        break;
      case "r":
        l = -a.width / 2;
        break;
    }
    return l && (d += t ? l : -l), d;
  };
}
function St(e, n) {
  return e.node(n).width;
}
function un(e) {
  e = A(e), Ft(e), Object.entries(ln(e)).forEach(([n, t]) => e.node(n).x = t);
}
function Ft(e) {
  let n = N(e), t = e.graph(), r = t.ranksep, o = t.rankalign, i = 0;
  n.forEach((s) => {
    let a = s.reduce((d, l) => {
      var c;
      let u = (c = e.node(l).height) != null ? c : 0;
      return d > u ? d : u;
    }, 0);
    s.forEach((d) => {
      let l = e.node(d);
      o === "top" ? l.y = i + l.height / 2 : o === "bottom" ? l.y = i + a - l.height / 2 : l.y = i + a / 2;
    }), i += a + r;
  });
}
function he(e, n = {}) {
  let t = n.debugTiming ? P : M;
  return t("layout", () => {
    let r = t("  buildLayoutGraph", () => Xt(e));
    return t("  runLayout", () => Dt(r, t, n)), t("  updateInputGraph", () => At(e, r)), r;
  });
}
function Dt(e, n, t) {
  n("    makeSpaceForEdgeLabels", () => Ut(e)), n("    removeSelfEdges", () => rr(e)), n("    acyclic", () => je(e)), n("    nestingGraph.run", () => Ke(e)), n("    rank", () => Xe(A(e))), n("    injectEdgeLabelProxies", () => Kt(e)), n("    removeEmptyRanks", () => Oe(e)), n("    nestingGraph.cleanup", () => Je(e)), n("    normalizeRanks", () => Te(e)), n("    assignRankMinMax", () => $t(e)), n("    removeEdgeLabelProxies", () => Jt(e)), n("    normalize.run", () => Fe(e)), n("    parentDummyChains", () => Ue(e)), n("    addBorderSegments", () => Ze(e)), n("    order", () => B(e, t)), n("    insertSelfEdges", () => or(e)), n("    adjustCoordinateSystem", () => nn(e)), n("    position", () => un(e)), n("    positionSelfEdges", () => ir(e)), n("    removeBorderNodes", () => tr(e)), n("    normalize.undo", () => De(e)), n("    fixupEdgeLabelCoords", () => er(e)), n("    undoCoordinateSystem", () => tn(e)), n("    translateGraph", () => Qt(e)), n("    assignNodeIntersects", () => Zt(e)), n("    reversePoints", () => nr(e)), n("    acyclic.undo", () => Se(e));
}
function At(e, n) {
  e.nodes().forEach((t) => {
    let r = e.node(t), o = n.node(t);
    r && (r.x = o.x, r.y = o.y, r.order = o.order, r.rank = o.rank, n.children(t).length && (r.width = o.width, r.height = o.height));
  }), e.edges().forEach((t) => {
    let r = e.edge(t), o = n.edge(t);
    r.points = o.points, Object.hasOwn(o, "x") && (r.x = o.x, r.y = o.y);
  }), e.graph().width = n.graph().width, e.graph().height = n.graph().height;
}
var Vt = ["nodesep", "edgesep", "ranksep", "marginx", "marginy"];
var Wt = { ranksep: 50, edgesep: 20, nodesep: 50, rankdir: "TB", rankalign: "center" };
var Bt = ["acyclicer", "ranker", "rankdir", "align", "rankalign"];
var Yt = ["width", "height", "rank"];
var cn = { width: 0, height: 0 };
var zt = ["minlen", "weight", "width", "height", "labeloffset"];
var Ht = { minlen: 1, weight: 1, width: 0, height: 0, labeloffset: 10, labelpos: "r" };
var qt = ["labelpos"];
function Xt(e) {
  let n = new p({ multigraph: true, compound: true }), t = ce(e.graph());
  return n.setGraph(Object.assign({}, Wt, ue(t, Vt), T(t, Bt))), e.nodes().forEach((r) => {
    let o = ce(e.node(r)), i = ue(o, Yt);
    Object.keys(cn).forEach((a) => {
      i[a] === void 0 && (i[a] = cn[a]);
    }), n.setNode(r, i);
    let s = e.parent(r);
    s !== void 0 && n.setParent(r, s);
  }), e.edges().forEach((r) => {
    let o = ce(e.edge(r));
    n.setEdge(r, Object.assign({}, Ht, ue(o, zt), T(o, qt)));
  }), n;
}
function Ut(e) {
  let n = e.graph();
  n.ranksep /= 2, e.edges().forEach((t) => {
    let r = e.edge(t);
    r.minlen *= 2, r.labelpos.toLowerCase() !== "c" && (n.rankdir === "TB" || n.rankdir === "BT" ? r.width += r.labeloffset : r.height += r.labeloffset);
  });
}
function Kt(e) {
  e.edges().forEach((n) => {
    let t = e.edge(n);
    if (t.width && t.height) {
      let r = e.node(n.v), i = { rank: (e.node(n.w).rank - r.rank) / 2 + r.rank, e: n };
      w(e, "edge-proxy", i, "_ep");
    }
  });
}
function $t(e) {
  let n = 0;
  e.nodes().forEach((t) => {
    let r = e.node(t);
    r.borderTop && (r.minRank = e.node(r.borderTop).rank, r.maxRank = e.node(r.borderBottom).rank, n = Math.max(n, r.maxRank));
  }), e.graph().maxRank = n;
}
function Jt(e) {
  e.nodes().forEach((n) => {
    let t = e.node(n);
    if (t.dummy === "edge-proxy") {
      let r = t;
      e.edge(r.e).labelRank = t.rank, e.removeNode(n);
    }
  });
}
function Qt(e) {
  let n = Number.POSITIVE_INFINITY, t = 0, r = Number.POSITIVE_INFINITY, o = 0, i = e.graph(), s = i.marginx || 0, a = i.marginy || 0;
  function d(l) {
    let u = l.x, c = l.y, h = l.width, f = l.height;
    n = Math.min(n, u - h / 2), t = Math.max(t, u + h / 2), r = Math.min(r, c - f / 2), o = Math.max(o, c + f / 2);
  }
  e.nodes().forEach((l) => d(e.node(l))), e.edges().forEach((l) => {
    let u = e.edge(l);
    Object.hasOwn(u, "x") && d(u);
  }), n -= s, r -= a, e.nodes().forEach((l) => {
    let u = e.node(l);
    u.x -= n, u.y -= r;
  }), e.edges().forEach((l) => {
    let u = e.edge(l);
    u.points.forEach((c) => {
      c.x -= n, c.y -= r;
    }), Object.hasOwn(u, "x") && (u.x -= n), Object.hasOwn(u, "y") && (u.y -= r);
  }), i.width = t - n + s, i.height = o - r + a;
}
function Zt(e) {
  e.edges().forEach((n) => {
    let t = e.edge(n), r = e.node(n.v), o = e.node(n.w), i, s;
    t.points ? (i = t.points[0], s = t.points[t.points.length - 1]) : (t.points = [], i = o, s = r), t.points.unshift(H(r, i)), t.points.push(H(o, s));
  });
}
function er(e) {
  e.edges().forEach((n) => {
    let t = e.edge(n);
    if (Object.hasOwn(t, "x")) switch ((t.labelpos === "l" || t.labelpos === "r") && (t.width -= t.labeloffset), t.labelpos) {
      case "l":
        t.x -= t.width / 2 + t.labeloffset;
        break;
      case "r":
        t.x += t.width / 2 + t.labeloffset;
        break;
    }
  });
}
function nr(e) {
  e.edges().forEach((n) => {
    let t = e.edge(n);
    t.reversed && t.points.reverse();
  });
}
function tr(e) {
  e.nodes().forEach((n) => {
    if (e.children(n).length) {
      let t = e.node(n), r = e.node(t.borderTop), o = e.node(t.borderBottom), i = e.node(t.borderLeft[t.borderLeft.length - 1]), s = e.node(t.borderRight[t.borderRight.length - 1]);
      t.width = Math.abs(s.x - i.x), t.height = Math.abs(o.y - r.y), t.x = i.x + t.width / 2, t.y = r.y + t.height / 2;
    }
  }), e.nodes().forEach((n) => {
    e.node(n).dummy === "border" && e.removeNode(n);
  });
}
function rr(e) {
  e.edges().forEach((n) => {
    if (n.v === n.w) {
      let t = e.node(n.v);
      t.selfEdges || (t.selfEdges = []), t.selfEdges.push({ e: n, label: e.edge(n) }), e.removeEdge(n);
    }
  });
}
function or(e) {
  N(e).forEach((t) => {
    let r = 0;
    t.forEach((o, i) => {
      let s = e.node(o);
      s.order = i + r, (s.selfEdges || []).forEach((a) => {
        w(e, "selfedge", { width: a.label.width, height: a.label.height, rank: s.rank, order: i + ++r, e: a.e, label: a.label }, "_se");
      }), delete s.selfEdges;
    });
  });
}
function ir(e) {
  e.nodes().forEach((n) => {
    let t = e.node(n);
    if (t.dummy === "selfedge") {
      let r = t, o = e.node(r.e.v), i = o.x + o.width / 2, s = o.y, a = t.x - i, d = o.height / 2;
      e.setEdge(r.e, r.label), e.removeNode(n), r.label.points = [{ x: i + 2 * a / 3, y: s - d }, { x: i + 5 * a / 6, y: s - d }, { x: i + a, y: s }, { x: i + 5 * a / 6, y: s + d }, { x: i + 2 * a / 3, y: s + d }], r.label.x = t.x, r.label.y = t.y;
    }
  });
}
function ue(e, n) {
  return O(T(e, n), Number);
}
function ce(e) {
  let n = {};
  return e && Object.entries(e).forEach(([t, r]) => {
    typeof t == "string" && (t = t.toLowerCase()), n[t] = r;
  }), n;
}
function fe(e) {
  let n = N(e), t = new p({ compound: true, multigraph: true }).setGraph({});
  return e.nodes().forEach((r) => {
    t.setNode(r, { label: r }), t.setParent(r, "layer" + e.node(r).rank);
  }), e.edges().forEach((r) => t.setEdge(r.v, r.w, {}, r.name)), n.forEach((r, o) => {
    let i = "layer" + o;
    t.setNode(i, { rank: "same" }), r.reduce((s, a) => (t.setEdge(s, a, { style: "invis" }), a));
  }), t;
}
var sr = { graphlib: z, version: U, layout: he, debug: fe, util: { time: P, notime: M } };
var To = sr;

// src/client/family-tree.ts
var NODE_W = 136;
var NODE_H = 72;
var API = "/api/family";
var GENDER_STYLE = {
  male: { fill: "rgba(100,198,255,0.35)", stroke: "#64c6ff", avatar: "#64c6ff", dot: "#64c6ff" },
  female: { fill: "rgba(255,88,174,0.28)", stroke: "#ff58ae", avatar: "#ff58ae", dot: "#ff58ae" },
  unknown: { fill: "#ffffff", stroke: "#f2f0ed", avatar: "#f2f0ed", dot: null }
};
function genderStyle(gender) {
  return GENDER_STYLE[gender] ?? GENDER_STYLE.unknown;
}
var state = {
  persons: [],
  focusId: null,
  selectedId: null,
  highlightId: null,
  graph: null,
  zoomTransform: identity2,
  zoomScale: 1
};
var MOBILE_MQ = window.matchMedia("(max-width: 1024px), (pointer: coarse)");
var el = {
  svg: document.getElementById("ft-svg"),
  empty: document.getElementById("ft-empty"),
  focusSelect: document.getElementById("ft-focus-select"),
  focusBadge: document.getElementById("ft-focus-badge"),
  genUp: document.getElementById("ft-gen-up"),
  genDown: document.getElementById("ft-gen-down"),
  search: document.getElementById("ft-search"),
  zoomLabel: document.getElementById("ft-zoom-label"),
  panel: document.getElementById("ft-panel"),
  panelBackdrop: document.getElementById("ft-panel-backdrop"),
  panelClose: document.getElementById("ft-panel-close"),
  panelEmpty: document.getElementById("ft-panel-empty"),
  detailForm: document.getElementById("ft-detail-form"),
  personId: document.getElementById("ft-person-id"),
  name: document.getElementById("ft-name"),
  gender: document.getElementById("ft-gender"),
  birth: document.getElementById("ft-birth"),
  death: document.getElementById("ft-death"),
  avatar: document.getElementById("ft-avatar"),
  bio: document.getElementById("ft-bio"),
  father: document.getElementById("ft-father"),
  mother: document.getElementById("ft-mother"),
  spouse: document.getElementById("ft-spouse"),
  panelMsg: document.getElementById("ft-panel-msg"),
  addDialog: document.getElementById("ft-add-dialog"),
  addForm: document.getElementById("ft-add-form"),
  addName: document.getElementById("ft-add-name"),
  addGender: document.getElementById("ft-add-gender"),
  addBirth: document.getElementById("ft-add-birth"),
  addRelationType: document.getElementById("ft-add-relation-type"),
  addRelatedWrap: document.getElementById("ft-add-related-wrap"),
  addRelated: document.getElementById("ft-add-related"),
  addMsg: document.getElementById("ft-add-msg")
};
var gRoot;
var gZoom;
var zoomBehavior;
function isMobile() {
  return MOBILE_MQ.matches;
}
function updateFocusBadge() {
  if (!el.focusBadge) return;
  const p2 = state.persons.find((x2) => x2.id === state.focusId);
  el.focusBadge.textContent = p2 ? `\u7126\u70B9\uFF1A${p2.name}` : "\u7126\u70B9\uFF1A\u2014";
}
function openPanel() {
  if (!isMobile() || !el.panel) return;
  el.panel.classList.add("ft-panel--open");
  if (el.panelBackdrop) {
    el.panelBackdrop.hidden = false;
    el.panelBackdrop.setAttribute("aria-hidden", "false");
  }
}
function closePanel() {
  if (!el.panel) return;
  el.panel.classList.remove("ft-panel--open");
  if (el.panelBackdrop) {
    el.panelBackdrop.hidden = true;
    el.panelBackdrop.setAttribute("aria-hidden", "true");
  }
}
async function api(path, options) {
  const res = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `\u8BF7\u6C42\u5931\u8D25 (${res.status})`);
  return data;
}
function setMsg(node, text, type2 = "") {
  node.textContent = text;
  node.className = `form-msg${type2 ? ` form-msg--${type2}` : ""}`;
}
function personLabel(p2) {
  return `${p2.name}${p2.birth_date ? ` (${p2.birth_date})` : ""}`;
}
function fillPersonSelect(select, persons, selectedId, excludeId, emptyLabel = "\u2014 \u65E0 \u2014") {
  select.innerHTML = `<option value="">${emptyLabel}</option>`;
  for (const p2 of persons) {
    if (excludeId && p2.id === excludeId) continue;
    const opt = document.createElement("option");
    opt.value = String(p2.id);
    opt.textContent = personLabel(p2);
    if (p2.id === selectedId) opt.selected = true;
    select.appendChild(opt);
  }
}
function setEmptyState(visible, message = "", showAddBtn = true) {
  if (!el.empty) return;
  el.empty.hidden = !visible;
  if (visible && message) {
    el.empty.querySelector("p").textContent = message;
  }
  const addBtn = document.getElementById("ft-empty-add");
  if (addBtn) addBtn.hidden = !showAddBtn;
}
async function loadPersons() {
  const data = await api("/persons");
  state.persons = data.persons ?? [];
  if (state.persons.length > 0) {
    setEmptyState(false);
  }
  return state.persons;
}
function refreshFocusSelect() {
  const prev = state.focusId;
  el.focusSelect.innerHTML = "";
  for (const p2 of state.persons) {
    const opt = document.createElement("option");
    opt.value = String(p2.id);
    opt.textContent = personLabel(p2);
    el.focusSelect.appendChild(opt);
  }
  if (state.persons.length === 0) {
    state.focusId = null;
    updateFocusBadge();
    return;
  }
  if (prev && state.persons.some((p2) => p2.id === prev)) {
    state.focusId = prev;
  } else {
    state.focusId = state.persons[0].id;
  }
  el.focusSelect.value = String(state.focusId);
  updateFocusBadge();
}
async function loadTree() {
  if (!state.focusId && state.persons.length > 0) {
    refreshFocusSelect();
  }
  if (!state.focusId) {
    state.graph = null;
    renderGraph();
    if (state.persons.length === 0) {
      setEmptyState(true, "\u8FD8\u6CA1\u6709\u5BB6\u65CF\u6210\u5458\uFF0C\u70B9\u51FB\u4E0B\u65B9\u6309\u94AE\u6DFB\u52A0\u7B2C\u4E00\u4F4D\u7956\u5148");
    } else {
      setEmptyState(true, "\u65E0\u6CD5\u786E\u5B9A\u7126\u70B9\u6210\u5458", false);
    }
    return;
  }
  setEmptyState(false);
  const up = Number(el.genUp.value) || 3;
  const down = Number(el.genDown.value) || 3;
  state.graph = await api(`/tree?focus=${state.focusId}&up=${up}&down=${down}`);
  if (!state.graph.nodes || state.graph.nodes.length === 0) {
    setEmptyState(true, "\u6682\u65E0\u53EF\u89C1\u8282\u70B9\uFF0C\u8BF7\u5207\u6362\u7126\u70B9\u6216\u6DFB\u52A0\u5173\u7CFB", false);
    renderGraph();
    return;
  }
  setEmptyState(false);
  renderGraph();
  fitView();
}
function layoutGraph(graph) {
  const g = new To.graphlib.Graph();
  g.setGraph({ rankdir: "TB", nodesep: 48, ranksep: 64, marginx: 40, marginy: 40 });
  g.setDefaultEdgeLabel(() => ({}));
  for (const node of graph.nodes) {
    g.setNode(String(node.id), { width: NODE_W, height: NODE_H, person: node });
  }
  for (const edge of graph.edges) {
    if (edge.type === "parent") {
      g.setEdge(String(edge.from), String(edge.to), { edgeType: "parent" });
    }
  }
  To.layout(g);
  const positions = /* @__PURE__ */ new Map();
  g.nodes().forEach((id2) => {
    const n = g.node(id2);
    positions.set(Number(id2), { x: n.x, y: n.y, person: n.person });
  });
  const spouseEdges = graph.edges.filter((e) => e.type === "spouse");
  for (const edge of spouseEdges) {
    const a = positions.get(edge.from);
    const b = positions.get(edge.to);
    if (!a || !b) continue;
    const avgY = (a.y + b.y) / 2;
    a.y = avgY;
    b.y = avgY;
    const gap = NODE_W + 24;
    const mid = (a.x + b.x) / 2;
    a.x = mid - gap / 2;
    b.x = mid + gap / 2;
    positions.set(edge.from, a);
    positions.set(edge.to, b);
  }
  return { positions, spouseEdges, parentEdges: graph.edges.filter((e) => e.type === "parent") };
}
function initSvg() {
  const wrap = el.svg.parentElement;
  const rect = wrap.getBoundingClientRect();
  select_default2(el.svg).selectAll("*").remove();
  select_default2(el.svg).attr("width", rect.width).attr("height", rect.height);
  gRoot = select_default2(el.svg).append("g").attr("class", "ft-root");
  gZoom = gRoot.append("g").attr("class", "ft-zoom-layer");
  zoomBehavior = zoom_default2().scaleExtent([0.2, 3]).filter((event) => {
    if (event.type === "dblclick") return false;
    const target = event.target;
    if (target instanceof Element && target.closest(".ft-node")) return false;
    return !event.ctrlKey && !event.button;
  }).on("zoom", (event) => {
    state.zoomTransform = event.transform;
    state.zoomScale = event.transform.k;
    gZoom.attr("transform", event.transform);
    el.zoomLabel.textContent = `${Math.round(event.transform.k * 100)}%`;
  });
  select_default2(el.svg).call(zoomBehavior).on("dblclick.zoom", null);
}
function linkPath(from, to) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const midY = from.y + dy * 0.45;
  return `M${from.x},${from.y + NODE_H / 2} C${from.x},${midY} ${to.x},${midY} ${to.x},${to.y - NODE_H / 2}`;
}
function spousePath(a, b) {
  return `M${a.x},${a.y} L${b.x},${b.y}`;
}
function renderGraph() {
  if (!gRoot) initSvg();
  else {
    const wrap = el.svg.parentElement;
    const rect = wrap.getBoundingClientRect();
    select_default2(el.svg).attr("width", rect.width).attr("height", rect.height);
  }
  gZoom.selectAll("*").remove();
  if (!state.graph || state.graph.nodes.length === 0) return;
  const { positions, spouseEdges, parentEdges } = layoutGraph(state.graph);
  const edgesG = gZoom.append("g").attr("class", "ft-edges");
  edgesG.selectAll(".ft-edge--parent").data(parentEdges).join("path").attr("class", "ft-edge ft-edge--parent").attr("d", (d) => {
    const from = positions.get(d.from);
    const to = positions.get(d.to);
    if (!from || !to) return "";
    return linkPath(from, to);
  });
  edgesG.selectAll(".ft-edge--spouse").data(spouseEdges).join("path").attr("class", "ft-edge ft-edge--spouse").attr("d", (d) => {
    const a = positions.get(d.from);
    const b = positions.get(d.to);
    if (!a || !b) return "";
    return spousePath(a, b);
  });
  const nodesG = gZoom.selectAll(".ft-node").data(state.graph.nodes).join("g").attr("class", (d) => {
    let cls = "ft-node";
    if (d.id === state.selectedId) cls += " ft-node--selected";
    if (d.id === state.highlightId) cls += " ft-node--highlight";
    return cls;
  }).attr("transform", (d) => {
    const pos = positions.get(d.id);
    if (!pos) return "translate(0,0)";
    return `translate(${pos.x - NODE_W / 2},${pos.y - NODE_H / 2})`;
  }).style("touch-action", "manipulation").on("pointerup", (event, d) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    event.stopPropagation();
    selectPerson(d.id);
  });
  nodesG.filter((d) => d.id === state.graph.focus_id).append("text").attr("class", "ft-node-focus-label").attr("x", NODE_W / 2).attr("y", -6).text("\u7126\u70B9");
  nodesG.filter((d) => d.id === state.graph.focus_id).append("rect").attr("class", "ft-node-focus-ring").attr("x", -4).attr("y", -4).attr("width", NODE_W + 8).attr("height", NODE_H + 8).attr("rx", 10).attr("pointer-events", "none");
  nodesG.append("rect").attr("class", (d) => {
    let c = "ft-node-card";
    if (d.gender === "male") c += " ft-node-card--male";
    if (d.gender === "female") c += " ft-node-card--female";
    return c;
  }).attr("width", NODE_W).attr("height", NODE_H).attr("rx", 8).attr("fill", (d) => genderStyle(d.gender).fill).attr("stroke", (d) => {
    if (d.id === state.selectedId) return "#ff3e00";
    if (d.id === state.highlightId) return "#00c978";
    return genderStyle(d.gender).stroke;
  }).attr(
    "stroke-width",
    (d) => d.id === state.selectedId || d.id === state.highlightId ? 3 : 2
  );
  nodesG.each(function(d) {
    const g = select_default2(this);
    const gs = genderStyle(d.gender);
    if (d.avatar_url) {
      g.append("image").attr("href", d.avatar_url).attr("x", 8).attr("y", 10).attr("width", 36).attr("height", 36).attr("clip-path", "inset(0 round 18px)");
    } else {
      let avatarCls = "ft-node-avatar-bg";
      if (d.gender === "male") avatarCls += " ft-node-avatar-bg--male";
      if (d.gender === "female") avatarCls += " ft-node-avatar-bg--female";
      g.append("circle").attr("class", avatarCls).attr("cx", 26).attr("cy", 28).attr("r", 18).attr("fill", gs.avatar);
      let textCls = "ft-node-avatar-text";
      if (d.gender === "male" || d.gender === "female") textCls += " ft-node-avatar-text--on-color";
      g.append("text").attr("class", textCls).attr("x", 26).attr("y", 28).attr("fill", d.gender === "male" || d.gender === "female" ? "#ffffff" : null).text(d.name.charAt(0));
    }
  });
  nodesG.filter((d) => genderStyle(d.gender).dot).append("circle").attr("class", "ft-node-gender-dot").attr("cx", NODE_W - 12).attr("cy", 12).attr("r", 4).attr("fill", (d) => genderStyle(d.gender).dot);
  nodesG.append("text").attr("class", "ft-node-name").attr("x", (d) => d.avatar_url ? 72 : NODE_W / 2).attr("y", 30).text((d) => d.name.length > 8 ? `${d.name.slice(0, 8)}\u2026` : d.name);
  nodesG.append("text").attr("class", "ft-node-dates").attr("x", (d) => d.avatar_url ? 72 : NODE_W / 2).attr("y", 48).text((d) => {
    if (d.birth_date && d.death_date) return `${d.birth_date} \u2014 ${d.death_date}`;
    if (d.birth_date) return `\u751F\u4E8E ${d.birth_date}`;
    if (d.death_date) return `\u2014 ${d.death_date}`;
    return "";
  });
}
function fitView() {
  if (!state.graph || state.graph.nodes.length === 0 || !gZoom) return;
  const bbox = gZoom.node().getBBox();
  if (!bbox.width || !bbox.height) return;
  const svg = el.svg;
  const width = svg.clientWidth;
  const height = svg.clientHeight;
  const pad = 48;
  const scale = Math.min(3, Math.max(0.2, Math.min((width - pad) / bbox.width, (height - pad) / bbox.height)));
  const tx = width / 2 - scale * (bbox.x + bbox.width / 2);
  const ty = height / 2 - scale * (bbox.y + bbox.height / 2);
  const transform2 = identity2.translate(tx, ty).scale(scale);
  select_default2(svg).call(zoomBehavior.transform, transform2);
}
function centerOnNode(nodeId) {
  if (!gZoom) return;
  const node = gZoom.selectAll(".ft-node").filter((d) => d.id === nodeId);
  if (node.empty()) return;
  const transform2 = transform(el.svg);
  const bbox = node.node().getBBox();
  const matrix = node.node().getCTM();
  if (!matrix) return;
  const cx = matrix.a * (bbox.x + bbox.width / 2) + matrix.e;
  const cy = matrix.d * (bbox.y + bbox.height / 2) + matrix.f;
  const width = el.svg.clientWidth;
  const height = el.svg.clientHeight;
  const scale = Math.max(transform2.k, 1);
  const tx = width / 2 - cx * (scale / transform2.k);
  const ty = height / 2 - cy * (scale / transform2.k);
  select_default2(el.svg).call(
    zoomBehavior.transform,
    identity2.translate(tx, ty).scale(scale)
  );
}
async function openEditorForSelection() {
  const id2 = state.selectedId ?? state.focusId;
  if (!id2) {
    window.alert("\u8BF7\u5148\u70B9\u51FB\u8282\u70B9\u6216\u8BBE\u7F6E\u7126\u70B9");
    return;
  }
  await selectPerson(id2);
}
async function selectPerson(id2) {
  state.selectedId = id2;
  const data = await api(`/persons/${id2}`);
  const p2 = data.person;
  el.panelEmpty.hidden = true;
  el.detailForm.hidden = false;
  el.personId.value = String(p2.id);
  el.name.value = p2.name;
  el.gender.value = p2.gender;
  el.birth.value = p2.birth_date ?? "";
  el.death.value = p2.death_date ?? "";
  el.avatar.value = p2.avatar_url ?? "";
  el.bio.value = p2.bio ?? "";
  fillPersonSelect(el.father, state.persons, p2.father_id, p2.id);
  fillPersonSelect(el.mother, state.persons, p2.mother_id, p2.id);
  fillPersonSelect(el.spouse, state.persons, p2.spouse_ids[0] ?? null, p2.id);
  setMsg(el.panelMsg, "");
  renderGraph();
  openPanel();
}
function openAddDialog(relatedId) {
  setMsg(el.addMsg, "");
  el.addForm.reset();
  fillPersonSelect(el.addRelated, state.persons, relatedId ?? null, null);
  if (relatedId) {
    el.addRelationType.value = "child";
    el.addRelatedWrap.hidden = false;
    el.addRelated.value = String(relatedId);
  } else {
    el.addRelatedWrap.hidden = el.addRelationType.value === "";
  }
  el.addDialog.showModal();
}
async function savePerson(e) {
  e.preventDefault();
  const id2 = Number(el.personId.value);
  try {
    await api(`/persons/${id2}`, {
      method: "PATCH",
      body: JSON.stringify({
        name: el.name.value.trim(),
        gender: el.gender.value,
        birth_date: el.birth.value.trim() || null,
        death_date: el.death.value.trim() || null,
        avatar_url: el.avatar.value.trim() || null,
        bio: el.bio.value.trim() || null
      })
    });
    const person = (await api(`/persons/${id2}`)).person;
    async function syncParent(role, selectEl, currentId) {
      const newId2 = selectEl.value ? Number(selectEl.value) : null;
      if (newId2 === currentId) return;
      if (currentId) {
        await api("/parents", {
          method: "DELETE",
          body: JSON.stringify({ child_id: id2, role })
        });
      }
      if (newId2) {
        await api("/parents", {
          method: "PUT",
          body: JSON.stringify({ child_id: id2, parent_id: newId2, role })
        });
      }
    }
    await syncParent("father", el.father, person.father_id);
    await syncParent("mother", el.mother, person.mother_id);
    const newSpouseId = el.spouse.value ? Number(el.spouse.value) : null;
    const oldSpouseId = person.spouse_ids[0] ?? null;
    if (newSpouseId !== oldSpouseId) {
      if (oldSpouseId) {
        await api("/spouses", {
          method: "DELETE",
          body: JSON.stringify({ person_a_id: id2, person_b_id: oldSpouseId })
        });
      }
      if (newSpouseId) {
        await api("/spouses", {
          method: "PUT",
          body: JSON.stringify({ person_a_id: id2, person_b_id: newSpouseId })
        });
      }
    }
    setMsg(el.panelMsg, "\u5DF2\u4FDD\u5B58", "ok");
    await loadPersons();
    refreshFocusSelect();
    await loadTree();
    await selectPerson(id2);
  } catch (err) {
    setMsg(el.panelMsg, err.message, "error");
  }
}
async function deletePerson() {
  const id2 = Number(el.personId.value);
  const p2 = state.persons.find((x2) => x2.id === id2);
  const msg = p2 ? `\u786E\u5B9A\u5220\u9664\u300C${p2.name}\u300D\uFF1F\u5173\u8054\u7684\u7236\u6BCD/\u914D\u5076\u94FE\u63A5\u5C06\u4E00\u5E76\u79FB\u9664\u3002` : "\u786E\u5B9A\u5220\u9664\u8BE5\u6210\u5458\uFF1F";
  if (!confirm(msg)) return;
  try {
    await api(`/persons/${id2}`, { method: "DELETE" });
    state.selectedId = null;
    el.detailForm.hidden = true;
    el.panelEmpty.hidden = false;
    closePanel();
    setMsg(el.panelMsg, "");
    await loadPersons();
    refreshFocusSelect();
    await loadTree();
  } catch (err) {
    setMsg(el.panelMsg, err.message, "error");
  }
}
async function createPerson(e) {
  e.preventDefault();
  const name = el.addName.value.trim();
  if (!name) return;
  const body = {
    name,
    gender: el.addGender.value,
    birth_date: el.addBirth.value.trim() || null
  };
  const relType = el.addRelationType.value;
  const relatedId = el.addRelated.value ? Number(el.addRelated.value) : null;
  try {
    if (relType === "child" && relatedId) {
      body.father_id = void 0;
      body.mother_id = void 0;
      body.spouse_id = void 0;
    }
    const created = await api("/persons", { method: "POST", body: JSON.stringify(body) });
    const newId2 = created.person.id;
    if (relType === "child" && relatedId) {
      const related = state.persons.find((p2) => p2.id === relatedId);
      if (related?.gender === "male") {
        await api("/parents", {
          method: "PUT",
          body: JSON.stringify({ child_id: newId2, parent_id: relatedId, role: "father" })
        });
      } else if (related?.gender === "female") {
        await api("/parents", {
          method: "PUT",
          body: JSON.stringify({ child_id: newId2, parent_id: relatedId, role: "mother" })
        });
      } else {
        await api("/parents", {
          method: "PUT",
          body: JSON.stringify({ child_id: newId2, parent_id: relatedId, role: "father" })
        });
      }
    } else if (relType === "father" && relatedId) {
      await api("/parents", {
        method: "PUT",
        body: JSON.stringify({ child_id: relatedId, parent_id: newId2, role: "father" })
      });
    } else if (relType === "mother" && relatedId) {
      await api("/parents", {
        method: "PUT",
        body: JSON.stringify({ child_id: relatedId, parent_id: newId2, role: "mother" })
      });
    } else if (relType === "spouse" && relatedId) {
      await api("/spouses", {
        method: "PUT",
        body: JSON.stringify({ person_a_id: newId2, person_b_id: relatedId })
      });
    }
    el.addDialog.close();
    await loadPersons();
    state.focusId = newId2;
    refreshFocusSelect();
    await loadTree();
    await selectPerson(newId2);
  } catch (err) {
    setMsg(el.addMsg, err.message, "error");
  }
}
function setupEvents() {
  el.focusSelect.addEventListener("change", async () => {
    state.focusId = Number(el.focusSelect.value);
    updateFocusBadge();
    await loadTree();
  });
  el.genUp.addEventListener("change", () => loadTree());
  el.genDown.addEventListener("change", () => loadTree());
  el.search.addEventListener("input", () => {
    const q2 = el.search.value.trim().toLowerCase();
    if (!q2) {
      state.highlightId = null;
      renderGraph();
      return;
    }
    const found = state.persons.find((p2) => p2.name.toLowerCase().includes(q2));
    state.highlightId = found?.id ?? null;
    renderGraph();
    if (found) centerOnNode(found.id);
  });
  document.getElementById("ft-zoom-in").addEventListener("click", () => {
    select_default2(el.svg).transition().duration(200).call(zoomBehavior.scaleBy, 1.25);
  });
  document.getElementById("ft-zoom-out").addEventListener("click", () => {
    select_default2(el.svg).transition().duration(200).call(zoomBehavior.scaleBy, 0.8);
  });
  document.getElementById("ft-fit-btn").addEventListener("click", fitView);
  document.getElementById("ft-add-btn").addEventListener("click", () => openAddDialog());
  document.getElementById("ft-edit-btn")?.addEventListener("click", () => openEditorForSelection());
  document.getElementById("ft-empty-add").addEventListener("click", () => openAddDialog());
  document.getElementById("ft-add-cancel").addEventListener("click", () => el.addDialog.close());
  el.addRelationType.addEventListener("change", () => {
    el.addRelatedWrap.hidden = !el.addRelationType.value;
  });
  el.detailForm.addEventListener("submit", savePerson);
  document.getElementById("ft-delete-btn").addEventListener("click", deletePerson);
  el.addForm.addEventListener("submit", createPerson);
  document.getElementById("ft-focus-here").addEventListener("click", async () => {
    state.focusId = Number(el.personId.value);
    refreshFocusSelect();
    await loadTree();
  });
  el.panelClose?.addEventListener("click", closePanel);
  el.panelBackdrop?.addEventListener("click", closePanel);
  window.addEventListener("resize", () => {
    if (!isMobile()) closePanel();
    initSvg();
    renderGraph();
    fitView();
  });
}
function showEmpty(message, showAddButton = true) {
  setEmptyState(true, message, showAddButton);
}
async function init2() {
  setupEvents();
  initSvg();
  try {
    await loadPersons();
  } catch (err) {
    showEmpty(
      `\u65E0\u6CD5\u52A0\u8F7D\u6210\u5458\u5217\u8868\uFF1A${err.message}\u3002\u82E5\u5728\u7EBF\u4E0A\uFF0C\u8BF7\u786E\u8BA4 D1 \u5DF2\u7ED1\u5B9A\u4E14\u5DF2\u6267\u884C db:migrate:remote\u3002`,
      false
    );
    return;
  }
  refreshFocusSelect();
  if (state.persons.length === 0) {
    showEmpty("\u8FD8\u6CA1\u6709\u5BB6\u65CF\u6210\u5458\uFF0C\u70B9\u51FB\u4E0B\u65B9\u6309\u94AE\u6DFB\u52A0\u7B2C\u4E00\u4F4D\u7956\u5148");
    return;
  }
  try {
    await loadTree();
  } catch (err) {
    showEmpty(`\u6811\u56FE\u52A0\u8F7D\u5931\u8D25\uFF1A${err.message}`, false);
  }
}
init2().catch((err) => {
  console.error(err);
  showEmpty(`\u9875\u9762\u811A\u672C\u9519\u8BEF\uFF1A${err.message}`, false);
});
/*! Bundled license information:

@dagrejs/dagre/dist/dagre.esm.js:
  (*! For license information please see dagre.esm.js.LEGAL.txt *)
*/
