
var isround = "";
var scrollmove = "";
var masktime = 10;
var focus_cur = 1;
var p = document.getElementById("pic").getElementsByTagName("li");
var h = document.getElementById("tip").getElementsByTagName("li");
isround = setTimeout("change(2)",1000);


function change(id){
	clearTimeout(isround);
	clearInterval(scrollmove);
	for (var i = 1; i <= h.length; i++) {
		if(i == id){
			document.getElementById("smallimg_"+i).className="current";
		}else{
			document.getElementById("smallimg_"+i).className="";
		}
	}
	if ((next = id + 1) > h.length){
		next = 1;
	}
	isround = setTimeout("change("+next+")",1000);
	scrollmove = setInterval("scrollMove("+id+")",masktime);
	focus_cur = id;
}

function scrollMove(m){
	var srl = document.getElementById("pic").scrollLeft;
	
	var dsrl = Math.floor((p[0].clientWidth*(m-1)-srl)/5);
	
	var xsrl = Math.ceil((p[0].clientWidth*(m-1)-srl)/5);
	if(srl > p[0].clientWidth*(m-1)){
		document.getElementById("pic").scrollLeft = srl + dsrl;
	}else if(srl < p[0].clientWidth*(m-1)){
		document.getElementById("pic").scrollLeft = srl + xsrl;
	}else{
		clearInterval(scrollmove);
	}
}


