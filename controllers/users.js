//import Users from './users'
//export default {
//  Users: Users
//}
var refUser = firebase.database().ref('users');

getUserController = function(req, res) {
  return res.render("getusers", {params: 'test'});
}

updateUserController = function(req, res) {
  //return render("getusers", {params: 'test'})
}

renderRegUserController = function(req, res) {
  //return render("getusers", {params: 'test'})
  return res.render('regUser');
}

regUserController = function(req, res) {
  //return render("getusers", {params: 'test'})
  reqUser = {
    username: req.body.username,
    password: req.body.password
  };
  refUser.push({
    username: reqUser.username,
    password: reqUser.password,
    role: 0,
    timestamp: {
      login_at: '',
      logout_at: ''
    }     
  }).then(function(user){
      console.log(user.key);
  })
  reqUser.status = 200;
  return res.json(reqUser);
}

rederLoginUserController = function(req, res){
  //return render("getusers", {params: 'test'})
  if(req.session.userlogin){
    searchUserbyKey(req.session.userlogin.key).then(function(user) {
      //refLogin_at = refUser.child(i + '/timestamp');
      reqUser.login_at = new Date();
      reqUser.status = 200;
      reqUser.login = true;
      return res.json(reqUser);
    })
  } else {
      return res.render('loginUser');
  }
}

loginUserController = function(req, res) {
  //return render("getusers", {params: 'test'})
  reqUser = {
       username: req.body.username,
       password: req.body.password
  };
  refUser.once("value")
    .then(function(snapshot) {
      var users = snapshot.val();
      for(i in users) {
        if(users[i].username === reqUser.username && users[i].password === reqUser.password) {
          //refLogin_at = refUser.child(i + '/timestamp');
          reqUser.login_at = Date();            
          updateUserTimeStampbyKey('login_at', i, reqUser.login_at);
          users[i].status = 200;
          req.session.userlogin = {
            key: i,
            role: users[i].role
          };
          return res.json(users[i]);
        }
      }
      return res.end('saipass');
    });
}

function searchUserbyKey(key) {
  return new Promise(function(resolve, reject) {
    refUser.once("value", function(snapshot) {
      var users = snapshot.val();
      for(i in users) {
        if(i === key) {
          resolve(users[i]);
        }
      }
      reject();
    });
  });
}

function updateUserTimeStampbyKey(outOrin, key, time) {
  var ref = refUser.child(key + '/timestamp');
  ref.update({
    [outOrin]: time
  });
}

// function signed_in(req){
//   if(typeof req.session.userlogin != 'undefined'){
//     return true;
//   }else{
//     return false;
//   }
// }

function signed_in(req, res) {
  if(typeof req.session.userlogin === 'undefined') {
    return res.redirect('/login')
  }
}

logoutUserController = function(req, res) {
  signed_in(req, res);
  searchUserbyKey(req.session.userlogin.key).then(function(user) {
    user.timestamp.logout_at = Date();
    updateUserTimeStampbyKey('logout_at', req.session.userlogin.key, user.timestamp.logout_at);
    user.status = 200;
    req.session.destroy();
    return res.json(user);
  }, function() {
    return res.redirect('/login');
  });
}

renderEditUserController = function(req, res) {
  if(req.session.userlogin) {
      return res.render('editUser');
  } else {
      return res.redirect('/login');
  }
}

editUserController = function(req, res) {
  reqUser = {
    username:req.body.username,
    password:req.body.password
  };
  refEdit = refUser.child(req.session.userlogin.key)
  refEdit.update({
    username: reqUser.username,
    password: reqUser.password,    
  })
  reqUser.status = 200;
  return res.json(reqUser);
}

deleteUserController = function(req, res){
  signed_in(req, res);
  reqUser = {
    key: req.params.id
  };
  console.log(req.params.id);
  if(req.session.userlogin.role === 1){
    searchUserbyKey(req.params.id).then(function(user){
      var temp = user;
      refUser.child(req.params.id).remove();
      temp.status = 200;
      return res.json(temp);
    }, function(){
      return res.end('loi');
    })
  } else {
    console.log('member');
  }
}

searchUserController = function(req, res){
  reqUser = {
    name: req.params.name
  }
  searchUserbyName(reqUser.name).then(function(result){
    resUser = {
      status: 200,
      keyword: reqUser.name,
      result: result
    }
    return res.json(resUser);
  }, function(err){
    return res.end(err);
  })
}

function searchUserbyName(name){
  var result = []; 
  return new Promise(function(resolve, reject) {
    refUser.once("value")
    .then(function(snapshot) {
      var users = snapshot.val();
      for(i in users){
        if(users[i].username.search(name) >= 0){
          result.push(users[i]);         
        }
      }
      if(result.length > 0){
        resolve(result);
      } else {
        reject('khong tim thay');
      }       
    });
  });  
}

module.exports = {
  getUserController: getUserController,
  updateUserController: updateUserController,
  renderRegUserController: renderRegUserController,
  regUserController: regUserController,
  rederLoginUserController: rederLoginUserController,
  loginUserController: loginUserController,
  logoutUserController: logoutUserController,
  renderEditUserController: renderEditUserController,
  editUserController: editUserController,
  deleteUserController: deleteUserController,
  searchUserController: searchUserController,
  a: 'a'
}