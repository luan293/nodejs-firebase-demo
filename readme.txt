/////// firebase tree ////////
-root
   [-]users
	   [-]uid(key)
			|-username
			|-password
			|-role
		   [-]timestamp
				|-login_at
				|-logout_at

\\\\\\\\\\\\\\\ API \\\\\\\\\\\\\
-----login------- POST ----------
{
	username: 'abc',
    password: 'def'
}
127.0.0.1:3000/login
--------logout-------- POST ---------
{
	key: 'abc'
}
127.0.0.1:3000/logout
--------register------- POST -----------
{
	username: 'abc',
    password: 'def'
}
127.0.0.1:3000/reg
--------edit---------- PUT -------------
{
    key: '1a3',
    username: 'abc',
    password: 'def'
}
127.0.0.1:3000/edit
---------delete-------- DELETE ----------
{
	user: {
      key: '1a3'
    },
    admin: {
      role: 1
    }
}
127.0.0.1:3000/delete
-------------search-------- GET ----------
{
   name: 'abc'
}
127.0.0.1:3000/search/:name