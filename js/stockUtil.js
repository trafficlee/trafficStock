
function getWeekDay(dayStamp){
	var weekDay = "星期" + "日一二三四五六".charAt(dayStamp);
	return weekDay;
}



/**获取股票基本信息
*
*  stockName  DOM id
*  stockNum   股票代码
*/
function getStockBasic(stockName,stockNum){
	var stockJson = $().quotation(stockNum);
	
	console.log(stockJson);
	if( stockJson){
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
}

function gettimeSharing(stockCode){
	debugger;
	var timeSharingArr = $().timeSharing(stockCode);
	console.log(timeSharingArr);
	//return timeSharingArr;
}


//获取时间戳
function getTimestamp(timestamp){
	// 今天
	var today = new Date();
	today.setHours(0);
	today.setMinutes(0);
	today.setSeconds(0);
	today.setMilliseconds(0);
	
	
	var todayTimestamp ;
	
	
	var oneday = 1000 * 60 * 60 * 24;
	// 昨天
	var yesterday = new Date(today - oneday);
	
	// 上周一
	var lastMonday = new Date(today- oneday * (today.getDay() + 6));
	
	// 上个月1号
	var lastMonthFirst = new Date(today - oneday * today.getDate());
	lastMonthFirst = new Date(lastMonthFirst - oneday * (lastMonthFirst.getDate() - 1));
	
	switch(timestamp){
		
		case "today":
		todayTimestamp = Date.parse(today);
		break;
		
		case "yesterday":
		todayTimestamp = Date.parse(yesterday);
		break;
		
		case "lastMonday":
		todayTimestamp = Date.parse(lastMonday);
		break;
		
		case "lastMonthFirst":
		todayTimestamp = Date.parse(lastMonthFirst);
		break;
	}
	return todayTimestamp;
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


//股票行情ajax
jQuery.fn.extend({  
    'quotation':function(stockCode){

	var stockArr;
        $.ajax({
				url:"http://qt.gtimg.cn/q="+stockCode,
				async:false,
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



//分时json ajax
jQuery.fn.extend({  
    'timeSharing':function(stockCode){

	//var timeSharingArr;
        $.ajax({
			url:"https://gupiao.baidu.com/api/stocks/stocktimeline?from=pc&os_ver=1&cuid=xxx&vv=100&format=json&stock_code="+stockCode,
			async:false,
			dataType:'JSONP',
			jsonp:"callback",
			
			success:function(msg){ 
				console.log(msg) ;
				timeSharingArr = msg;
				console.log(timeSharingArr) ;
			}, 
			error:function(msg){ 
				console.log("timeSharing Error");
				console.log(msg) ;
			},
		}); 
		//return timeSharingArr;
    }  
})  

