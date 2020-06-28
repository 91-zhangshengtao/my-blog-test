class BaseModel {
  constructor( data, message){
    // data:{}  message:消息
    if(typeof data == 'string'){
      this.message = data
      data = null
      message = null
    }
    if(data){
      this.data = data
    }
    if(message){
      this.message = message
    }
  }
}
// {data:{},errno:0}
class SuccessModel extends BaseModel {
  constructor(data,message){
    super(data,message) //执行BaseModel代码
    this.errno = 0
  }
}
// {data:{},errno:-1}
class ErrorModel extends BaseModel {
  constructor(data,message){
    super(data,message) //执行BaseModel代码
    this.errno = -1
  }
}

module.exports = {
  SuccessModel,
  ErrorModel
}

