function getWeekDay(dayStamp){
	var weekDay = "星期" + "日一二三四五六".charAt(dayStamp);
	return weekDay;
}

function getStockBasic(stockName,stockNum){
	var stockJson = $().quotation(stockNum);
	console.log(stockJson);
	if( stockJson!="" && stockJson!= null && stockJson !=undefined ){
	
		document.getElementById(stockName+"Name").innerHTML = stockJson[1];
		document.getElementById(stockName+"Value").innerHTML = stockJson[3];
		document.getElementById(stockName+"RangeValue").innerHTML = stockJson[31];
		document.getElementById(stockName+"RangePercent").innerHTML = stockJson[32];
		
		if( parseFloat(stockJson[31]) < 0 && !isNaN(stockJson[31])){
		
			document.getElementById(stockName+"Value").style.color = "#1dbf60";
			document.getElementById(stockName+"RangeValue").style.color = "#1dbf60";
			document.getElementById(stockName+"RangePercent").style.color = "#1dbf60";
			
		}else if( parseFloat(stockJson[31]) > 0 && !isNaN(stockJson[31]) ){
		
			document.getElementById(stockName+"Value").style.color = "#f24957";
			document.getElementById(stockName+"RangeValue").style.color = "#f24957";
			document.getElementById(stockName+"RangePercent").style.color = "#f24957";
			
		}
	}
		
		
}

function getChineseDate(){
    var now = new Date();
    var year = now.getFullYear()+'年';
    var month = now.getMonth()+1+'月';
    var date = now.getDate()+'日';
	var hour = now.getHours()+':';
	var minute = now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes()+':';
	var second = now.getSeconds() < 10 ? "0" + now.getSeconds() : now.getSeconds();
	var weekDay = getWeekDay(now.getDay());
	
    return year+month+date+" "+hour+minute+second+" "+weekDay;
}

jQuery.fn.extend({  
    'quotation':function(stockCode){  
	var str = "";
        $.ajax({
				url:"http://qt.gtimg.cn/q="+stockCode,
				header:{
					"Access-Control-Allow-Origin":"*" 
				},
				//dataType: 'jsonp',
				//type: "POST",
				//contentType:"application/json; charset=utf-8",
				async:false,
				success:function(msg){ 
				    console.log(msg) 
					str = msg.split("~");
					for( var o in str){
						console.log("--"+o+"--"+str[o]); 
					}
				}, 
				error:function(){ 
			    	console.log("quotation error") ;
					alert("获取股票信息失败");
				} 
			}); 
			return str;
    }  
})  

$('.nav.nav-tabs a').click(function (e) {
		e.preventDefault()
		$(this).tab('show')
})