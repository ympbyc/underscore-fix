var data = [{"fname": "山田", "lname": "太郎", "address": "東京一丁目"},
            {"fname": "竹下", "lname": "智子", "address": "横浜二丁目"}];

var desired_output = "山田 太郎 東京一丁目, 竹下 智子 横浜二丁目";

// if we don't use underscore-fix

var naive = function (data) {
  var i = 0; l = data.length;
  var strs = [];
  for (; i < l; ++i)
    strs.push(data[i].fname + " " + data[i].lname + " " + data[i].address);
  return strs.join(", ");
};



//if we use underscore-fix

var f = _.compose(_.flippar(_.join, ", "),
                  _.flippar(_.map, function (x) {
                      return _.pipe(_.pick(x, "fname", "lname", "address"),
                                    _.values,
                                    _.flippar(_.join, " ")); }));
