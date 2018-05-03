
function getWeekDay(dayStamp){
	var weekDay = "星期" + "日一二三四五六".charAt(dayStamp);
	return weekDay;
}

function getStockTimeShareSimpleDate(timeArrName,stockCode){
	$.ajax({
		url:"https://gupiao.baidu.com/api/stocks/stocktimeline?from=pc&os_ver=1&cuid=xxx&vv=100&format=json&stock_code="+stockCode,
		async:false,
		dataType:'JSONP',
		success:function(msg){ 
			console.log(msg) ;
			var valueArr = [];
			var preArr = [];
			var avgArr = [];
			var data = msg.data.timeline.timeline;
			
			for(var i = 0 ; i < data.length; i ++){
				
				var numStr = data[i].values[4];
				var numDouble = parseFloat(numStr);
				var num = numDouble.toFixed(2);
				var pre = data[i].values[9];
				var avg = data[i].values[6];
				avgArr.push(avg);
				preArr.push(pre);
				valueArr.push(num);
			}
			
			initSimpleChart(timeArrName,valueArr,preArr,avgArr);
			
		}, 
		error:function(msg){ 
			console.log("timeSharing Error");
			console.log(msg) ;
		},
	}); 
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
				document.getElementById(stockName+"RangePercent").innerHTML = stock[32]+"%";
				
				if( parseFloat(stock[31]) < 0 && !isNaN(stock[31])){
				
					document.getElementById(stockName+"Value").style.color = "#1dbf60";
					document.getElementById(stockName+"RangeValue").style.color = "#1dbf60";
					document.getElementById(stockName+"RangePercent").style.color = "#1dbf60";
					
				}else if( parseFloat(stock[31]) > 0 && !isNaN(stock[31]) ){
				
					document.getElementById(stockName+"Value").style.color = "#f24957";
					document.getElementById(stockName+"RangeValue").style.color = "#f24957";
					document.getElementById(stockName+"RangePercent").style.color = "#f24957";
					document.getElementById(stockName+"RangeValue").innerHTML = "+"+stock[31];
					document.getElementById(stockName+"RangePercent").innerHTML = "+"+stock[32]+"%";
					
				}
			}
		}
	}
}


//分时行情时间转换String
function getStringTime(objectDate){
	var timeString = objectDate.values[2].toString();
	var time = "";
	
	if( timeString.length > 8){
		var hour = timeString.substring(0,2);
		var minute = timeString.substring(2,4);
		time = hour + ":" + minute;
	}else{
		var hour = timeString.substring(0,1);
		var minute = timeString.substring(1,3);
		time = hour + ":" + minute;
		time = "0"+time;
	}
	
	return time;
}

//分时行情日期转换String
function getStringDate(objectDate){
	var dateString = objectDate.values[1].toString();
	var year = dateString.substring(0,4);
	var month = dateString.substring(4,6);
	var day = dateString.substring(6,8);
	var timeString = objectDate.values[2].toString();
	var time = "";
	
	if( timeString.length > 9){
		var hour = timeString.substring(0,2);
		var minute = timeString.substring(2,4);
		time = hour + ":" + minute;
	}else{
		var hour = timeString.substring(0,1);
		var minute = timeString.substring(1,3);
		time = hour + ":" + minute;
		time = "0"+time;
	}
	
	return year+"/"+month+"/"+day+" " +time;
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
    "timeSharing":function(stockCode){
		$.ajax({
			url:"https://gupiao.baidu.com/api/stocks/stocktimeline?from=pc&os_ver=1&cuid=xxx&vv=100&format=json&stock_code="+stockCode,
			async:false,
			dataType:'JSONP',
			success:function(msg){ 
				console.log("mag---"+msg) ;
				timeSharingArr = msg;
			}, 
			error:function(msg){ 
				console.log("timeSharing Error");
				console.log(msg) ;
			},
		}); 
	}
})


//初始化简单分时折线图
function initSimpleChart(timeArrName,valueArr,preArr,avgArr){
	
	var timeLineArr = [];
	var minInterval = 0;
	if( timeArrName == "AStock"){
	
		timeLineArr = [ "09:15","09:16", "09:17", "09:18", "09:19", "09:20", "09:21", "09:22", "09:23", "09:24", "09:25", "09:26", "09:27", "09:28", "09:29","09:30","09:31","09:32", "09:33", "09:34", "09:35", "09:36", "09:37", "09:38", "09:39", "09:40", "09:41", "09:42", "09:43", "09:44", "09:45", "09:46", "09:47", "09:48", "09:49", "09:50","09:51","09:52","09:53","09:54", "09:55","09:56","09:57","09:58","09:59","10:00","10:01","10:02","10:03","10:04","10:05","10:06","10:07","10:08","10:09","10:10","10:11","10:12","10:13","10:14","10:15","10:16","10:17","10:18","10:19","10:20","10:21","10:22","10:23","10:24","10:25","10:26","10:27","10:28","10:29","10:30","10:31","10:32","10:33","10:34","10:35","10:36","10:37","10:38","10:39","10:40","10:41","10:42","10:43","10:44","10:45","10:46","10:47","10:48","10:49","10:50","10:51","10:52","10:53","10:54","10:55","10:56","10:57","10:58","10:59","11:00","11:01","11:02","11:03","11:04","11:05","11:06","11:07","11:08","11:09","11:10","11:11","11:12","11:13","11:14","11:15","11:16","11:17","11:18","11:19","11:20","11:21","11:22","11:23","11:24","11:25","11:26","11:27","11:28","11:29","11:30","13:01","13:02","13:03","13:04","13:05","13:06","13:07","13:08","13:09","13:10","13:11","13:12","13:13","13:14","13:15","13:16","13:17","13:18","13:19","13:20","13:21","13:22","13:23","13:24","13:25","13:26","13:27","13:28","13:29","13:30","13:31","13:32","13:33","13:34","13:35","13:36","13:37","13:38","13:39","13:40","13:41","13:42","13:43","13:44","13:45","13:46","13:47","13:48","13:49","13:50","13:51","13:52","13:53","13:54","13:55","13:56","13:57","13:58","13:59","14:00","14:01","14:02","14:03","14:04","14:05","14:06","14:07","14:08","14:09","14:10","14:11","14:12","14:13","14:14","14:15","14:16","14:17","14:18","14:19","14:20","14:21","14:22","14:23","14:24","14:25","14:26","14:27","14:28","14:29","14:30","14:31","14:32","14:33","14:34","14:35","14:36","14:37","14:38","14:39","14:40","14:41","14:42","14:43","14:44","14:45","14:46","14:47","14:48","14:49","14:50","14:51","14:52","14:53","14:54","14:55","14:56","14:57","14:58","14:59","15:00"];
		minInterval = 500 ;
		
	}else if( timeArrName=="HKStock" ){
		minInterval = 5000;
		avgArr = [];
		timeLineArr = ["09:30","09:31","09:32", "09:33", "09:34", "09:35", "09:36", "09:37", "09:38", "09:39", "09:40", "09:41", "09:42", "09:43", "09:44", "09:45", "09:46", "09:47", "09:48", "09:49", "09:50","09:51","09:52","09:53","09:54", "09:55","09:56","09:57","09:58","09:59","10:00","10:01","10:02","10:03","10:04","10:05","10:06","10:07","10:08","10:09","10:10","10:11","10:12","10:13","10:14","10:15","10:16","10:17","10:18","10:19","10:20","10:21","10:22","10:23","10:24","10:25","10:26","10:27","10:28","10:29","10:30","10:31","10:32","10:33","10:34","10:35","10:36","10:37","10:38","10:39","10:40","10:41","10:42","10:43","10:44","10:45","10:46","10:47","10:48","10:49","10:50","10:51","10:52","10:53","10:54","10:55","10:56","10:57","10:58","10:59","11:00","11:01","11:02","11:03","11:04","11:05","11:06","11:07","11:08","11:09","11:10","11:11","11:12","11:13","11:14","11:15","11:16","11:17","11:18","11:19","11:20","11:21","11:22","11:23","11:24","11:25","11:26","11:27","11:28","11:29","11:30","11:31","11:32","11:33","11:34","11:35","11:36","11:37","11:38","11:39","11:40","11:41","11:42","11:43","11:44","11:45","11:46","11:47","11:48","11:49","11:50","11:51","11:52","11:53","11:54","11:55","11:56","11:57","11:58","11:59","12:00","13:01","13:02","13:03","13:04","13:05","13:06","13:07","13:08","13:09","13:10","13:11","13:12","13:13","13:14","13:15","13:16","13:17","13:18","13:19","13:20","13:21","13:22","13:23","13:24","13:25","13:26","13:27","13:28","13:29","13:30","13:31","13:32","13:33","13:34","13:35","13:36","13:37","13:38","13:39","13:40","13:41","13:42","13:43","13:44","13:45","13:46","13:47","13:48","13:49","13:50","13:51","13:52","13:53","13:54","13:55","13:56","13:57","13:58","13:59","14:00","14:01","14:02","14:03","14:04","14:05","14:06","14:07","14:08","14:09","14:10","14:11","14:12","14:13","14:14","14:15","14:16","14:17","14:18","14:19","14:20","14:21","14:22","14:23","14:24","14:25","14:26","14:27","14:28","14:29","14:30","14:31","14:32","14:33","14:34","14:35","14:36","14:37","14:38","14:39","14:40","14:41","14:42","14:43","14:44","14:45","14:46","14:47","14:48","14:49","14:50","14:51","14:52","14:53","14:54","14:55","14:56","14:57","14:58","14:59","15:00","15:01","15:02","15:03","15:04","15:05","15:06","15:07","15:08","15:09","15:10","15:11","15:12","15:13","15:14","15:15","15:16","15:17","15:18","15:19","15:20","15:21","15:22","15:23","15:24","15:25","15:26","15:27","15:28","15:29","15:30","15:31","15:32","15:33","15:34","15:35","15:36","15:37","15:38","15:39","15:40","15:41","15:42","15:43","15:44","15:45","15:46","15:47","15:48","15:49","15:50","15:51","15:52","15:53","15:54","15:55","15:56","15:57","15:58","15:59","16:00"];
		
	}else if( timeArrName=="USAStock"){
		
		minInterval = 5000;
		avgArr = [];
		timeLineArr = ["09:30","09:31","09:32", "09:33", "09:34", "09:35", "09:36", "09:37", "09:38", "09:39", "09:40", "09:41", "09:42", "09:43", "09:44", "09:45", "09:46", "09:47", "09:48", "09:49", "09:50","09:51","09:52","09:53","09:54", "09:55","09:56","09:57","09:58","09:59","10:00","10:01","10:02","10:03","10:04","10:05","10:06","10:07","10:08","10:09","10:10","10:11","10:12","10:13","10:14","10:15","10:16","10:17","10:18","10:19","10:20","10:21","10:22","10:23","10:24","10:25","10:26","10:27","10:28","10:29","10:30","10:31","10:32","10:33","10:34","10:35","10:36","10:37","10:38","10:39","10:40","10:41","10:42","10:43","10:44","10:45","10:46","10:47","10:48","10:49","10:50","10:51","10:52","10:53","10:54","10:55","10:56","10:57","10:58","10:59","11:00","11:01","11:02","11:03","11:04","11:05","11:06","11:07","11:08","11:09","11:10","11:11","11:12","11:13","11:14","11:15","11:16","11:17","11:18","11:19","11:20","11:21","11:22","11:23","11:24","11:25","11:26","11:27","11:28","11:29","11:30","11:31","11:32","11:33","11:34","11:35","11:36","11:37","11:38","11:39","11:40","11:41","11:42","11:43","11:44","11:45","11:46","11:47","11:48","11:49","11:50","11:51","11:52","11:53","11:54","11:55","11:56","11:57","11:58","11:59","12:00","12:01","12:02","12:03","12:04","12:05","12:06","12:07","12:08","12:09","12:10","12:11","12:12","12:13","12:14","12:15","12:16","12:17","12:18","12:19","12:20","12:21","12:22","12:23","12:24","12:25","12:26","12:27","12:28","12:29","12:30","12:31","12:32","12:33","12:34","12:35","12:36","12:37","12:38","12:39","12:40","12:41","12:42","12:43","12:44","12:45","12:46","12:47","12:48","12:49","12:50","12:51","12:52","12:53","12:54","12:55","12:56","12:57","12:58","12:59","13:00","13:01","13:02","13:03","13:04","13:05","13:06","13:07","13:08","13:09","13:10","13:11","13:12","13:13","13:14","13:15","13:16","13:17","13:18","13:19","13:20","13:21","13:22","13:23","13:24","13:25","13:26","13:27","13:28","13:29","13:30","13:31","13:32","13:33","13:34","13:35","13:36","13:37","13:38","13:39","13:40","13:41","13:42","13:43","13:44","13:45","13:46","13:47","13:48","13:49","13:50","13:51","13:52","13:53","13:54","13:55","13:56","13:57","13:58","13:59","14:00","14:01","14:02","14:03","14:04","14:05","14:06","14:07","14:08","14:09","14:10","14:11","14:12","14:13","14:14","14:15","14:16","14:17","14:18","14:19","14:20","14:21","14:22","14:23","14:24","14:25","14:26","14:27","14:28","14:29","14:30","14:31","14:32","14:33","14:34","14:35","14:36","14:37","14:38","14:39","14:40","14:41","14:42","14:43","14:44","14:45","14:46","14:47","14:48","14:49","14:50","14:51","14:52","14:53","14:54","14:55","14:56","14:57","14:58","14:59","15:00","15:01","15:02","15:03","15:04","15:05","15:06","15:07","15:08","15:09","15:10","15:11","15:12","15:13","15:14","15:15","15:16","15:17","15:18","15:19","15:20","15:21","15:22","15:23","15:24","15:25","15:26","15:27","15:28","15:29","15:30","15:31","15:32","15:33","15:34","15:35","15:36","15:37","15:38","15:39","15:40","15:41","15:42","15:43","15:44","15:45","15:46","15:47","15:48","15:49","15:50","15:51","15:52","15:53","15:54","15:55","15:56","15:57","15:58","15:59","16:00"];
		
	}

	option = {
		width:"80%",
		height:"70%",
		animation:false,
		title: {
		},
		grid:{
				top:"10",
				bottom:"10",
				left:"40",
				right:"30",
			},
		xAxis: {
			data: timeLineArr,
			type:"category",
			axisTick:{
				show :false,
			},
			axisLabel: {
				interval :function(index,value){
					switch(timeArrName){
						case "AStock":
						if(  value=="09:30" || value=="11:30" || value=="15:00" ){
							return true;
						}
						return false;
						break;
						case "HKStock":
						if(  value=="09:30" || value=="12:00" || value=="16:00" ){
							return true;
						}
						return false;
						break;
						case "USAStock":
						if(  value=="09:30" || value=="12:30" || value=="16:00" ){
							return true;
						}
						return false;
						break;
					}
					
				},
				formatter:function(a,b){
					switch(timeArrName){
						case "AStock":
						if( a == "11:30"){
							return "11:30|13:00";
						}else{
							return a;
						}
						break;
						case "HKStock":
						if( a == "12:00"){
							return "12:00|13:00";
						}else{
							return a;
						}
						break;
						case "USAStock":
						if( a == "12:00"){
							return "12:00|13:00";
						}else{
							return a;
						}
						break;
					}
					
				}
			}, 
			 splitLine:{  
				show:true,
				lineStyle:{
					color:'#DBD6D6',
					width: 2
				}
			},
		},
		yAxis: {
			scale: true,
			type: 'value',
			min: function(value) {
				return  parseInt(value.min - 5);
			},
			max: function(value) {
				return parseInt(value.max + 5);
			},
			axisTick:{
				length:1
			},
			minInterval :minInterval,
			axisLabel: {
				margin: 3,
				textStyle: {
					color: '#999',
					fontSize: 12,
				}
			},
		
		},
		series: [
			//分时数据
			{
				type: 'line',
				data: valueArr,
				symbol :"none",
				itemStyle : {
					normal : {
						lineStyle : {
							color : '#74C2D8'
						}
					}
				},
				areaStyle : {
					normal : {
						color : new echarts.graphic.LinearGradient(0, 0, 0, 1, [ {
							offset : 0,
							color : '#74C2D8'
						}, {
							offset : 1,
							color : '#FFFFFF'
						} ])
					}
				},
			},
			//昨收价格
			{
				type:'line',
				data:preArr,
				symbol :"none",
				itemStyle : {
					normal : {
						lineStyle : {
							color : '#555454',
							width:1,
							type :'dashed',
						}
					},
				},
			},
			//均价
			{
				type:'line',
				data:avgArr,
				symbol :"none",
				itemStyle : {
					normal : {
						lineStyle : {
							color : '#F3D15C',
							width:1,
						}
					},
				},
			},
		]
	};
	var myChart = echarts.init(document.getElementById('chart'));
	myChart.setOption(option);
	var src = myChart.getDataURL();
	document.getElementById("stockImg").src = src;
	document.getElementById("chart").style.display = "none";
}
