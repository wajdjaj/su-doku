var express = require("express");
var cors = require("cors");
require("dotenv").config();

var PORT = process.env.PORT || 9000;

var app = express();
app.use(cors({}));

app.get("/easy", function(req, res) {
  res.send(
    "026730941571492638349168275195384762762951384438627519914573826257816493683249157"
  );
});
app.get("/medium", function(req, res) {
  res.send(
    "820005041001492600340100075105304060700050384038620500014073020207800403080049107"
  );
});

app.get("/hard", function(req, res) {
  res.send(
    "320000080000700506000081070000008362000090000653100000030210000908007000010000039"
  );
});

app.listen(PORT, () => {
  console.log("backend listening at " + PORT);
});
