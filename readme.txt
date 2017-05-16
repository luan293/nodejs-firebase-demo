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
--------logout-------- POST ---------
{
	key: 'abc'
}
--------register------- POST -----------
{
	username: 'abc',
    password: 'def'
}
--------edit---------- PUT -------------
{
    key: '1a3',
    username: 'abc',
    password: 'def'
}
---------delete-------- DELETE ----------
{
	user: {
      key: '1a3'
    },
    admin: {
      role: 1
    }
}
-------------search-------- GET ----------
{
   name: 'abc'
}