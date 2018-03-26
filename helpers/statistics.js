export function median(values, func) {
  if (!func) func = x => x;
  values = values.slice(0).sort(function(a, b) {
    return func(a) - func(b);
  });
  return percentile(values, 0.5, func);
}

export function percentile(values, perc, func) {
  if (!func) func = x => x;
  var len = values.length;
  if (len == 1) return func(values[0]);
  var split = Math.floor(len / (1 / perc));
  if (len % 2) return (func(values[split - 1]) + func(values[split])) / 2.0;
  else return func(values[split]);
}

export function countConsecutive(array, func) {
  if (array.length == 1) {
    return {
      key: func(array[0]),
      count: 1
    };
  }
  var res = {};
  var consecutive = 1;
  for (let i = 0; i < array.length; i++) {
    if (!res["r" + func(array[i])]) res["r" + func(array[i])] = 1; // että kaikki pisteet tulee laskettua
    if (i > 0 && func(array[i]) == func(array[i - 1])) {
      consecutive = consecutive + 1;
      res["r" + func(array[i])] = Math.max(
        res["r" + func(array[i])],
        consecutive
      );
    } else {
      // putki meni poikki
      consecutive = 1;
    }
  }
  var res2 = Object.keys(res).map((key, index) => ({
    key: key.slice(1),
    count: res[key]
  }));
  var res3 = res2.reduce(
    (prev, current) => (prev.count > current.count ? prev : current)
  );
  return res3;
}
