
var refUser = firebase.database().ref('users');

// renderRegUserController = function(req, res) {
//   //return render("getusers", {params: 'test'})
//   return res.render('regUser');
// }

regUserController = function(req, res) {
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
  }).then(function(user) {
    reqUser.status = 200;
    return res.json(reqUser);
  },function(err) {
    return res.json({error: err});
  })
}

// rederLoginUserController = function(req, res){
//   if(req.session.userlogin){
//     searchUserbyKey(req.session.userlogin.key).then(function(user) {
//       reqUser.login_at = new Date();
//       reqUser.status = 200;
//       reqUser.login = true;
//       return res.json(reqUser);
//     })
//   } else {
//     return res.render('loginUser');
//   }
// }

loginUserController = function(req, res) {
  reqUser = {
    username: req.body.username,
    password: req.body.password
  };
  refUser.once('value')
    .then(function(snapshot) {
      var users = snapshot.val();
      for(i in users) {     //so sánh từng users
        if(users[i].username === reqUser.username && users[i].password === reqUser.password) {
          var login_at = Date();            
          updateUserTimeStampbyKey('login_at', i, login_at);
          //users[i].timestamp.login_at = login_at;
          users[i].status = 200;
          return res.json(users[i]);
        }
      }
      return res.json({error: 'saipass'});    //không có user nào trùng id/pw
    });
}

//tìm user = key(uid)
function searchUserbyKey(key) {
  return new Promise(function(resolve, reject) {
    refUser.once('value', function(snapshot) {
      var users = snapshot.val();
      for(i in users) {
        if(i === key) {         
          resolve(users[i]);
        }
      }
      reject('khong tim thay user');
    });
  });
}

//update thời gian lần cuối login/logout
//outOrin: 'login_at'/'logout_at'
function updateUserTimeStampbyKey(outOrin, key, time) {
  var ref = refUser.child(key + '/timestamp');
  ref.update({
    [outOrin]: time
  });
}

logoutUserController = function(req, res) {
  //signed_in(req, res);
  reqUser = {
    key: req.body.key
  };
  searchUserbyKey(reqUser.key).then(function(user) {  //resolve
    user.timestamp.logout_at = Date();
    updateUserTimeStampbyKey('logout_at', reqUser.key, user.timestamp.logout_at);
    user.status = 200;
    return res.json(user);
  }, function(err) {    //reject 
    return res.json({error: err});
  });
}

// renderEditUserController = function(req, res) {
//   if(req.session.userlogin) {
//       return res.render('editUser');
//   } else {
//       return res.redirect('/login');
//   }
// }

editUserController = function(req, res) {
  // signed_in(req, res);
  reqUser = {
    key: req.body.key,
    username: req.body.username,
    password: req.body.password
  };
  refEdit = refUser.child(reqUser.key);  //users/key
  refEdit.update({
    username: reqUser.username,
    password: reqUser.password   
  }, function(err) {
    if(err) {
      return res.json({error: 'khong update duoc ' + err});
    } else {
      reqUser.status = 200;
      return res.json(reqUser);
    }
  });
  
}

deleteUserController = function(req, res) {
  reqUser = {
    user: {
      key: req.body.user.key
    },
    admin: {
      role: req.body.admin.role
    }
  };
  if(reqUser.admin.role === 1) {
    searchUserbyKey(reqUser.user.key).then(function(user) {  //resolve
      var temp = user;
      refUser.child(reqUser.user.key).remove();
      temp.status = 200;
      return res.json(temp);
    }, function(err) {  //reject
      return res.json({error: err});
    });
  } else {
    return res.json({error: 'khong co quyen admin'});
  }
}

searchUserController = function(req, res){
  reqUser = {
    name: req.params.name
  }
  searchUserbyName(reqUser.name).then(function(result) {    //resolve
    resUser = {
      status: 200,
      keyword: reqUser.name,
      result: result
    }
    return res.json(resUser);
  }, function(err){                 //reject
    return res.json({error: err});
  })
}

function searchUserbyName(name) {
  var result = []; 
  return new Promise(function(resolve, reject) {
    refUser.once('value')
    .then(function(snapshot) {
      var users = snapshot.val();
      for(i in users) {
        if(users[i].username.search(name) >= 0) {     //tìm name nhập vào trong username
          result.push(users[i]);         // bỏ đối tượng tìm được vào mảng
        }
      }
      if(result.length > 0) {
        resolve(result);
      } else {
        reject('khong tim thay');
      }       
    });
  });  
}

module.exports = {
  //renderRegUserController: renderRegUserController,
  regUserController: regUserController,
  //rederLoginUserController: rederLoginUserController,
  loginUserController: loginUserController,
  logoutUserController: logoutUserController,
  //renderEditUserController: renderEditUserController,
  editUserController: editUserController,
  deleteUserController: deleteUserController,
  searchUserController: searchUserController
}