	function addWheel(obj,fn){
		function fnWheel(ev){
			var oEvent =ev||event;
			var down = false;
			//chrome IE
			if(oEvent.wheelDelta){

				down = oEvent.wheelDelta<0?true:false;
				
			}else{
				//oEvent.detail
				down = oEvent.detail<0?false:true;
			}
			
			//down鼠标方向 向下为true 
			fn(down);
			oEvent.preventDefault&&oEvent.preventDefault();
			return false;
			
		}
		//ff
		if(navigator.userAgent.indexOf('Firefox')!=-1){
			obj.addEventListener('DOMMouseScroll',fnWheel,false);
		}else{
			obj.onmousewheel = fnWheel;
		}
	}
