'use strict'
function setStyle(obj,name,value){
	obj.style['Webkit'+name.charAt(0).toUpperCase()+name.substring(1)] = value;
	obj.style['Moz'+name.charAt(0).toUpperCase()+name.substring(1)] = value;
	obj.style['ms'+name.charAt(0).toUpperCase()+name.substring(1)] = value;
	obj.style['O'+name.charAt(0).toUpperCase()+name.substring(1)] = value;
	obj.style[name] = value;
}
function rnd(m,n){
	return Math.floor(m+Math.random()*(n-m));
}
function a2d(n){
	return n*180/Math.PI;
}
function getPos(obj){
	var l = 0;
	var t = 0;
	while(obj){
		l+=obj.offsetLeft;
		t+=obj.offsetTop;
		obj = obj.offsetParent;
	}
	return {
		left:l,
		top:t	
	};	
}
/*穿墙*/
function hoverDir(obj,ev){
	var w = obj.offsetWidth;
	var h = obj.offsetHeight;
	var x = getPos(obj).left+w/2-ev.clientX;
	var y = getPos(obj).top+h/2-ev.clientY;
	return Math.round((a2d(Math.atan2(y,x))+180)/90)%4;
}

function through(obj){
	var oS = obj.children[0];
	obj.onmouseover=function(ev){
		var oEvent = ev||event;
		var oForm = oEvent.formElement||oEvent.relatedTarget;
		if(this.contains(oForm))return;
		var dir = hoverDir(this,oEvent);
		switch(dir){
			case 0:
				//右
				oS.style.left = '235px';
				oS.style.top = 0;
				break;
			case 1:
				//下
				oS.style.left = 0;
				oS.style.top = '148px';
				break;
			case 2:
				//左
				oS.style.left = '-235px';
				oS.style.top = 0;
				break;
			case 3:
				//上
				oS.style.left = 0;
				oS.style.top = '-148px';
				break;
		}
		startMove(oS,{top:0,left:0},{easing:'ease-out',duration:300});
	};
	obj.onmouseout=function(ev){
		var oEvent = ev||event;
		var oTo = oEvent.toElement||oEvent.relatedTarget;
		if(this.contains(oTo))return;
		var dir = hoverDir(this,oEvent);
		switch(dir){
			case 0:
				//右
				startMove(oS,{left:235,top:0});
				break;
			case 1:
				//下
				startMove(oS,{left:0,top:148});
				break;
			case 2:
				//左
				startMove(oS,{left:-235,top:0});
				break;
			case 3:
				//上
				startMove(oS,{left:0,top:-148});
				break;
		}
	};
}
window.onload = function(){
		var oNav = document.getElementById('nav');
		var oUl = document.getElementById('nav-list');
		var aBtn = oUl.getElementsByTagName('li');
		var aCoin = document.querySelectorAll('ul li a p');
		var aText = document.querySelectorAll('ul li a div i');
		var oCon = document.getElementById('contain');
		var aDiv = oCon.children;
		var oIndex = document.getElementById('index');
		var iNow=0;
		for(var i = 0;i<aBtn.length;i++){
			aBtn[i].index = i;
			aDiv[i].style.left =  oCon.offsetWidth+'px';
			aDiv[i].style.display =  'none';
			aBtn[i].onmouseenter = function(){			
				showBtn(this.index);
			};	
			aBtn[i].onmouseleave = function(){
				hiddeBtn(this.index);
				showBtn(iNow);
			};		
			var bOk = false;
			(function(index){
				aDiv[0].style.left = 0;
				aDiv[0].style.display = 'block';
				aBtn[i].onclick = function(){
					for(var i = 0;i<aBtn.length;i++){
						hiddeBtn(i);
					}
					if(bOk)return;
						bOk = true;
						if(iNow != index){
							for(var i = 0;i<aBtn.length;i++){
								aBtn[i].className = '';
								aBtn[i].onmouseenter = null;
								aBtn[i].onmouseleave = null;
							}
							aBtn[index].className = 'on';
							aDiv[index].style.display = 'block';
							aDiv[iNow].style.WebkitTransition = '0.4s all ease';
							aDiv[iNow].style.WebkitTransform = 'rotateY(40deg)';
							aDiv[iNow].style.opacity = 0;
							aDiv[index].style.WebkitTransition = '0.4s all ease';
							function fnMove(){
								aDiv[iNow].style.left =  oCon.offsetWidth + 'px';
								aDiv[index].style.left = 0;
								aDiv[iNow].style.opacity = 1;
								aDiv[iNow].style.display = 'none';
								aDiv[iNow].style.WebkitTransition = 'none';
								aDiv[iNow].style.WebkitTransform = 'none';
								aDiv[iNow].removeEventListener('transitionend',fnMove,false);
								iNow = index;
								for(var i = 0;i<aBtn.length;i++){
									aBtn[i].onmouseenter = function(){			
										showBtn(this.index);
									};	
									aBtn[i].onmouseleave = function(){
										hiddeBtn(this.index);
										showBtn(iNow);
									};		
								}
								 bOk = false;
							}
							aDiv[iNow].addEventListener('transitionend',fnMove,false);
						}else{
							bOk = false;
					}
					showBtn(index);
				};
			})(i);
		}
		function showBtn(i){
				aBtn[i].className = 'move-on';
				setStyle(aCoin[i],'transform','rotate(360deg)');
				aCoin[i].className = 'move-color font-nav icon fl ';
				aText[i].className = 'move-color sub-item';
		}
		function hiddeBtn(i){
				aBtn[i].className = '';
				setStyle(aCoin[i],'transform','rotate(0deg)');
				aCoin[i].className = 'font-nav icon fl ';
				aText[i].className = 'sub-item';
		}
	/*自定义滚动条+返回顶部*/	
	;(function(){
		var oPerson = document.getElementById('person');
		var oPage = oPerson.children[0];
		var oBarbox = oPerson.children[1];
		var oBar = oBarbox.children[0];
		var oGo = oPerson.children[2];
		var t = 0;
		var bOk = false;
		oGo.onclick = function(){
			startMove(oPage,{top:0},{easing:'ease-out'},{complete:function(){
				oGo.style.display = 'none';
			}});
			startMove(oBar,{top:0},{easing:'ease-out'},{complete:function(){
				oGo.style.display = 'none';
			}});
		};
		addWheel(oPage,function(down){
			if(bOk){
				clearInterval(oPage.timer);
				clearInterval(oBar.timer);
			}
			bOk = true;
			var t = oPage.offsetTop;
			if(down){
				 t -=  38; 
				 if(t<=-5){
						oGo.style.display = 'block';
					}
			}else{
				t += 38;
				if(t > -5){
					oGo.style.display = 'none';
				}	
			}
			if(t>0){
				t = 0;
			}
			if(t<=-(oPage.scrollHeight-document.documentElement.clientHeight) - 8){
				t = -oPage.scrollHeight-document.documentElement.clientHeight + 'px';
			}
			oPage.style.top = t + 'px';
			oBar.style.top = -t/(oPage.scrollHeight-document.documentElement.clientHeight)*(oBarbox.offsetHeight - oBar.offsetHeight) + 'px';
		});
		/*滚动条拖拽*/
		oBar.onmousedown = function(ev){
			var oEvent = ev||event;
			var disY = oEvent.clientY - oBar.offsetTop;
			document.onmousemove = function(ev){
				var oEvent = ev||event;
				 t =  oEvent.clientY - disY;
				if(t<0){
					t = 0;
				}else if(
					t>oBarbox.offsetHeight - oBar.offsetHeight
				){
					t = oBarbox.offsetHeight - oBar.offsetHeight;
				}
				if(t<=10){
					oGo.style.display = 'none';
				}	
				if(t >=10){
					oGo.style.display = 'block';
				}
				var scale = t/(oBarbox.offsetHeight - oBar.offsetHeight);
				oBar.style.top = t + 'px';
				oPage.style.top = -(oPage.scrollHeight-document.documentElement.clientHeight)*scale + 'px'; 	
				oNav.style.backgroundPositionX =  -50+t/50 + 'px'; 
			}
			document.onmouseup = function(){
					document.onmousemove = null;
					document.onmouseup = null;
					oBar.releaseCapture&&oBar.releaseCapture();
				};
				oBar.setCapture&&oBar.setCapture();
				return false;
		};
	})();
	/*爆炸*/
	;(function(){
		var oShowPic = document.querySelector('#index .tab .show_pic');
		var oTab = document.querySelector('#index .tab');
		var aBtn = document.querySelectorAll('#index ol li');
		var oNext = document.querySelector('#index .btn_right');
		var oPrev = document.querySelector('#index .btn_left');
		var R = 4;
		var C = 7;
		var iNow = 0;
		var iOld = 0;
		var bOk = false;
		oNext.onclick=function(){
			if(bOk)return;
			bOk = true;
			
			iNow++;
			if(iNow>2){
				iNow = 0;
			}
			iOld = iNow;
			if(iOld == 0){
				iOld = 3;
			}
			//Boom(((iNow+1)%3+1),(iNow%3+1));
			Boom(iNow+1,iOld);
			for(var i = 0;i<aBtn.length;i++){
				aBtn[i].className = '';
			}
			aBtn[iNow].className = 'on';
		};
		oPrev.onclick=function(){
			if(bOk)return;
			bOk = true;
		
			iNow--;
			if(iNow<0){
				iNow = 2;
			}
			//Boom(((iNow+1)%3+1),((iNow-3)%3+3));
			Boom(iNow+1,(iNow%3+1)%3+1);
			for(var i = 0;i<aBtn.length;i++){
				aBtn[i].className = '';
			}
			aBtn[iNow].className = 'on';
		};
		oTab.onmouseenter = function(){
			oNext.style.display = 'block';
			oPrev.style.display = 'block';
		}
		oTab.onmouseleave = function(){
			oNext.style.display = 'none';
			oPrev.style.display = 'none';
		}
		function Boom(count,count2){
			oShowPic.style.backgroundImage ='url(images/show_pic/desk'+count+'.jpg) ';
			for(var i = 0;i<R;i++){
				for(var j = 0;j<C;j++){
					var oS = document.createElement('span');
					oS.style.width = oShowPic.offsetWidth/C + 'px';
					oS.style.height = oShowPic.offsetHeight/R + 'px';
					oShowPic.appendChild(oS);
					oS.style.left = j*oS.offsetWidth+'px';
					oS.style.top = i*oS.offsetHeight+'px';
					oS.style.backgroundImage = 'url(images/show_pic/desk'+count2+'.jpg)';
					oS.style.backgroundPosition='-'+j*oS.offsetWidth+'px -'+i*oS.offsetHeight+'px';
				}
			}
			var aS = document.querySelectorAll('.show_pic span');
			for(var i=0;i<aS.length;i++){
				aS[i].style.WebkitTransition = '1s all ease';
				var disX = aS[i].offsetLeft+aS[i].offsetWidth/2-oShowPic.offsetWidth/2;
				var disY = aS[i].offsetTop+aS[i].offsetHeight/2-oShowPic.offsetHeight/2;
				aS[i].style.WebkitTransform='translate3D('+disX+'px,'+disY+'px,0px) rotateX('+rnd(-180,180)+'deg) rotateY('+rnd(-180,180)+'deg) scale('+rnd(-2,2)+','+rnd(-2,2)+')';
				aS[i].style.opacity = 0;
			}
			aS[aS.length-1].addEventListener('transitionend',function(){
				for(var i=0;i<aS.length;i++){
					aS[i].style.WebkitTransition = 'none';
					aS[i].style.opacity = 1;
					aS[i].style.WebkitTransform='translate3D(0,0,0) rotateX(0deg) rotateY(0deg) scale(1,1)';
					oShowPic.innerHTML = '';
				}
				bOk = false;
			},false);
		}
	})();
	/*穿墙调用*/
	;(function(){
		var oW = document.getElementById('works');
		var aA = oW.children[1].children;
		var aSpan = oW.getElementsByTagName('span');
		var aImg = oW.getElementsByTagName('img');
		var oBtn = oW.children[2];
		var aBtn = oBtn.children;
		var bOk = false;
		for(var i=0; i<aA.length;i++){
			through(aA[i]);
		};
		for(var i = 0;i<aBtn.length;i++){
			aBtn[i].index = i;
			fly(aBtn[i]);
		}
	/*分布效果*/
	function fly(obj){
		var aPos = [];
		var url =[['website/css-js/163/index.html','website/css-js/taobao/index.html','website/css-js/soul/index.html','website/css-js/iphonepic/index.html','website/css-js/3Dloop/index.html','website/css-js/loop/loop.html','website/css-js/macmenu/mac.html','website/css-js/3Dpic/index.html'],['website/h5-web/canvasClock.html','website/h5-web/clock.html','website/h5-web/paint.html','website/h5-web/showpic/index.html','website/h5-web/windows.html','website/h5-web/canvasLoading.html','website/h5-web/3Dcorridor/index.html','website/h5-web/picClock/index.html']];
		var inner = [['网易','淘宝','灵魂回想','iphone图片展示','3D图片展示','无缝轮播图','苹果图标','3D图片环'],['表盘时钟','css3时钟','画板','拖拽图片','屏保','加载','图片走廊','图片时钟']];
		var imgSrc = [['images/0.jpg','images/1.jpg','images/2.jpg','images/3.jpg','images/4.jpg','images/5.jpg','images/6.jpg','images/desk8.jpg'],['images/gallery/1.jpg','images/gallery/2.jpg','images/gallery/3.jpg','images/gallery/4.jpg','images/gallery/5.jpg','images/gallery/6.jpg','images/gallery/7.jpg','images/gallery/8.jpg',]];
		
		obj.onclick=function(){
			if(bOk)return;
			bOk = true;
			var iNow = this.index;
			for(var i=0;i<aA.length;i++){
				aPos.push({left:aA[i].offsetLeft,top:aA[i].offsetTop,width:aA[i].offsetWidth,height:aA[i].offsetHeight});
				//url[iNow].push(aA[i].href);
			}
			for(var i=0;i<aA.length;i++){
				aA[i].style.left = aPos[i].left+'px';
				aA[i].style.top = aPos[i].top+'px';
				aA[i].style.position = 'absolute';
				aA[i].style.margin = 0;
			}
			for(var i=0;i<aA.length;i++){
				(function(index){
					setTimeout(function(){
						startMove(aA[index],{left:(getPos(obj).left-240+obj.offsetWidth/2),top:(getPos(obj).top+obj.offsetHeight/2),width:0,height:0,opacity:0},{complete:function(){
							if(index==aA.length-1){
								//放出来
								for(var i=aA.length-1;i>=0;i--){
									(function(index){
										setTimeout(function(){
											aA[index].href = url[iNow][index];
											aSpan[index].innerHTML = inner[iNow][index];
											aImg[index].src = imgSrc[iNow][index];
											startMove(aA[index],{left:aPos[index].left,top:aPos[index].top,width:aPos[index].width,height:aPos[index].height,opacity:1},{complete:function(){
												if(index==0){
													bOk = false;
												}
											}});
										},(aA.length-i)*100);
									})(i);
								}
							}
						}});
					},i*100);
				})(i);
			}
		};
	}	
	})();
	/*个人介绍*/
	;(function(){
		var oSkill = document.getElementById('skill');
		var oSkillList = oSkill.children[2];
		var oUl= oSkillList.getElementsByTagName('ul')[0];
		var aLi = oUl.children;
		for(var i = 0;i<aLi.length;i++){
			aLi[i].onmouseover = function(){
				this.children[1].style.display = 'block';
			};
			aLi[i].onmouseout= function(){
				this.children[1].style.display = 'none';
			};
		}
	})();
	/*contact 鼠标跟随移动*/
	;(function(){
		var oCont = document.getElementById('contact');
		var oCList = oCont.children[1];
		var oForm = oCList.children[1];
		var oBtn = oCList.children[2];
		var MAX_DEG_X=30;
		var MAX_DEG_Y=15;
		var x=0,y=0;
		var iLastDoMove=0;
		var i=0;
		var timer=null;
		var iSpeed = 0;
		oCList.onmousemove = function(ev){
			var oEvent = ev||event;
			var oFrom = oEvent.fromElement||oEvent.relatedTarget;
			if(oCList.contains(oFrom))return;
			moveMouse((oEvent.clientX-getPos(oCList).left),oEvent.clientY);
		};
		oBtn.onclick = function(){
			if(oBtn.innerHTML == 'START'){
				oBtn.innerHTML = 'STOP';
					oCList.onmousemove = function(ev){
						var oEvent = ev||event;
						var oFrom = oEvent.fromElement||oEvent.relatedTarget;
						if(oCList.contains(oFrom))return;
						moveMouse((oEvent.clientX-getPos(oCList).left),oEvent.clientY);
					};
			}else{
				oBtn.innerHTML = 'START';
				oCList.onmousemove = null;
				clearInterval(timer);
				oForm.style.WebkitTransform = 'perspective(200px) rotateY(0deg) rotateX(0deg) scale(1) translate(0px,0px)';
			}
		};
		oCList.onmouseout = function(ev){
			var oEvent = ev||event;
			var oT = oEvent.toElement||oEvent.relatedTarget;
			if(oCList.contains(oT))return;
			clearInterval(timer);
			oForm.style.WebkitTransform = 'perspective(200px) rotateY(0deg) rotateX(0deg) scale(1) translate(0px,0px)';
		};
		function moveMouse(iX, iY){
				clearInterval(timer);
				var iNow = new Date().getTime();
				if(iNow-iLastDoMove>30){
					doMove();
					iLastDoMove = iNow;
				}
				timer=setInterval(doMove, 30);
				
				function doMove(){
					if(x == iX && y == iY){
						clearInterval(timer);
					}
					else{
						iSpeed = (iX-x)/2;
						iSpeed = iSpeed>0?Math.ceil(iSpeed):Math.floor(iSpeed);
						x+=iSpeed;
						
						iSpeed = (iY-y)/2;
						iSpeed = iSpeed>0?Math.ceil(iSpeed):Math.floor(iSpeed);
						y+=iSpeed;
					}
					
					var w = oCList.offsetWidth;
					var h = oCList.offsetHeight;
					
					var dis=Math.sqrt(Math.pow(x-w/2,2)+Math.pow(y-h/2,2));
					
					var rx = (x-w/2)/w;
					var ry = -(y-h/2)/h;
					var tx = -rx*oForm.offsetWidth
					var ty = ry*50;
					var scale = 1-Math.abs(y-h/2)/h;
					oForm.style.WebkitTransform = 'perspective(200px) rotateY('+MAX_DEG_X*rx+'deg) rotateX('+MAX_DEG_Y*ry+'deg) scale('+scale+') translate('+tx+'px,'+ty+'px)';
				}
			}
	})();
//	;(function(){
//		var oCont = document.getElementById('contact');
//		var oMoveBall = oCont.children[0];
//		var oBall = document.getElementById('ball');
//		var oCList = oCont.children[1];
//		var iSpeedX = 0;
//		var iSpeedY = 0;
//		var lastX = 0;
//		var lastY = 0;
//		var timer = null;
//		oBall.onmousedown = function(ev){
//			clearInterval(timer);
//			var oEvent = ev || event;
//			var disX = oEvent.clientX - oBall.offsetLeft;
//			var disY = oEvent.clientY - oBall.offsetTop; 
//			document.onmousemove = function(ev){
//				var oEvent = ev || event;
//				var l = oEvent.clientX - disX;
//				var t = oEvent.clientY - disY;
//				if(l>oCont.clientWidth-oBall.offsetWidth){
//					l =oCont.clientWidth-oBall.offsetWidth + 'px';
//				}
//				if(l<0){
//					l =0;
//				}
//				if(t>oCont.clientHeight-oBall.offsetHeight){
//					t = oCont.clientHeight-oBall.offsetHeight + 'px';
//				}
//				if(t<0){
//					t = 0 + 'px';
//				}
//				oBall.style.left = l + 'px';
//				oBall.style.top = t + 'px';
//				
//				iSpeedX = oEvent.clientX - lastX;
//				iSpeedY = oEvent.clientY - lastY;
//			
//				lastX = oEvent.clientX;
//				lastY = oEvent.clientY;
//
//			};
//			document.onmouseup = function(){
//				document.onmousemove =null;
//				document.onmouseup = null;
//				move();
//				oBall.releaseCapture&&oBall.releaseCapture();
//			};
//			oBall.setCapture&&oBall.setCapture();
//			return false;
//		};
//		/*碰撞*/
//		function move(){
//			clearInterval(timer);
//			timer = setInterval(function(){
//				iSpeedY+=3;
//				var l = oBall.offsetLeft+iSpeedX;
//				var t = oBall.offsetTop+iSpeedY;
//				if(t>oCont.clientHeight-oBall.offsetHeight){
//					t=oCont.clientHeight-oBall.offsetHeight;
//					iSpeedY *= -0.8;
//					iSpeedX *= 0.8;
//				}
//				if(l>oCont.clientWidth-oBall.offsetWidth){
//					l=oCont.clientWidth-oBall.offsetWidth;
//					iSpeedX *= -0.8;
//					iSpeedY *= 0.8;
//				}
//				if(t<0){
//					t = 0;
//					iSpeedY *= -0.8;
//					iSpeedX *= 0.8;
//				}
//				if(l<0){
//					l = 0;
//					iSpeedX *= -0.8;
//					iSpeedY *= 0.8;
//				}
//				oBall.style.left = l+'px';
//				oBall.style.top = t+'px';
//				if(Math.abs(iSpeedX)<1)iSpeedX = 0;
//				if(Math.abs(iSpeedY)<1)iSpeedY = 0;
//				if(iSpeedX==0&&iSpeedY==0&&t==oCont.clientHeight-oBall.offsetHeight){
//					clearInterval(timer);
//					oMoveBall.style.WebkitTransform =  'translateZ(200px) scale(2,2)';
//					oMoveBall.style.opacity = 0;
//					oCList.style.opacity = 1;
//					oCList.style.display = 'inline-block';
//					oMoveBall.addEventListener('transitionend',function(){
//						oMoveBall.style.display = 'none';
//						oBall.style.left =  'calc(50% - 50px)'; 
//						oBall.style.top =  'calc(50% - 50px)';
//					},false);
//				}
//			},30);
//		}
//	})();
};

