(function(window){
    function Promise(excutor){
        const self=this
        self.stauts='pedding'
        self.data=undefined
        self.callbacks=[]


        function reslove(value){

            self.stauts='resloved'
            self.data=value
            if(self.callbacks.length>0){
                setTimeout(()=>{
                    self.callbacks.forEach(callbackObj => {
                        callbackObj.onResloved(value)
                    });
                },0)
            }
        }

        function reject(reason){
            self.stauts='rejected'
            self.data=reason
            if(self.callbacks.length>0){
                setTimeout(()=>{
                    self.callbacks.forEach(callbackObj=>{
                        callbackObj.onRejected(reason)
                    })
                })
            }
        }



        try{
            excutor(reslove,reject)
        }catch(error){
            reject(error)
        }
    }



    Promise.prototype.then=function(onResloved,onRejected){
        const self=this
        return new Promise((reslove,reject)=>{


            function handle(callback){
                const result= callback(self.data)
                    try {
                        if(result instanceof Promise){
                            result.then(
                                value=>reslove(value),
                                reason=>reject(reason)
                            )

                        }else{
                            return reslove(result)
                        }
                        
                    } catch (error) {
                        reject(error)
                    }

            }
            if(self.stauts==='resloved'){
                setTimeout(()=>{
                    handle(onResloved)
                },0)
            }else if(self.stauts==='rejected'){
                setTimeout(()=>{
                    handle(onRejected)     
                },0)
            }else{
                self.callbacks.push({
                    onResloved(){
                        handle(onResloved)
                    }
                },{
                    onRejected(){
                        handle(onRejected)
                    }
                })
            }

        })
        
    }


    //用来返回一个成功的promise的静态方法
    Promise.reslove=function(value){
        return new Promise((reslove,reject)=>{
            if(value instanceof Promise){
                value.then(reslove,reject)
            }else{
                return reslove(value)
            }
        })
    }

    //用来返回一个失败的promise的静态方法
    Promise.reject=function(reason){
        return new Promise((reslove,reject)=>{
            return reject(reason)
        })
    }

    //第一个确定结果的promise来决定返回promise结果
    Promise.race=function(promises){
        return new Promise((reslove,reject)=>{
            promises.forEach(p=>{
                Promise.reslove(p).then(
                    value=>reslove(value),
                    reason=>reject(reason)
                )
            })
        })
    }
})(window)