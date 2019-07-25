(function(window){
    function Promise(excutor){

        const self=this
        self.status='pedding'
        self.data=undefined
        self.callback=[]


        //成功的回调
    function reslove(value){

        if(self.status!=='pedding'){
            return
        }

        //更改状态
        self.status='resolve'
        self.data=value
        //可能去执行已经保存待执行的回调函数
        if(self.callback.length>0){
            //必须异步执行
            setTimeout(()=>{
                self.callback.forEach(callbackObj => {
                    callbackObj.onResolve(value)
                });
            },0)
        }
    }

    function reject(reason){
        if(self.status!=='pedding'){
            return
        }

        self.status='reject'
        self.data=reason
        if(self.callback.length>0){
            setTimeout(()=>{
                self.callback.forEach(callbackObj=>{
                    callbackObj.onReject(reason)
                })
            },0)
        }
    }

        try{
            excutor(resolve,reject)
        }catch(error){
            reject(error)
        }
    }


    Promise.prototype.then = function(onResolve,onReject){  
        const self=this

        return new Promise((resolve,reject)=>{
            function handle(callback) {
                try{
                    const result=callback(self.data)
                       if(result instanceof Promise){
                           result.then(
                               value=>resolve(value),
                               reason=>reject(reason)
                           )
                        }else{
                           return resolve(result)
                         }
                }catch(error){
                   reject(error)
   
               }

            }

            if(self.status==='resolved'){
                setTimeout(()=>{
                    handle(onResolve)
                },0)
            }else if(self.status==='reject'){
                setTimeout(()=>{
                    handle(onReject)
                },0)
            }else{
                self.callback.push(
                    {
                        onResolve:()=>{
                            handle(onResolve)
                        }
                    },
                    {
                        onReject:()=>{
                            handle(onReject)
                        }
                    })
            }
        })        
    }  
}
)(window)