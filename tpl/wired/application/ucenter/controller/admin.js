/**
 * Created by megic on 2015/11/28 0028.
 */
module.exports = function ($this) {
    let main = {};
    main['_before'] = async function () {//先执行的公共函数
        $this.user=await $this.getCheckAuth('$Member');//检查是否有用户组权限，有返回登录信息继续执行
    };
    main['_after'] = function *() { //后行的公共函数
        //console.log('公共头部');
    };
    main['setInfo'] = function *() {//修改用户信息
            let orlist=[];
            if($this.POST['phone'])orlist.push({phone: $this.POST['phone']});
            if($this.POST['email'])orlist.push({email: $this.POST['email']});
            if($this.POST['username'])orlist.push({username: $this.POST['username']});
            let user = yield $D('user').findOne({
                where: {$or:orlist,id:{$ne:$this.user.id}}
            });
            if(user){
                $this.error('账户名/手机号码/Email已被他人使用');
            }else{
                yield $D('user').update($this.POST, {fields:['name','phone','email','username','headimgurl'],where:{id:$this.user.id}});
                $this.success();
            }
    };
    //****************************
    //修改密码
    main['changePassword'] = function *() {
            let where={
                password:$F.encode.md5($this.POST['oldpassword']),
                id:$this.user.id
            };
            let res = yield $D('user').findOne({where: where});
            if(res){
                res.password=$F.encode.md5($this.POST['password']);
                res.save();
                $this.success();
            }else{
                $this.error('原密码错误！');
            }
    };
    return main;
};