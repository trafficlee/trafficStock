function getWeekDay(dayStamp){
	var weekDay = "星期" + "日一二三四五六".charAt(dayStamp);
	return weekDay;
}

function getStockBasic(stockName,stockNum){
	var stockJson = $().quotation(stockNum);
	
	for( var i = 0; i < stockJson.length ;  i++){
		
		if( stockJson[i].trim()!="" && stockJson[i]!= null && stockJson[i] !=undefined ){
			
			stock = stockJson[i].split("~");
			document.getElementById(stockName+"Name").innerHTML = stock[1];
			document.getElementById(stockName+"Value").innerHTML = stock[3];
			document.getElementById(stockName+"RangeValue").innerHTML = stock[31];
			document.getElementById(stockName+"RangePercent").innerHTML = stock[32];
			
			if( parseFloat(stock[31]) < 0 && !isNaN(stock[31])){
			
				document.getElementById(stockName+"Value").style.color = "#1dbf60";
				document.getElementById(stockName+"RangeValue").style.color = "#1dbf60";
				document.getElementById(stockName+"RangePercent").style.color = "#1dbf60";
				
			}else if( parseFloat(stock[31]) > 0 && !isNaN(stock[31]) ){
			
				document.getElementById(stockName+"Value").style.color = "#f24957";
				document.getElementById(stockName+"RangeValue").style.color = "#f24957";
				document.getElementById(stockName+"RangePercent").style.color = "#f24957";
				
			}
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

	var stockArr;
        $.ajax({
				url:"http://qt.gtimg.cn/q="+stockCode,

				//type: "POST",
				//contentType:"application/json; charset=utf-8",
				async:false,
				/*beforeSend: function(jqXHR) {
                    jqXHR.overrideMimeType('text/xml;charset=GBK');

                    jqXHR.setRequestHeader("Access-Control-Allow-Origin", "*");
                    jqXHR.setRequestHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                    jqXHR.setRequestHeader("Access-Control-Allow-Methods","POST, GET, OPTIONS, DELETE, PUT, HEAD");
					jqXHR.setRequestHeader("Access-Control-Allow-Methods","POST, GET, OPTIONS, DELETE, PUT, HEAD");
					
                },*/
				headers :{
					'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8',
					//"Access-Control-Allow-Origin": "*"
				},
				success:function(msg){ 
				    console.log("--success--"+msg) ;
					stockArr = msg.split(";");
					console.log(stockArr) ;
				}, 
				error:function(msg){ 
					console.log("quotation Error");
			    	console.log(msg) ;
				},
			}); 
			return stockArr;
    }  
})  
/*
$('.nav.nav-tabs a').click(function (e) {
		e.preventDefault();
		
		
})*/