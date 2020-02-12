const Barrange = {
    // 创建一个弹幕
    createBarrage: function(content){
        //创建一个span
        var barrage=document.createElement("span");
        //定义内容
        barrage.innerText=content;
        //指定class
        barrage.className="barrage";
        //为弹幕设置一个随机的高度
        barrage.style.top=this.randomNum(10,350)+'px';
        //宽度
        barrage.style.width=content.length*16+'px';
        //为弹幕设置一个随机的颜色
        barrage.style.color=this.randomColor();

        barrage.style.right = '-100px';
        //加入video中
        document.getElementById("barrange-div").appendChild(barrage);

        //开始滚动
        this.rolling(barrage)
    },

    //取随机数
    randomNum : function (minNum,maxNum){ 
        return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
    } ,

    //取随机颜色
    randomColor : function(){
        var color="#";
        for(var i=0;i<6;i++){
            color += (Math.random()*16 | 0).toString(16);
        }
        return color;
    },

    //滚动弹幕
    rolling : function (object){

        //启动一个定时器，每10秒执行一次
        var a= setInterval(function () {
            //判断是否滚动出屏幕
            if (object.offsetLeft> - object.innerHTML.length*16) {
                object.style.right= object.style.right.split('p')[0]*1 + 2 + 'px';
            }else{
                //如果弹幕已移出屏幕，则删除本条弹幕
                object.parentNode.removeChild(object);
                //清理定时器
                clearInterval(a);
            }
        }, 20);
    }
};

export default Barrange;