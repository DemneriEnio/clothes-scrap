var express = require("express");
var Xray = require('x-ray');
var Horseman = require("node-horseman");

var app = express();
var horseman = new Horseman({timeout:60000});
var x = Xray();

var results=[];
var data1, data2, data3, data4;

var arr = [	"http://www.rebeccaminkoff.com/edina-top",
			"http://www.rebeccaminkoff.com/arnie-jacket-sp1720102a",
			"http://www.rebeccaminkoff.com/shlee-dungarees",
			"http://www.rebeccaminkoff.com/regan-satchel-hs16ipbs31-black-pebbled"];

app.get("/", function(req, res){

	results=[];

	function recursive(n){

		horseman
			.open(arr[n])
			.text("div#desc-options div:nth-child(1)")
			.then(function(info1){

				var str= info1.split("Color: ");
				info1 = str.join("");
				data1=info1;
				console.log(info1);

			})

			.attribute("ul.product-image-thumbs li img", "src")
			.then(function(info2){

				data2=info2;
				console.log(info2);

			})

			.text("dl#collateral-tabs p")
			.then(function(info3){

				data3=info3;
				console.log(info3);

			})

			.html("dl#collateral-tabs ul")
			.then(function(info4){

				var temp = info4.split("<li>");
				info4 = temp.join("");
				temp=info4.split("</li>");
				info4=temp.join("~");

				console.log(info4);
				data4=info4;

				results.push({color:data1,img:data2,description:data3,material:data4});

				n++;
				console.log(n);

				if(n==arr.length){
					res.json(results);
					return;
				}
				else{
					recursive(n);
				}

			});

	}

	recursive (0);

});

app.listen(8080);
